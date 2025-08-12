import { Router } from 'express';
import { userController } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';
import { validateUserInput } from '../middleware/validation';

const router = Router();

// All user routes require authentication
router.use(requireAuth);

// Get current user profile (for token validation)
router.get('/me', userController.getCurrentUser);

// Get assignable users (for lead assignment - all authenticated users can access)
router.get('/assignable', userController.getAssignableUsers);

// User routes (all authenticated users can access)
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', validateUserInput, userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router; 