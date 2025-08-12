/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: System health and monitoring endpoints
 */

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Basic health check
 *     description: Simple health check endpoint to verify the service is running
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 *       500:
 *         description: Service is unhealthy
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Comprehensive health check
 *     description: Detailed health check including database connectivity and system metrics
 *     responses:
 *       200:
 *         description: System is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             example:
 *               status: "healthy"
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *               uptime: 123.456
 *               environment: "development"
 *               version: "1.0.0"
 *               database:
 *                 status: "connected"
 *                 responseTime: "45ms"
 *               memory:
 *                 used: "85.4 MB"
 *                 total: "128 MB"
 *       500:
 *         description: System is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "unhealthy"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */

/**
 * @swagger
 * /api/health/ready:
 *   get:
 *     tags:
 *       - Health
 *     summary: Readiness probe
 *     description: Check if the service is ready to accept traffic (includes database connectivity)
 *     responses:
 *       200:
 *         description: Service is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ready"
 *                 checks:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: string
 *                       example: "connected"
 *       503:
 *         description: Service is not ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "not ready"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */

/**
 * @swagger
 * /api/health/live:
 *   get:
 *     tags:
 *       - Health
 *     summary: Liveness probe
 *     description: Check if the service is alive (basic health without external dependencies)
 *     responses:
 *       200:
 *         description: Service is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "alive"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 *       500:
 *         description: Service is not alive
 */ 