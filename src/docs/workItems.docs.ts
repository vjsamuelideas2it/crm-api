/**
 * Work Items API Documentation
 */

/**
 * @openapi
 * /api/work-items:
 *   get:
 *     summary: List work items
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customer_id
 *         schema: { type: number }
 *       - in: query
 *         name: assigned_to
 *         schema: { type: number }
 *       - in: query
 *         name: status_id
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: List of work items
 * /api/work-items/filter:
 *   post:
 *     summary: Filter work items by arrays of ids
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_ids: { type: array, items: { type: number } }
 *               assigned_to_ids: { type: array, items: { type: number } }
 *               status_ids: { type: array, items: { type: number } }
 *     responses:
 *       200:
 *         description: Filtered list of work items
 *   post:
 *     summary: Create a work item
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, customer_id, status_id]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               customer_id: { type: number }
 *               assigned_to: { type: number }
 *               status_id: { type: number }
 *     responses:
 *       201:
 *         description: Created work item
 * /api/work-items/{id}:
 *   get:
 *     summary: Get work item by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Work item
 *   put:
 *     summary: Update a work item
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
 *               title: { type: string }
 *               description: { type: string }
 *               customer_id: { type: number }
 *               assigned_to: { type: number }
 *               status_id: { type: number }
 *               is_active: { type: boolean }
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Soft delete a work item
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
