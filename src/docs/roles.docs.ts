/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management endpoints
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all active roles
 *     description: Retrieve a list of all active roles in the system. This endpoint is useful for populating role dropdowns in forms.
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Successfully retrieved all active roles
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         roles:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Role'
 *                           description: Array of active roles
 *                         total:
 *                           type: integer
 *                           description: Total number of active roles
 *                           example: 4
 *             example:
 *               success: true
 *               message: "Roles retrieved successfully"
 *               data:
 *                 roles:
 *                   - id: 5
 *                     name: "Admin"
 *                     description: "System Administrator with full access"
 *                     is_active: true
 *                     created_at: "2025-01-15T10:30:00.000Z"
 *                   - id: 9
 *                     name: "User"
 *                     description: "Regular user with limited access"
 *                     is_active: true
 *                     created_at: "2025-01-15T10:30:00.000Z"
 *                 total: 4
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Failed to retrieve roles"
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     description: Retrieve a specific role by its ID. Returns detailed information about the role.
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Unique identifier of the role
 *         example: 5
 *     responses:
 *       200:
 *         description: Successfully retrieved the role
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Role'
 *             example:
 *               success: true
 *               message: "Role retrieved successfully"
 *               data:
 *                 id: 5
 *                 name: "Admin"
 *                 description: "System Administrator with full access"
 *                 is_active: true
 *                 created_at: "2025-01-15T10:30:00.000Z"
 *       400:
 *         description: Invalid role ID provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Invalid role ID"
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Role not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Failed to retrieve role"
 */ 