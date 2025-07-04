import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export interface CashReportData {
  id: string;
  stationName: string;
  date: string;
  cashReceived: number;
  salesTotal: number;
  discrepancy: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface CashReportCardProps {
  report: CashReportData;
  onApprove?: (id: string) => void;
  disabled?: boolean;
}

const statusColors: Record<CashReportData['status'], string> = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800'
};

export function CashReportCard({ report, onApprove, disabled }: CashReportCardProps) {
  const handleApprove = () => {
    if (onApprove) onApprove(report.id);
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-base font-medium">
            {report.stationName}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(new Date(report.date), 'MMM d, yyyy')}
          </p>
        </div>
        <Badge className={statusColors[report.status]}>{report.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Cash:</span>
            <span className="ml-1 font-medium">₹{report.cashReceived.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Sales:</span>
            <span className="ml-1 font-medium">₹{report.salesTotal.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Discrepancy:</span>
            <span className="ml-1 font-medium">₹{report.discrepancy.toFixed(2)}</span>
          </div>
        </div>
        {onApprove && report.status === 'pending' && (
          <Button size="sm" onClick={handleApprove} disabled={disabled}>
            Approve
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
