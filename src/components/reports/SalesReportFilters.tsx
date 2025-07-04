
import { useQuery } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { stationsApi } from '@/api/stations';
import type { SalesReportFilters } from '@/api/api-contract';

interface SalesReportFiltersProps {
  filters: SalesReportFilters;
  onFiltersChange: (filters: SalesReportFilters) => void;
}

export function SalesReportFilters({ filters, onFiltersChange }: SalesReportFiltersProps) {
  const { data: stations } = useQuery({
    queryKey: ['stations'],
    queryFn: () => stationsApi.getStations(),
  });

  const handleFilterChange = (key: keyof SalesReportFilters, value: string) => {
    // If value is 'all', treat it as undefined (no filter)
    const effectiveValue = value === 'all' ? undefined : value;
    onFiltersChange({ ...filters, [key]: effectiveValue });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Station</Label>
            <Select
              value={filters.stationId || 'all'}
              onValueChange={(value) => handleFilterChange('stationId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All stations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stations</SelectItem>
                {stations?.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
              value={filters.paymentMethod || 'all'}
              onValueChange={(value) => handleFilterChange('paymentMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fuel Type</Label>
            <Select
              value={filters.fuelType || 'all'}
              onValueChange={(value) => handleFilterChange('fuelType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Group By</Label>
            <Select
              value={filters.groupBy || 'day'}
              onValueChange={(value) => handleFilterChange('groupBy', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="station">Station</SelectItem>
                <SelectItem value="fuelType">Fuel Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
      </div>
      </CardContent>
    </Card>
  );
}
