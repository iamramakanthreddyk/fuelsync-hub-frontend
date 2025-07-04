
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { usePaymentMethodBreakdown } from '@/hooks/useDashboard';
import { useWindowSize } from '@/hooks/use-window-size';

const COLORS = {
  cash: '#22c55e',
  card: '#3b82f6',
  upi: '#8b5cf6',
  credit: '#f59e0b',
};

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface PaymentMethodChartProps {
  filters?: DashboardFilters;
}

export function PaymentMethodChart({ filters = {} }: PaymentMethodChartProps) {
  const { data: breakdown = [], isLoading } = usePaymentMethodBreakdown(filters);
  const { width } = useWindowSize();

  const isSmall = width < 640;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const chartData = breakdown.map(item => ({
    name: item.method,
    value: item.amount,
    percentage: item.percentage,
  }));

  const chartConfig = {
    cash: { label: 'Cash', color: COLORS.cash },
    card: { label: 'Card', color: COLORS.card },
    upi: { label: 'UPI', color: COLORS.upi },
    credit: { label: 'Credit', color: COLORS.credit },
  };

  const chartHeight = isSmall ? 200 : 300;
  const outerRadius = isSmall ? 80 : 100;

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-700">Payment Method Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={outerRadius}
                dataKey="value"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS] || '#gray'} 
                  />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
