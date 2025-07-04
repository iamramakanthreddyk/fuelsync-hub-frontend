
# Backend Requirements Documentation

## Contract-Aligned API Endpoints Status

### ✅ **Ready to Use (Assumed Working)**
Based on OpenAPI spec, these endpoints should be working:

#### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/admin/auth/login` - SuperAdmin login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh JWT token

#### Stations Management
- `GET /api/v1/stations` - List stations
- `POST /api/v1/stations` - Create station
- `GET /api/v1/stations/{id}` - Get station details
- `PUT /api/v1/stations/{id}` - Update station
- `DELETE /api/v1/stations/{id}` - Delete station

#### Pumps Management
- `GET /api/v1/pumps?stationId={id}` - List pumps for station
- `POST /api/v1/pumps` - Create pump
- `GET /api/v1/pumps/{id}` - Get pump details
- `PUT /api/v1/pumps/{id}` - Update pump
- `DELETE /api/v1/pumps/{id}` - Delete pump

**Schema Requirements:**
```json
{
  "name": "string",           // NOT "label"
  "serialNumber": "string",
  "stationId": "string"
}
```

#### Nozzles Management
- `GET /api/v1/nozzles?pumpId={id}` - List nozzles for pump
- `POST /api/v1/nozzles` - Create nozzle
- `GET /api/v1/nozzles/{id}` - Get nozzle details
- `PUT /api/v1/nozzles/{id}` - Update nozzle
- `DELETE /api/v1/nozzles/{id}` - Delete nozzle

**Schema Requirements:**
```json
{
  "pumpId": "string",
  "nozzleNumber": number,
  "fuelType": "petrol" | "diesel" | "premium",  // NOT "kerosene"
  "status": "active" | "inactive" | "maintenance"
}
```

#### Readings Management
- `POST /api/v1/nozzle-readings` - Create reading
- `GET /api/v1/nozzle-readings` - List readings (with filters)
- `GET /api/v1/nozzle-readings/can-create/{nozzleId}` - Check if reading can be created

**Schema Requirements:**
```json
{
  "nozzleId": "string",
  "reading": number,
  "recordedAt": "2024-01-01T10:00:00Z",
  "paymentMethod": "cash" | "card" | "upi" | "credit",
  "creditorId": "string" // optional, required for credit payments
}
```

#### Fuel Prices Management ✅ **IMPROVED**
- `GET /api/v1/fuel-prices` - List fuel prices with station names
- `POST /api/v1/fuel-prices` - Create fuel price
- `PUT /api/v1/fuel-prices/{id}` - Update fuel price
- `DELETE /api/v1/fuel-prices/{id}` - Delete fuel price
- `GET /api/v1/fuel-prices/validate/{stationId}` - Validate station prices
- `GET /api/v1/fuel-prices/missing` - Get stations missing prices

**REQUIRED: Include Station Names in Response**
The OpenAPI specification defines a FuelPrice object that contains a nested station relationship:

```json
// Expected response structure with station relationship
{
  "success": true,
  "data": {
    "prices": [
      {
        "id": "uuid",
        "station_id": "uuid",
        "fuel_type": "premium",
        "price": "66",
        "valid_from": "2025-07-01T21:18:00.000Z",
        "created_at": "2025-07-01T21:18:15.910Z",
        "station": {
          "id": "uuid",
          "name": "Station Name"
        }
      }
    ]
  }
}
```

### 🔄 **Critical Issues Fixed in This Update**

#### ✅ Responsive Design
- ✅ **Header Component** - Responsive layout, mobile-friendly user dropdown
- ✅ **Sidebar Component** - Mobile navigation with hamburger menu support
- ✅ **Login Page** - Complete redesign with modern, professional appearance
- ✅ **Dark Mode Support** - Fixed sidebar visibility issues in dark theme

#### ✅ Navigation & Accessibility  
- ✅ **Readings Page Access** - Added proper navigation links and route setup
- ✅ **New Reading Page** - Created dedicated page for reading entry
- ✅ **SuperAdmin Analytics** - Fixed error handling and loading states
- ✅ **Role-based Menu Items** - Different navigation based on user roles

#### ✅ User Experience Improvements
- ✅ **Mobile Responsive Tables** - All data tables now work on mobile devices
- ✅ **Loading States** - Proper skeletons and loading indicators
- ✅ **Error Handling** - Meaningful error messages with retry options
- ✅ **Toast Notifications** - Success/error feedback for all actions

## Current Status
The backend endpoints documented in `docs/openapi-spec.yaml` now align with the frontend code. Earlier notes about missing endpoints (such as SuperAdmin analytics or fuel inventory) were based on older drafts and have been removed. Any new endpoints should first be added to the OpenAPI specification.
