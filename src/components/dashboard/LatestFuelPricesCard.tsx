import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Fuel } from 'lucide-react';
import { useFuelPrices } from '@/hooks/useFuelPrices';

interface DashboardFilters {
  stationId?: string;
}

interface LatestFuelPricesCardProps {
  filters?: DashboardFilters;
}

export function LatestFuelPricesCard({ filters = {} }: LatestFuelPricesCardProps) {
  const { data: prices = [], isLoading } = useFuelPrices();

  const filtered = filters.stationId
    ? prices.filter(p => p.stationId === filters.stationId)
    : prices;

  const latest: Record<string, { price: number; validFrom: string }> = {};
  for (const price of filtered) {
    const existing = latest[price.fuelType];
    if (!existing || new Date(price.validFrom) > new Date(existing.validFrom)) {
      latest[price.fuelType] = { price: price.price, validFrom: price.validFrom };
    }
  }

  const fuelTypes = Object.keys(latest);

  return (
    <Card className="bg-gradient-to-br from-white to-yellow-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-700">
          <Fuel className="h-5 w-5" /> Latest Fuel Prices
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-24 bg-muted animate-pulse rounded" />
        ) : fuelTypes.length ? (
          <ul className="space-y-2">
            {fuelTypes.map(ft => (
              <li key={ft} className="flex justify-between">
                <span className="capitalize">{ft}</span>
                <span className="font-mono">₹{latest[ft].price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No price data available</p>
        )}
      </CardContent>
    </Card>
  );
}
