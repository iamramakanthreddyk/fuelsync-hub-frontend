# Role API Implementation Matrix

This matrix cross-references frontend components and hooks with backend API endpoints for each user role. It is derived from the OpenAPI spec (`docs/openapi-spec.yaml`), the current API services (`src/api/`), page components (`src/pages/`), and existing role documentation.

| Role | API Endpoint | Hook Used | Component | Status |
|------|--------------|-----------|-----------|--------|
| **SuperAdmin** | `/admin/auth/login` | `useContractLogin` (`isAdminLogin=true`) | `LoginPage.tsx` | ✅ |
|  | `/admin/dashboard` | `useDashboardMetrics` | `superadmin/OverviewPage.tsx` | ✅ |
|  | `/admin/tenants` | `useTenants` | `superadmin/TenantsPage.tsx` | ✅ |
|  | `/admin/plans` | `usePlans` | `superadmin/PlansPage.tsx` | ✅ |
| **Owner** | `/stations` | `useContractStations` | `dashboard/StationsPage.tsx` | ✅ |
|  | `/dashboard/*` | `useDashboard` | `dashboard/SummaryPage.tsx` | ⚠️ |
|  | `/users` | `useUsers` | `dashboard/UsersPage.tsx` | ⚠️ |
|  | `/reports/sales` | `useReports` | `dashboard/ReportsPage.tsx` | ⚠️ |
| **Manager** | `/pumps` | `usePumps` | `dashboard/PumpsPage.tsx` | ⚠️ |
|  | `/nozzles` | `useNozzles` | `dashboard/NozzlesPage.tsx` | ⚠️ |
|  | `/nozzle-readings` | `useReadings` | `dashboard/NewReadingPage.tsx` | ⚠️ |
|  | `/fuel-prices` | `useFuelPrices` | `dashboard/FuelPricesPage.tsx` | ⚠️ |
| **Attendant** | `/attendant/stations` | `useAttendantStations` | `dashboard/StationsPage.tsx` | ✅ |
|  | `/attendant/cash-report` | `useCashReports` | custom cash report component | ✅ |
|  | `/attendant/alerts` | `useAttendantAlerts` | `dashboard/AlertsPage.tsx` | ✅ |

**Legend**

- ✅ – Fully implemented and aligned with OpenAPI and role requirements
- ⚠️ – Partially implemented or uses legacy API functions
- ❌ – Not implemented yet

This matrix helps track which parts of the frontend rely on contract‑aligned services and highlights areas that still use legacy API calls.
