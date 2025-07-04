# Frontend-Backend API Mismatches

## Updated Alignment
The OpenAPI specification in `docs/openapi-spec.yaml` is the primary source of truth for backend capabilities. The majority of the frontend API clients match the specification.

After reviewing the current frontend code against the spec, only two endpoints are referenced by the frontend but do not exist in the specification:

1. `GET /reports/sales/{id}` – used to fetch a single sales report.
2. `GET /nozzle-readings/{id}` – used to fetch a specific nozzle reading.

If these endpoints are required, they should be added to the OpenAPI document and implemented on the backend. All other frontend calls correspond to documented paths.

## Previous Notes
Earlier sections of this file listed many mismatches (optional fields, naming conventions, additional endpoints). Those issues have been addressed or were based on outdated documentation. To avoid confusion they have been removed.
