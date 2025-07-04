import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import type { CashReportData } from './CashReportCard';

interface CashReportTableProps {
  reports: CashReportData[];
  onApprove?: (id: string) => void;
  approvingId?: string | null;
}

const statusColors: Record<CashReportData['status'], string> = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800'
};

export function CashReportTable({ reports, onApprove, approvingId }: CashReportTableProps) {
  if (!reports.length) {
    return <div className="text-center py-8 text-muted-foreground">No reports found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Station</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Cash</TableHead>
          <TableHead className="text-right">Sales</TableHead>
          <TableHead className="text-right">Discrepancy</TableHead>
          <TableHead>Status</TableHead>
          {onApprove && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.stationName}</TableCell>
            <TableCell className="font-mono text-sm">{format(new Date(r.date), 'yyyy-MM-dd')}</TableCell>
            <TableCell className="text-right font-mono">₹{r.cashReceived.toFixed(2)}</TableCell>
            <TableCell className="text-right font-mono">₹{r.salesTotal.toFixed(2)}</TableCell>
            <TableCell className="text-right font-mono">₹{r.discrepancy.toFixed(2)}</TableCell>
            <TableCell>
              <Badge className={statusColors[r.status]}>{r.status}</Badge>
            </TableCell>
            {onApprove && (
              <TableCell>
                {r.status === 'pending' ? (
                  <Button size="sm" onClick={() => onApprove(r.id)} disabled={approvingId===r.id}>
                    {approvingId===r.id ? 'Approving...' : 'Approve'}
                  </Button>
                ) : null}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
