import { Router } from 'express';
import { healthController } from '../controllers/healthController';

const router = Router();

// Health check routes
router.get('/', healthController.check);
router.get('/ready', healthController.ready);
router.get('/live', healthController.live);

export default router; 