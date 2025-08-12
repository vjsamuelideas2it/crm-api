# API Documentation System

This directory contains the centralized Swagger/OpenAPI documentation for the CRM API.

## 📁 **Structure**

```
src/docs/
├── README.md           # This file - documentation guide
├── auth.docs.ts        # Authentication endpoints
├── users.docs.ts       # User management endpoints
├── leads.docs.ts       # Lead management endpoints
├── customers.docs.ts   # Customer management endpoints
└── health.docs.ts      # Health check endpoints
```

## 🔧 **Configuration**

The main Swagger configuration is in `src/config/swagger.ts`, which:
- Defines the OpenAPI 3.0 specification
- Sets up security schemes (JWT Bearer tokens)
- Defines reusable components and schemas
- Configures UI customization options

## 📖 **Accessing Documentation**

### Development
- **Swagger UI**: `http://localhost:3001/api/docs`
- **JSON Spec**: `http://localhost:3001/api/docs.json`
- **Root Info**: `http://localhost:3001/`

### Production
- **Swagger UI**: `https://your-api-domain.com/api/docs`
- **JSON Spec**: `https://your-api-domain.com/api/docs.json`

## 🔑 **Authentication Testing**

1. **Get a JWT Token**:
   ```bash
   # Login to get token
   POST /api/auth/login
   {
     "email": "admin@system.com",
     "password": "admin123"
   }
   ```

2. **Use Token in Swagger UI**:
   - Click the "🔒 Authorize" button
   - Enter: `Bearer YOUR_JWT_TOKEN_HERE`
   - Click "Authorize"

3. **Test Protected Endpoints**:
   - All endpoints marked with 🔒 require authentication
   - Admin-only endpoints require ADMIN role

## ⚡ **Pattern for Adding New APIs**

Follow this consistent pattern when adding new API endpoints:

### 1. **Create Documentation File**
```typescript
// src/docs/newFeature.docs.ts

/**
 * @swagger
 * tags:
 *   - name: NewFeature
 *     description: Description of the new feature endpoints
 */

/**
 * @swagger
 * /api/new-feature:
 *   get:
 *     tags:
 *       - NewFeature
 *     summary: Get all items
 *     description: Detailed description
 *     security:
 *       - BearerAuth: []  # If authentication required
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourSchema'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
```

### 2. **Add Schema to Main Config**
```typescript
// src/config/swagger.ts - Add to components.schemas
YourSchema: {
  type: 'object',
  properties: {
    id: { type: 'number', example: 1 },
    name: { type: 'string', example: 'Example Name' },
    // ... other properties
  },
},
```

### 3. **Update swagger.ts APIs Array**
```typescript
// src/config/swagger.ts - Update apis array
apis: [
  './src/routes/*.ts',
  './src/controllers/*.ts',
  './src/docs/*.ts',  # This includes your new docs file
],
```

## 📋 **Documentation Standards**

### **Required Elements**
- ✅ **Tags**: Group related endpoints
- ✅ **Summary**: Brief endpoint description
- ✅ **Description**: Detailed explanation
- ✅ **Security**: Authentication requirements
- ✅ **Parameters**: Path, query, body parameters
- ✅ **Responses**: All possible HTTP responses
- ✅ **Examples**: Request/response examples

### **Response Codes**
- **200**: Success (GET, PUT)
- **201**: Created (POST)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate resources)
- **500**: Internal Server Error

### **Authentication Pattern**
```yaml
security:
  - BearerAuth: []  # For protected endpoints
```

### **Error Response Pattern**
```yaml
content:
  application/json:
    schema:
      $ref: '#/components/schemas/ErrorResponse'
    example:
      success: false
      message: "Descriptive error message"
```

## 🛠 **Available Schemas**

### **Common Responses**
- `SuccessResponse` - Standard success format
- `ErrorResponse` - Standard error format
- `PaginatedResponse` - Paginated data format

### **Authentication**
- `SignupRequest` / `LoginRequest`
- `AuthResponse` - Login/signup response with token

### **Entities**
- `User` / `CreateUserRequest` / `UpdateUserRequest`
- `Lead` / `CreateLeadRequest` / `UpdateLeadRequest`
- `Customer` / `CreateCustomerRequest` / `UpdateCustomerRequest`
- `Role` / `LeadStatus` / `Source`

### **System**
- `HealthResponse` - Health check format

## 🧪 **Testing Endpoints**

### **cURL Examples**
```bash
# Get JWT Token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@system.com","password":"admin123!@#"}'

# Use Token for Protected Endpoint
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### **Postman Collection**
The Swagger JSON can be imported into Postman:
1. Open Postman
2. Import → Link: `http://localhost:3001/api/docs.json`
3. Collection will be auto-generated with all endpoints

## 🔄 **Maintenance**

### **Updating Documentation**
1. Modify relevant `.docs.ts` file
2. Update schemas in `swagger.ts` if needed
3. Restart dev server to see changes
4. Verify documentation at `/api/docs`

### **Version Control**
- Keep documentation in sync with code changes
- Update examples when response formats change
- Add new endpoints immediately when routes are created

## 🚀 **Deployment**

The documentation is automatically available in all environments:
- **Development**: Auto-refreshes with code changes
- **Staging/Production**: Served statically

### **Security Notes**
- Documentation is publicly accessible (no authentication required)
- Sensitive information should not be in examples
- Production URLs are auto-configured via environment variables 