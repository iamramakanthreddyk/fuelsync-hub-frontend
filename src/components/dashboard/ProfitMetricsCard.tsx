
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Percent } from 'lucide-react';
import { useSalesSummary } from '@/hooks/useDashboard';
import { ErrorFallback } from '@/components/common/ErrorFallback';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface ProfitMetricsCardProps {
  filters?: DashboardFilters;
}

export function ProfitMetricsCard({ filters = {} }: ProfitMetricsCardProps) {
  const { data: summary, isLoading, error, refetch } = useSalesSummary('monthly', filters);

  if (error) {
    return <ErrorFallback error={error} onRetry={() => refetch()} compact />;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Profit Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
        </CardContent>
      </Card>
    );
  }

  const totalProfit = summary?.totalProfit || 0;
  const profitMarginPercentage = summary?.profitMargin || 0;

  return (
    <Card className="bg-gradient-to-br from-white to-green-50 border-green-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Profit Metrics</CardTitle>
        <TrendingUp className="h-4 w-4 text-green-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <div className="text-2xl font-bold text-green-700">₹{totalProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Profit</p>
          </div>
          <div className="flex items-center gap-2">
            <Percent className="h-3 w-3 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              {profitMarginPercentage.toFixed(1)}% margin
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
