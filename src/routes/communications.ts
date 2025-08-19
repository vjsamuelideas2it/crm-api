import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { communicationController } from '../controllers/communicationController';

const router = Router();

router.use(requireAuth);

router.get('/', communicationController.list);
router.get('/:id', communicationController.detail);
router.post('/filter', communicationController.filter);
router.post('/', communicationController.create);
router.put('/:id', communicationController.update);
router.delete('/:id', communicationController.remove);

export default router;
