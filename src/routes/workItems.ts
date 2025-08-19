import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { workItemController } from '../controllers/workItemController';

const router = Router();

router.use(requireAuth);

router.get('/', workItemController.getAll);
router.get('/:id', workItemController.getById);
router.post('/filter', workItemController.filter);
router.post('/', workItemController.create);
router.put('/:id', workItemController.update);
router.delete('/:id', workItemController.delete);

export default router;
