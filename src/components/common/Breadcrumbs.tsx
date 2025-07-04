import { Link, useLocation, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useStation } from '@/hooks/api/useStations';
import { usePump } from '@/hooks/api/usePumps';
import { useNozzle } from '@/hooks/api/useNozzles';

/**
 * Shared breadcrumbs component that builds a trail based on the current route
 * and parent entity names (station, pump, nozzle).
 */
export function Breadcrumbs() {
  const location = useLocation();
  const { stationId, pumpId, nozzleId } = useParams<{
    stationId?: string;
    pumpId?: string;
    nozzleId?: string;
  }>();

  const { data: station } = useStation(stationId ?? '');
  const { data: pump } = usePump(pumpId ?? '');
  const { data: nozzle } = useNozzle(nozzleId ?? '');

  const items: { label: string; href: string }[] = [
    { label: 'Dashboard', href: '/dashboard' },
  ];

  if (stationId) {
    items.push({ label: 'Stations', href: '/dashboard/stations' });
    items.push({
      label: station?.name || 'Station',
      href: `/dashboard/stations/${stationId}`,
    });
  }

  if (pumpId) {
    const base = stationId
      ? `/dashboard/stations/${stationId}/pumps`
      : '/dashboard/pumps';
    items.push({ label: 'Pumps', href: base });
    items.push({
      label: pump?.name || 'Pump',
      href: `${base}/${pumpId}`,
    });
  }

  if (nozzleId) {
    const base = stationId && pumpId
      ? `/dashboard/stations/${stationId}/pumps/${pumpId}/nozzles`
      : pumpId
      ? `/dashboard/pumps/${pumpId}/nozzles`
      : '/dashboard/nozzles';
    items.push({ label: 'Nozzles', href: base });
    items.push({
      label: nozzle ? `Nozzle ${nozzle.nozzleNumber}` : 'Nozzle',
      href: `${base}/${nozzleId}`,
    });
  }

  if (location.pathname.endsWith('/new')) {
    items.push({ label: 'New', href: location.pathname });
  } else if (location.pathname.endsWith('/edit')) {
    items.push({ label: 'Edit', href: location.pathname });
  }

  const lastIndex = items.length - 1;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, idx) => (
          <BreadcrumbItem key={idx}>
            {idx === lastIndex ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to={item.href}>{item.label}</Link>
              </BreadcrumbLink>
            )}
            {idx < lastIndex && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
