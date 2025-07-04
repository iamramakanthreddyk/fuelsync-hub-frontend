/**
 * @file pages/dashboard/CashReportsListPage.tsx
 * @description Page for viewing cash reports history
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStations } from '@/hooks/useStations';
import { useCashReports } from '@/hooks/useAttendant';
import { useReconciliationHistory, useApproveReconciliation } from '@/hooks/useReconciliation';
import { format } from 'date-fns';
import { ArrowLeft, RefreshCw, Loader2, DollarSign } from 'lucide-react';
import { CashReportCard, CashReportData } from '@/components/reports/CashReportCard';
import { CashReportTable } from '@/components/reports/CashReportTable';

export default function CashReportsListPage() {
  useRoleGuard(['owner', 'manager', 'attendant']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState('');
  const isAttendant = user?.role === 'attendant';

  const { data: stations = [], isLoading: stationsLoading } = useStations();

  const {
    data: attendantReports = [],
    isLoading: attendantLoading,
    refetch: refetchAttendant
  } = useCashReports();

  const {
    data: reconciliationReports = [],
    isLoading: reconLoading,
    refetch: refetchRecon
  } = useReconciliationHistory(selectedStationId);

  const approveMutation = useApproveReconciliation();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (isAttendant) {
      await refetchAttendant();
    } else {
      await refetchRecon();
    }
    setIsRefreshing(false);
  };

  const isLoading = stationsLoading || (isAttendant ? attendantLoading : reconLoading);

  const mappedReports: CashReportData[] = isAttendant
    ? attendantReports.map((r) => ({
        id: r.id || '',
        stationName: stations.find((s) => s.id === r.stationId)?.name || 'Unknown',
        date: r.date,
        cashReceived: r.cashAmount,
        salesTotal: r.cashAmount,
        discrepancy: 0,
        status: r.status || 'pending'
      }))
    : reconciliationReports.map((r) => ({
        id: r.id,
        stationName: r.stationName,
        date: r.reconciliationDate,
        cashReceived: r.declaredCash,
        salesTotal: r.totalSales,
        discrepancy: r.variance,
        status: (r.status as 'pending' | 'approved' | 'rejected') || 'pending'
      }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Cash Reports</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {!isAttendant && (
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              className="border p-2 rounded"
              value={selectedStationId}
              onChange={(e) => setSelectedStationId(e.target.value)}
            >
              <option value="">All Stations</option>
              {stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      )}

      {mappedReports.length === 0 ? (
        <div className="text-center py-6">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No cash reports found</h3>
          {isAttendant && (
            <>
              <p className="text-muted-foreground mb-4">You haven't submitted any cash reports yet</p>
              <Button onClick={() => navigate('/dashboard/cash-report/new')}>Submit New Cash Report</Button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {isAttendant ? (
            mappedReports.map((r) => (
              <CashReportCard key={r.id} report={r} />
            ))
          ) : (
            <CashReportTable
              reports={mappedReports}
              onApprove={(id) => approveMutation.mutate(id)}
              approvingId={approveMutation.isPending ? (approveMutation.variables as string) : null}
            />
          )}
        </div>
      )}
    </div>
  );
}
