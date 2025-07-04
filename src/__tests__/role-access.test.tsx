import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import App from '@/App';

// Intercept API calls regardless of origin
const API_BASE = '*/api/v1';

const server = setupServer();

// Default fallback to prevent real network requests
server.use(http.all('*', () => HttpResponse.json({})));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderApp = (route: string) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const loginHandlers = (role: string) =>
  http.post(`${API_BASE}/auth/login`, async (_req, res, ctx) =>
    res(
      ctx.json({
        token: `${role}-token`,
        user: {
          id: '1',
          email: `${role}@test.com`,
          name: `${role} user`,
          role
        }
      })
    )
  );

const superAdminSummary = {
  tenantCount: 3,
  activeTenantCount: 2,
  totalStations: 5,
  totalUsers: 10,
  signupsThisMonth: 1,
  planCount: 1,
  adminCount: 1,
  recentTenants: [],
  tenantsByPlan: []
};

const dashboardDataHandlers = [
  http.get(`${API_BASE}/stations`, () =>
    HttpResponse.json({ stations: [{ id: 's1', name: 'Station 1', status: 'active' }] })
  ),
  http.get(`${API_BASE}/pumps`, () => HttpResponse.json({ pumps: [] })),
  http.get(`${API_BASE}/fuel-prices`, () => HttpResponse.json({ data: [] })),
  http.get(`${API_BASE}/nozzle-readings`, () =>
    HttpResponse.json({ readings: [{ id: 'r1', amount: 100, volume: 50 }] })
  ),
  http.get(`${API_BASE}/analytics/dashboard`, () => HttpResponse.json(superAdminSummary)),
  http.get(`${API_BASE}/admin/dashboard`, () => HttpResponse.json({})),
  http.get(`${API_BASE}/dashboard/system-health`, () =>
    HttpResponse.json({ uptime: 99.9 })
  ),
  http.get(`${API_BASE}/dashboard/payment-methods`, () =>
    HttpResponse.json({ methods: [] })
  ),
  http.get(`${API_BASE}/dashboard/top-creditors`, () =>
    HttpResponse.json({ creditors: [] })
  )
];

const analyticsHandlers = [
  http.get(`${API_BASE}/admin/dashboard`, () => HttpResponse.json(superAdminSummary)),
  http.get(`${API_BASE}/dashboard/system-health`, () => HttpResponse.json({ uptime: 99.9 }))
];

function setAuth(role: string) {
  localStorage.setItem('fuelsync_token', `${role}-token`);
  localStorage.setItem(
    'fuelsync_user',
    JSON.stringify({ id: '1', email: `${role}@test.com`, name: `${role} user`, role })
  );
}

beforeEach(() => {
  localStorage.clear();
});

it('SuperAdmin can access analytics', async () => {
  setAuth('superadmin');
  server.use(...analyticsHandlers);

  renderApp('/superadmin/analytics');

  expect(await screen.findByText(/Platform Analytics/i)).toBeInTheDocument();
  expect(await screen.findByText('3')).toBeInTheDocument();
});

it('Owner can view dashboard and inventory', async () => {
  setAuth('owner');
  server.use(...dashboardDataHandlers);

  renderApp('/dashboard');

  expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument();
  expect(await screen.findByText(/50.00L/i)).toBeInTheDocument();

  userEvent.click(screen.getByText('Fuel Inventory'));
  expect(await screen.findByText(/Fuel Inventory/i)).toBeInTheDocument();
});

it('Manager can view readings but not user management', async () => {
  setAuth('manager');
  server.use(
    http.get(`${API_BASE}/nozzle-readings`, (_req, res, ctx) =>
      res(ctx.json({ readings: [] }))
    )
  );

  renderApp('/dashboard/readings');

  expect(await screen.findByText(/Pump Readings/i)).toBeInTheDocument();

  renderApp('/dashboard/users');
  await waitFor(() => {
    expect(screen.queryByText(/User Management/i)).not.toBeInTheDocument();
  });
});

it('Attendant can record readings only', async () => {
  setAuth('attendant');
  server.use(
    http.get(`${API_BASE}/stations`, (_req, res, ctx) => res(ctx.json({ stations: [] })))
  );

  renderApp('/dashboard/readings/new');

  expect(await screen.findByText(/Record Reading/i)).toBeInTheDocument();

  renderApp('/dashboard/stations');
  await waitFor(() => {
    expect(screen.queryByText(/Fuel Stations/i)).not.toBeInTheDocument();
  });
});
