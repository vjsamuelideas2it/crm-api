import { Router } from 'express';
import { getSources, getSource } from '../controllers/sourceController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All source routes require authentication
router.use(requireAuth);

/**
 * @swagger
 * /api/sources:
 *   get:
 *     summary: Get all active sources
 *     tags: [Sources]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sources retrieved successfully
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
 *                         sources:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Source'
 *                         total:
 *                           type: integer
 *                           example: 6
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', getSources);

/**
 * @swagger
 * /api/sources/{id}:
 *   get:
 *     summary: Get source by ID
 *     tags: [Sources]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Source ID
 *     responses:
 *       200:
 *         description: Source retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Source'
 *       400:
 *         description: Invalid source ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Source not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', getSource);

export default router; 