import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { NozzleReading } from '@/api/api-contract';
import { formatShortDateTime, formatReading, formatVolume, formatPrice, formatCurrency } from '@/utils/formatters';

interface ReadingsTableProps {
  readings: NozzleReading[];
  isLoading?: boolean;
}

export function ReadingsTable({ readings, isLoading }: ReadingsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (!readings.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No readings found for the selected filters.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nozzle</TableHead>
          <TableHead>Station</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Cumulative</TableHead>
          <TableHead className="text-right">Delta</TableHead>
          <TableHead className="text-right">Price/L</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {readings.map((r) => (
          <TableRow key={r.id}>
            <TableCell>
              {r.pumpName ? (
                <span className="font-medium">{r.pumpName}</span>
              ) : (
                <span>Nozzle {r.nozzleNumber ?? r.nozzleId}</span>
              )}
            </TableCell>
            <TableCell>{r.stationName || 'N/A'}</TableCell>
            <TableCell className="font-mono text-sm">
              {formatShortDateTime(r.createdAt || r.recordedAt)}
            </TableCell>
            <TableCell className="text-right font-mono">
              {formatReading(r.reading)} L
            </TableCell>
            <TableCell className="text-right font-mono">
              {r.deltaVolume !== undefined
                ? `${formatReading(r.deltaVolume)} L`
                : r.previousReading !== undefined
                ? `${formatReading(r.reading - (r.previousReading || 0))} L`
                : 'N/A'}
            </TableCell>
            <TableCell className="text-right font-mono">
              {r.pricePerLitre !== undefined ? formatPrice(r.pricePerLitre) : 'N/A'}
            </TableCell>
            <TableCell className="text-right font-mono font-medium">
              {r.amount !== undefined ? formatCurrency(r.amount) : 'N/A'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
