import { Router } from 'express';
import { getLeadStatuses, getLeadStatus } from '../controllers/leadStatusController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All lead status routes require authentication
router.use(requireAuth);

/**
 * @swagger
 * /api/lead-statuses:
 *   get:
 *     summary: Get all active lead statuses
 *     tags: [Lead Statuses]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lead statuses retrieved successfully
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
 *                         statuses:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/LeadStatus'
 *                         total:
 *                           type: integer
 *                           example: 6
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getLeadStatuses);

/**
 * @swagger
 * /api/lead-statuses/{id}:
 *   get:
 *     summary: Get lead status by ID
 *     tags: [Lead Statuses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Lead Status ID
 *     responses:
 *       200:
 *         description: Lead status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LeadStatus'
 *       400:
 *         description: Invalid lead status ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Lead status not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', getLeadStatus);

export default router; 