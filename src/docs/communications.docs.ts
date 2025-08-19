/**
 * Communications API Documentation
 */

/**
 * @openapi
 * /api/communications:
 *   get:
 *     summary: List communications
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lead_id
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: List of communications
 * /api/communications/filter:
 *   post:
 *     summary: Filter communications by arrays of ids
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lead_ids: { type: array, items: { type: number } }
 *               created_by_ids: { type: array, items: { type: number } }
 *     responses:
 *       200:
 *         description: Filtered list of communications
 *   post:
 *     summary: Create a communication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lead_id, message]
 *             properties:
 *               lead_id: { type: number }
 *               message: { type: string }
 *     responses:
 *       201:
 *         description: Created communication
 * /api/communications/{id}:
 *   get:
 *     summary: Get communication by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Communication
 *   put:
 *     summary: Update a communication
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: number }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message: { type: string }
 *               is_active: { type: boolean }
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Soft delete a communication
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Deleted
 */
