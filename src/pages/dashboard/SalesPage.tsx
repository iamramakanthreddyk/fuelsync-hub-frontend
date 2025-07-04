
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesTable } from '@/components/sales/SalesTable';
import { StationSelector } from '@/components/filters/StationSelector';
import { DateRangePicker } from '@/components/filters/DateRangePicker';
import { useEnhancedSales } from '@/hooks/useEnhancedSales';
import { SalesFilters } from '@/api/sales';
import { DollarSign, TrendingUp, CreditCard, Users, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { formatCurrency, formatVolume, formatSafeNumber } from '@/utils/formatters';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export default function SalesPage() {
  useRoleGuard(['owner', 'manager']);
  const [selectedStation, setSelectedStation] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  const filters: SalesFilters = {
    stationId: selectedStation,
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString(),
  };
  
  const { data: sales = [], isLoading } = useEnhancedSales(filters);
  const { data: features } = useFeatureFlags();

  // Calculate summary stats with safe number handling
  const totalAmount = sales.reduce((sum, sale) => {
    const amount = typeof sale.amount === 'number' ? sale.amount : 0;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  const totalVolume = sales.reduce((sum, sale) => {
    const volume = typeof sale.volume === 'number' ? sale.volume : 0;
    return sum + (isNaN(volume) ? 0 : volume);
  }, 0);
  
  const creditSales = sales.filter(sale => sale.paymentMethod === 'credit');
  const creditAmount = creditSales.reduce((sum, sale) => {
    const amount = typeof sale.amount === 'number' ? sale.amount : 0;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  const postedSales = sales.filter(sale => sale.status === 'posted');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Sales Management
          </h1>
          <p className="text-muted-foreground">
            View and analyze all sales transactions across stations
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-green-600" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <StationSelector
              value={selectedStation}
              onChange={setSelectedStation}
              showAll={true}
              placeholder="All Stations"
            />
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="Select date range"
            />
            {features?.allowExport && (
              <Button variant="outline" className="bg-white">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {formatSafeNumber(sales.length, 0)} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{formatVolume(totalVolume)}</div>
            <p className="text-xs text-muted-foreground">
              Fuel dispensed
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{formatCurrency(creditAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {formatSafeNumber(creditSales.length, 0)} credit transactions
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posted Sales</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{formatSafeNumber(postedSales.length, 0)}</div>
            <p className="text-xs text-muted-foreground">
              of {formatSafeNumber(sales.length, 0)} total sales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Transactions</CardTitle>
          <CardDescription>
            {selectedStation ? 'Station-specific' : 'All'} sales generated from nozzle readings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SalesTable sales={sales} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
