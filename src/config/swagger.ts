import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition, Options } from 'swagger-jsdoc';

// Basic API Information
const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CRM API Documentation',
    version: '1.0.0',
    description: 'A comprehensive CRM API built with Node.js, Express, TypeScript, and Prisma',
    contact: {
      name: 'API Support',
      email: 'admin@crm-api.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' 
        ? 'https://api.yourcrm.com' 
        : `http://localhost:${process.env.PORT || 3001}`,
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token for authentication',
      },
    },
    schemas: {
      // Common response schemas
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Operation completed successfully',
          },
          data: {
            type: 'object',
            description: 'Response data',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'An error occurred',
          },
          error: {
            type: 'string',
            description: 'Detailed error message',
          },
        },
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'array',
            items: {
              type: 'object',
            },
          },
          count: {
            type: 'number',
            example: 25,
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 10 },
              total: { type: 'number', example: 100 },
              totalPages: { type: 'number', example: 10 },
            },
          },
        },
      },

      // Auth schemas
      SignupRequest: {
        type: 'object',
        required: ['name', 'email', 'password', 'role_id'],
        properties: {
          name: {
            type: 'string',
            example: 'John Doe',
            description: 'Full name of the user',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
            description: 'Valid email address',
          },
          password: {
            type: 'string',
            minLength: 6,
            example: 'securePassword123',
            description: 'Password (minimum 6 characters)',
          },
          role_id: {
            type: 'number',
            example: 2,
            description: 'Role ID (1=ADMIN, 2=USER, 3=SALES, 4=MANAGER)',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'admin@system.com',
          },
          password: {
            type: 'string',
            example: 'admin123',
          },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Login successful' },
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/User' },
              token: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              },
            },
          },
        },
      },

      // User schemas
      User: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john.doe@example.com' },
          role: { $ref: '#/components/schemas/Role' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      CreateUserRequest: {
        type: 'object',
        required: ['name', 'email', 'password', 'role_id'],
        properties: {
          name: { type: 'string', example: 'Jane Smith' },
          email: { type: 'string', example: 'jane.smith@example.com' },
          password: { type: 'string', example: 'securePassword123' },
          role_id: { type: 'number', example: 2 },
        },
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Jane Smith Updated' },
          email: { type: 'string', example: 'jane.updated@example.com' },
          password: { type: 'string', example: 'newPassword123' },
          role_id: { type: 'number', example: 3 },
        },
      },

      // Role schema
      Role: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Admin' },
          description: { type: 'string', example: 'System Administrator with full access' },
          is_active: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time' },
        },
      },

      // Lead schemas
      Lead: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Acme Corp Lead' },
          email: { type: 'string', example: 'contact@acme.com' },
          phone: { type: 'string', example: '+1-555-0123' },
          status_id: { type: 'number', example: 1 },
          source_id: { type: 'number', example: 1 },
          assigned_to: { type: 'number', example: 2 },
          notes: { type: 'string', example: 'Interested in premium package' },
          is_converted: { type: 'boolean', example: false },
          is_active: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          status: { $ref: '#/components/schemas/LeadStatus' },
          source: { $ref: '#/components/schemas/Source' },
          assigned_user: { $ref: '#/components/schemas/User' },
        },
      },
      CreateLeadRequest: {
        type: 'object',
        required: ['name', 'status_id', 'source_id'],
        properties: {
          name: { type: 'string', example: 'New Business Lead' },
          email: { type: 'string', example: 'lead@newbusiness.com' },
          phone: { type: 'string', example: '+1-555-0456' },
          status_id: { type: 'number', example: 1 },
          source_id: { type: 'number', example: 1 },
          assigned_to: { type: 'number', example: 2 },
          notes: { type: 'string', example: 'Generated from website contact form' },
        },
      },
      UpdateLeadRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Updated Lead Name' },
          email: { type: 'string', example: 'updated@lead.com' },
          phone: { type: 'string', example: '+1-555-0789' },
          status_id: { type: 'number', example: 2 },
          source_id: { type: 'number', example: 2 },
          assigned_to: { type: 'number', example: 3 },
          notes: { type: 'string', example: 'Updated notes about the lead' },
        },
      },

      // Removed Customer schemas

      // Meta data schemas
      LeadStatus: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'NEW' },
          description: { type: 'string', example: 'Newly acquired lead' },
          is_active: { type: 'boolean', example: true },
        },
      },
      Source: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'WEBSITE' },
          description: { type: 'string', example: 'Lead from company website' },
          is_active: { type: 'boolean', example: true },
        },
      },

      // Health check schema
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'healthy' },
          timestamp: { type: 'string', format: 'date-time' },
          uptime: { type: 'number', example: 123.456 },
          environment: { type: 'string', example: 'development' },
          version: { type: 'string', example: '1.0.0' },
          database: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'connected' },
              responseTime: { type: 'string', example: '45ms' },
            },
          },
          memory: {
            type: 'object',
            properties: {
              used: { type: 'string', example: '85.4 MB' },
              total: { type: 'string', example: '128 MB' },
            },
          },
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

// Swagger JSDoc configuration options
const swaggerOptions: Options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/docs/*.ts',
  ],
};

// Generate swagger specification
export const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI configuration
export const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
  },
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0 }
    .swagger-ui .scheme-container { background: #fafafa; padding: 15px; margin: 15px 0; border-radius: 4px }
  `,
  customSiteTitle: 'CRM API Documentation',
  customfavIcon: '/favicon.ico',
}; 