/**
 * Tasks API Documentation
 */

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: List tasks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customer_id
 *         schema: { type: number }
 *       - in: query
 *         name: work_item_id
 *         schema: { type: number }
 *       - in: query
 *         name: assigned_to
 *         schema: { type: number }
 *       - in: query
 *         name: status_id
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: List of tasks
 * /api/tasks/filter:
 *   post:
 *     summary: Filter tasks by arrays of ids
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
 *               work_item_ids: { type: array, items: { type: number } }
 *               assigned_to_ids: { type: array, items: { type: number } }
 *               status_ids: { type: array, items: { type: number } }
 *     responses:
 *       200:
 *         description: Filtered list of tasks
 *   post:
 *     summary: Create a task
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, work_item_id, customer_id, status_id]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               work_item_id: { type: number }
 *               customer_id: { type: number }
 *               assigned_to: { type: number }
 *               status_id: { type: number }
 *     responses:
 *       201:
 *         description: Created task
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Task
 *   put:
 *     summary: Update a task
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
 *               work_item_id: { type: number }
 *               customer_id: { type: number }
 *               assigned_to: { type: number }
 *               status_id: { type: number }
 *               is_active: { type: boolean }
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Soft delete a task
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
