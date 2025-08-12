# API Usage Examples

This file contains example API requests for testing the CRM backend.

## Prerequisites

1. Start the development server: `npm run dev`
2. Seed the database: `npm run seed`
3. Server running on: `http://localhost:3001`

## Authentication Examples

### 1. User Signup

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Admin",
    "email": "admin@example.com",
    "password": "securepassword123",
    "role_id": "role_admin"
  }'
```

### 2. User Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepassword123"
  }'
```

**Save the token from the response for subsequent requests!**

## Protected Endpoints (Require Authentication)

Replace `<YOUR_JWT_TOKEN>` with the actual token from login response.

### Users API

#### Get All Users (ADMIN only)
```bash
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

#### Get Current User Profile
```bash
curl -X GET http://localhost:3001/api/users/<USER_ID> \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

#### Create New User (ADMIN only)
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sales User",
    "email": "sales@example.com",
    "password": "password123",
    "role_id": "role_sales"
  }'
```

### Leads API

#### Create Lead
```bash
curl -X POST http://localhost:3001/api/leads \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "phone": "+1234567890",
    "company": "ABC Corp",
    "source": "Website",
    "notes": "Interested in our premium package",
    "status_id": "status_new"
  }'
```

#### Get All Leads
```bash
curl -X GET http://localhost:3001/api/leads \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

#### Get Lead by ID
```bash
curl -X GET http://localhost:3001/api/leads/<LEAD_ID> \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

#### Update Lead
```bash
curl -X PUT http://localhost:3001/api/leads/<LEAD_ID> \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "phone": "+1234567890",
    "company": "ABC Corp",
    "source": "Website",
    "notes": "Contacted via phone, very interested",
    "status_id": "status_contacted"
  }'
```

#### Get Leads by Status
```bash
curl -X GET http://localhost:3001/api/leads/status/status_new \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

### Customers API

#### Create Customer
```bash
curl -X POST http://localhost:3001/api/customers \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "+1987654321",
    "company": "XYZ Inc",
    "address": "123 Main St, Anytown, USA",
    "notes": "Converted from lead, premium customer"
  }'
```

#### Get All Customers
```bash
curl -X GET http://localhost:3001/api/customers \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

#### Get Customer by ID
```bash
curl -X GET http://localhost:3001/api/customers/<CUSTOMER_ID> \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

#### Update Customer
```bash
curl -X PUT http://localhost:3001/api/customers/<CUSTOMER_ID> \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "+1987654321",
    "company": "XYZ Inc",
    "address": "456 New Address, Newtown, USA",
    "notes": "Updated address, still active customer"
  }'
```

## Health Check (Public)

```bash
curl -X GET http://localhost:3001/api/health
```

## Role IDs for User Creation

Use these role IDs when creating users:

- `role_admin` - ADMIN (full access)
- `role_sales` - SALES (leads and customers)
- `role_manager` - MANAGER (team oversight)
- `role_user` - USER (limited access)

## Lead Status IDs

Use these status IDs when creating/updating leads:

- `status_new` - NEW
- `status_contacted` - CONTACTED
- `status_qualified` - QUALIFIED
- `status_proposal` - PROPOSAL
- `status_won` - WON
- `status_lost` - LOST

## Error Responses

### 401 Unauthorized (Missing/Invalid Token)
```json
{
  "success": false,
  "message": "Access token is required"
}
```

### 403 Forbidden (Insufficient Permissions)
```json
{
  "success": false,
  "message": "Access denied. Required role: ADMIN"
}
```

### 400 Bad Request (Validation Error)
```json
{
  "success": false,
  "error": "Valid email is required"
}
```

## Testing Workflow

1. **Seed Database**: `npm run seed`
2. **Signup Admin**: Use signup endpoint with `role_admin`
3. **Login**: Get JWT token
4. **Create Additional Users**: Use users endpoint (ADMIN only)
5. **Create Leads**: Use leads endpoint
6. **Manage Data**: Update and query leads/customers
7. **Test Role Permissions**: Try accessing admin endpoints with non-admin users 