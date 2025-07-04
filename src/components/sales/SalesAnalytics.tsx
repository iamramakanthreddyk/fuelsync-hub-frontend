import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSalesAnalytics } from '@/hooks/useSalesAnalytics';
import { ErrorFallback } from '@/components/common/ErrorFallback';

export function SalesAnalytics() {
  const { data, isLoading, error, refetch } = useSalesAnalytics();

  if (error) {
    return <ErrorFallback error={error} onRetry={() => refetch()} title="Sales Analytics" />;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(data, null, 2)}</pre>
      </CardContent>
    </Card>
  );
}

