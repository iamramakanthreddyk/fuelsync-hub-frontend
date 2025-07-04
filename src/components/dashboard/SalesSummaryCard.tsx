
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';
import { useSalesSummary } from '@/hooks/useDashboard';
import { ErrorFallback } from '@/components/common/ErrorFallback';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface SalesSummaryCardProps {
  filters?: DashboardFilters;
}

export function SalesSummaryCard({ filters = {} }: SalesSummaryCardProps) {
  const { data: summary, isLoading, error, refetch } = useSalesSummary('monthly', filters);

  if (error) {
    return <ErrorFallback error={error} onRetry={() => refetch()} title="Sales Summary" />;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {filters.stationId ? 'Station Sales' : 'Total Sales'}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">₹{summary?.totalSales?.toLocaleString() || 0}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            {summary?.transactionCount || 0} transactions • {summary?.totalVolume?.toLocaleString() || 0}L sold
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit Metrics</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{summary?.profitMargin?.toFixed(1) || 0}%</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Percent className="h-3 w-3 mr-1 text-green-500" />
            Profit Margin
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
