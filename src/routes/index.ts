import { Router } from 'express';
import healthRoutes from './health';
import authRoutes from './auth';
import userRoutes from './users';
import leadRoutes from './leads';
import roleRoutes from './roles';
import leadStatusRoutes from './leadStatuses';
import sourceRoutes from './sources';
import workItemRoutes from './workItems';
import taskRoutes from './tasks';
import workStatusRoutes from './workStatuses';
import communicationRoutes from './communications';

const router = Router();

// Mount routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/leads', leadRoutes);
router.use('/roles', roleRoutes);
router.use('/lead-statuses', leadStatusRoutes);
router.use('/sources', sourceRoutes);
router.use('/work-items', workItemRoutes);
router.use('/tasks', taskRoutes);
router.use('/work-statuses', workStatusRoutes);
router.use('/communications', communicationRoutes);

export default router; 