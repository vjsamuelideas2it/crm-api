import { Router } from 'express';
import { getRoles, getRole } from '../controllers/roleController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public: list roles (used on signup)
router.get('/', getRoles);

// Protected: get role by id (leave protected)
router.use(requireAuth);
router.get('/:id', getRole);

export default router; 