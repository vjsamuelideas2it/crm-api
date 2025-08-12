import { Router } from 'express';
import { leadController } from '../controllers/leadController';
import { requireAuth } from '../middleware/auth';
import { validateLeadInput } from '../middleware/validation';

const router = Router();

// All lead routes require authentication
router.use(requireAuth);

// Lead routes
router.get('/', leadController.getAll);
router.get('/:id', leadController.getById);
router.post('/', validateLeadInput, leadController.create);
router.put('/:id', validateLeadInput, leadController.update);
router.delete('/:id', leadController.delete);
router.get('/status/:statusId', leadController.getByStatus);
router.post('/:id/convert', leadController.convert);

export default router; 