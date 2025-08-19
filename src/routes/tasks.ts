import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { taskController } from '../controllers/taskController';

const router = Router();

router.use(requireAuth);

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.post('/filter', taskController.filter);
router.post('/', taskController.create);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.delete);

export default router;
