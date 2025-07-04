# STEP_3_11_COMMAND.md — Refactor ReportsPage for filterable sales reports

## Project Context Summary
FuelSync Hub is a multi-tenant ERP for fuel stations. The frontend already includes components for sales reports (filters, table, summary) but `ReportsPage` only lists generated reports without filters or export options. Step 3.10 added cash reports summary.

## Steps Already Implemented
- Cash reports summary page using report components (step 3.10)
- Sales reporting hooks and components under `src/components/reports/`

## What to Build Now, Where, and Why
- Refactor `src/pages/dashboard/ReportsPage.tsx` to show a filterable sales report instead of generated report list.
- Use `SalesReportFilters`, `SalesReportSummary` and `SalesReportTable` components.
- Fetch data via `useSalesReport` with filters: stationId, fuelType, paymentMethod, date range, groupBy.
- Add export controls using `CSVExportButton` and `useExportSalesReport` for PDF.
- Update `SalesReportFilters` to include fuel type and group by selectors.
- Restrict route in `src/App.tsx` with `<ProtectedRoute allowedRoles={['owner','manager']}>`.

## Required Documentation Updates
- Add changelog entry under Features.
- Append row to `fuelsync/docs/IMPLEMENTATION_INDEX.md`.
- Summarise step in `fuelsync/docs/PHASE_3_SUMMARY.md`.
