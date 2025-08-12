import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { workStatusController } from '../controllers/workStatusController';

const router = Router();

router.use(requireAuth);

router.get('/', workStatusController.list);

export default router;
