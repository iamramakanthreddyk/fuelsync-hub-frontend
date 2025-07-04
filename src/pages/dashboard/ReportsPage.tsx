/**
 * @file pages/dashboard/ReportsPage.tsx
 * @description Filterable sales reports with export options
 */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useSalesReport, useExportSalesReport } from '@/hooks/useReports';
import { SalesReportFilters } from '@/api/api-contract';
import { SalesReportFilters as FiltersForm } from '@/components/reports/SalesReportFilters';
import { SalesReportSummary } from '@/components/reports/SalesReportSummary';
import { SalesReportTable } from '@/components/reports/SalesReportTable';
import { CSVExportButton } from '@/components/reports/CSVExportButton';

export default function ReportsPage() {
  useRoleGuard(['owner', 'manager']);

  const [filters, setFilters] = useState<SalesReportFilters>({
    startDate: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    stationId: undefined,
    fuelType: undefined,
    paymentMethod: undefined,
    groupBy: 'day',
  });

  const { data, isLoading } = useSalesReport(filters);
  const exportPdf = useExportSalesReport({ ...filters, format: 'pdf' });

  const handleExportPdf = () => {
    exportPdf.mutate(undefined, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sales-report.pdf';
        link.click();
        URL.revokeObjectURL(url);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sales Reports</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Historical sales data with flexible filtering and export
        </p>
      </div>

      <FiltersForm filters={filters} onFiltersChange={setFilters} />

      <div className="flex gap-3">
        <CSVExportButton filters={filters} />
        <Button onClick={handleExportPdf} disabled={exportPdf.isPending} variant="outline">
          {exportPdf.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {!isLoading && data && (
        <>
          <SalesReportSummary summary={data.summary} />
          <Card>
            <CardHeader>
              <CardTitle>Sales Details</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesReportTable data={data.data} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
