import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validateUserInput } from '../middleware/validation';

const router = Router();

// Authentication routes
router.post('/signup', validateUserInput, authController.signup);
router.post('/login', authController.login);

export default router; 