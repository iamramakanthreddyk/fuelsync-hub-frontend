# STEP_3_9_COMMAND.md — Pumps & Nozzles UI refactor

## Project Context Summary
FuelSync Hub is a multi‑tenant SaaS for fuel station networks. Frontend pages under `src/pages/dashboard` use React Router with role-based access. Recent steps added colorful Station cards and UI refreshes. Pumps and Nozzles pages still use older layouts and partial actions.

## Steps Already Implemented
- Stations page refactor using `StationCard` and floating create button (`STEP_fix_20251209.md`).
- Contract-compliant pumps/nozzles hooks and services (see `src/hooks/useContractPumps.ts` and `useContractNozzles.ts`).
- ProtectedRoute component for role-based pages.

## What to Build Now, Where, and Why
- Update `PumpsPage.tsx` and `NozzlesPage.tsx` to use consistent `PumpCard`/`NozzleCard` layouts with View/Edit/Delete actions and floating "Create" buttons.
- Ensure back navigation to station and pump detail pages.
- Replace direct fetch calls with React Query hooks (`useCreatePump`, `useDeletePump`, etc.) that follow the OpenAPI response `{success,data}`.
- Add `updatePump` to `src/api/pumps.ts` and wire `useUpdatePump` hook to this API.
- Wrap pump and nozzle routes in `App.tsx` with `<ProtectedRoute allowedRoles=['owner','manager']>` so attendants cannot access them.

## Required Documentation Updates
- Record changelog entry under Enhancements.
- Append row to `fuelsync/docs/IMPLEMENTATION_INDEX.md` and mark step done in `PHASE_3_SUMMARY.md`.
