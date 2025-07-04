
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { useCompareStations } from '@/hooks/useAnalytics';
import { Building2 } from 'lucide-react';

interface StationComparisonChartProps {
  stationIds: string[];
  period?: string;
}

export function StationComparisonChart({ stationIds, period = 'month' }: StationComparisonChartProps) {
  const { data: comparisonData = [], isLoading } = useCompareStations({
    stationIds, 
    period 
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Station Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    sales: { label: 'Sales (₹)', color: '#3b82f6' },
    volume: { label: 'Volume (L)', color: '#22c55e' },
    transactions: { label: 'Transactions', color: '#f59e0b' },
  };

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Station Performance Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="stationName" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="sales" fill={chartConfig.sales.color} name="Sales (₹)" />
              <Bar dataKey="volume" fill={chartConfig.volume.color} name="Volume (L)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
