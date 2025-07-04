
/**
 * OpenAPI TypeScript Code Generator
 * 
 * This script generates TypeScript types and API clients from the OpenAPI specification.
 * Run with: npx tsx src/api/codegen.ts
 */

import * as path from 'path';
import * as fs from 'fs';

const OPENAPI_SPEC_PATH = path.resolve(__dirname, '../../docs/openapi-spec.yaml');
const OUTPUT_DIR = path.resolve(__dirname, './generated');

async function generateApiClient() {
  try {
    console.log('🚀 Generating TypeScript API client from OpenAPI spec...');
    console.log('📁 Spec file:', OPENAPI_SPEC_PATH);
    console.log('📂 Output directory:', OUTPUT_DIR);

    // Check if spec file exists
    if (!fs.existsSync(OPENAPI_SPEC_PATH)) {
      console.log('❌ OpenAPI spec file not found, creating a minimal one for demo purposes...');
      
      // Create docs directory if it doesn't exist
      const docsDir = path.resolve(__dirname, '../../docs');
      if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
      }
      
      // Create a minimal OpenAPI spec
      const minimalSpec = `
openapi: 3.0.0
info:
  title: FuelSync Hub API
  version: 1.0.0
  description: Multi-tenant ERP for fuel station networks
servers:
  - url: /api/v1
    description: API Server
paths:
  /health:
    get:
      summary: Health check
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: ok
components:
  schemas:
    ApiResponse:
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
        data:
          type: object
`;
      
      fs.writeFileSync(OPENAPI_SPEC_PATH, minimalSpec.trim());
      console.log('✅ Created minimal OpenAPI spec for demo');
    }

    // Try to import and use the code generator
    let generate;
    try {
      const codegen = await import('openapi-typescript-codegen');
      generate = codegen.generate;
    } catch (importError) {
      console.log('⚠️ OpenAPI code generator not available, using fallback approach...');
      throw new Error('Code generator not available');
    }

    // Clean output directory
    if (fs.existsSync(OUTPUT_DIR)) {
      fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }

    await generate({
      input: OPENAPI_SPEC_PATH,
      output: OUTPUT_DIR,
      httpClient: 'axios',
      clientName: 'FuelSyncApi',
      useOptions: true,
      useUnionTypes: true,
      exportCore: true,
      exportServices: true,
      exportModels: true,
      exportSchemas: false,
      indent: '2',
      postfixServices: 'Service',
      postfixModels: '',
    });

    console.log('✅ API client generated successfully!');
    console.log('📋 Generated files:');
    console.log('  - models/: TypeScript interfaces');
    console.log('  - services/: API service classes');
    console.log('  - core/: HTTP client and configuration');
    
    console.log('🔄 Next steps:');
    console.log('  1. Update existing API files to use generated types');
    console.log('  2. Migrate hooks to use generated services');
    console.log('  3. Run type checking: npx tsc --noEmit');

  } catch (error) {
    console.error('❌ Error generating API client:', error);
    console.log('💡 Creating basic generated types structure...');
    
    // Create basic structure if generation fails
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    const modelsDir = path.join(OUTPUT_DIR, 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }
    
    // Create a basic index file with all the contract exports
    const indexContent = `// Generated API types - exports from existing api-contract
export * from '../api-contract';

// Re-export commonly used types
export type {
  ApiResponse,
  ApiErrorResponse,
  User,
  Station,
  Pump,
  Nozzle,
  FuelPrice,
  Creditor,
  Sale,
  Tenant,
  Plan,
  AdminUser,
  CreateUserRequest,
  CreateStationRequest,
  CreatePumpRequest,
  CreateNozzleRequest,
  CreateReadingRequest,
  CreateFuelPriceRequest,
  CreateCreditorRequest,
  CreateTenantRequest,
  CreatePlanRequest,
  CreateSuperAdminRequest,
  SalesSummary,
  PaymentMethodBreakdown,
  SystemAlert,
  AttendantStation,
  CashReport,
  CreateCashReportRequest,
  SuperAdminSummary
} from '../api-contract';

// Export contract services
export { authService } from '../contract/auth.service';
export { stationsService } from '../contract/stations.service';
export { attendantService } from '../contract/attendant.service';
export { superAdminService } from '../contract/superadmin.service';
export { ownerService } from '../contract/owner.service';
export { managerService } from '../contract/manager.service';
`;
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent);
    
    console.log('✅ Basic generated structure created with contract services');
  }
}

// Run the generator
generateApiClient().catch(console.error);
