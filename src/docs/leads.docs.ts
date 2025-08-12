/**
 * @swagger
 * tags:
 *   - name: Leads
 *     description: Lead management endpoints (Authentication required)
 */

/**
 * @swagger
 * /api/leads:
 *   get:
 *     tags:
 *       - Leads
 *     summary: Get all leads
 *     description: Retrieve a list of all active leads with status, source, and assigned user information. Optionally filter by conversion status.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: is_converted
 *         schema:
 *           type: boolean
 *         required: false
 *         description: When provided, filters leads by conversion flag (true for customers, false for open leads)
 *     responses:
 *       200:
 *         description: Leads retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lead'
 *                 count:
 *                   type: number
 *                   example: 15
 *       401:
 *         description: Unauthorized - JWT token required
 *       500:
 *         description: Internal server error
 *   post:
 *     tags:
 *       - Leads
 *     summary: Create new lead
 *     description: Create a new lead with the provided information
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLeadRequest'
 *           example:
 *             name: "Acme Corporation"
 *             email: "contact@acme.com"
 *             phone: "+1-555-0123"
 *             status_id: 1
 *             source_id: 1
 *             assigned_to: 2
 *             notes: "Interested in our premium package"
 *     responses:
 *       201:
 *         description: Lead created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Lead'
 *                 message:
 *                   type: string
 *                   example: "Lead created successfully"
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/leads/{id}:
 *   get:
 *     tags:
 *       - Leads
 *     summary: Get lead by ID
 *     description: Retrieve a specific lead by ID with all related information
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Lead ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Lead retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Lead'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 *   put:
 *     tags:
 *       - Leads
 *     summary: Update lead
 *     description: Update lead information
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Lead ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLeadRequest'
 *           example:
 *             name: "Updated Lead Name"
 *             email: "updated@lead.com"
 *             phone: "+1-555-0789"
 *             status_id: 2
 *             notes: "Updated notes about the lead"
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Lead'
 *                 message:
 *                   type: string
 *                   example: "Lead updated successfully"
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Leads
 *     summary: Delete lead
 *     description: Soft deletes a lead by setting is_active=false
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Lead ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Lead deleted successfully (soft delete)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lead deleted successfully (soft delete)"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/leads/status/{statusId}:
 *   get:
 *     tags:
 *       - Leads
 *     summary: Get leads by status
 *     description: Retrieve all leads filtered by their status
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: statusId
 *         required: true
 *         schema:
 *           type: number
 *         description: Lead Status ID (1=NEW, 2=CONTACTED, 3=QUALIFIED, 4=PROPOSAL, 5=WON, 6=LOST)
 *         example: 1
 *     responses:
 *       200:
 *         description: Leads retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Lead'
 *                 count:
 *                   type: number
 *                   example: 8
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Status not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/leads/{id}/convert:
 *   post:
 *     tags:
 *       - Leads
 *     summary: Convert a lead to a customer
 *     description: Converts the specified lead into a customer using the lead's name, email, phone, and notes. Marks the lead as converted.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Lead ID to convert
 *         example: 1
 *     responses:
 *       200:
 *         description: Lead converted to customer successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lead converted to customer successfully"
 *       400:
 *         description: Lead is already converted or invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Internal server error
 */ 