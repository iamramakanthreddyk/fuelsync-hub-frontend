# Frontend-Backend API Mismatches

## Updated Alignment
The OpenAPI specification in `docs/openapi-spec.yaml` is the primary source of truth for backend capabilities. The majority of the frontend API clients match the specification.

After reviewing the current frontend code against the spec, **no mismatched endpoints remain**.

Previous references to `GET /reports/sales/{id}` and `GET /nozzle-readings/{id}` have been removed from the codebase.

All frontend calls now correspond to documented paths in the OpenAPI specification.

## Previous Notes
Earlier sections of this file listed many mismatches (optional fields, naming conventions, additional endpoints). Those issues have been addressed or were based on outdated documentation. To avoid confusion they have been removed.
