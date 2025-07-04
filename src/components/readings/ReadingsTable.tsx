
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
              {(r as any).pumpName ? (
                <span className="font-medium">{(r as any).pumpName}</span>
              ) : (
                <span>Nozzle {(r as any).nozzleNumber ?? r.nozzleId}</span>
              )}
            </TableCell>
            <TableCell>{(r as any).stationName || 'N/A'}</TableCell>
            <TableCell className="font-mono text-sm">
              {formatShortDateTime(r.createdAt || (r as any).recordedAt)}
            </TableCell>
            <TableCell className="text-right font-mono">
              {formatReading(r.reading)} L
            </TableCell>
            <TableCell className="text-right font-mono">
              {(r as any).deltaVolume !== undefined
                ? `${formatReading((r as any).deltaVolume)} L`
                : (r as any).previousReading !== undefined
                ? `${formatReading(r.reading - ((r as any).previousReading || 0))} L`
                : 'N/A'}
            </TableCell>
            <TableCell className="text-right font-mono">
              {(r as any).pricePerLitre !== undefined ? formatPrice((r as any).pricePerLitre) : 'N/A'}
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
