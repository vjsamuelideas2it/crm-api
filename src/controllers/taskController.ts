import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask, filterTasks } from '../services/taskService';

export const taskController = {
  async getAll(req: Request, res: Response) {
    try {
      const { customer_id, work_item_id, assigned_to, status_id } = req.query;
      const tasks = await getAllTasks({
        customer_id: customer_id ? parseInt(customer_id as string, 10) : undefined,
        work_item_id: work_item_id ? parseInt(work_item_id as string, 10) : undefined,
        assigned_to: assigned_to ? parseInt(assigned_to as string, 10) : undefined,
        status_id: status_id ? parseInt(status_id as string, 10) : undefined,
      });
      return successResponse(res, tasks);
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to fetch tasks', err.statusCode || 500);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const task = await getTaskById(id);
      return successResponse(res, task);
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to fetch task', err.statusCode || 500);
    }
  },

  async filter(req: Request, res: Response) {
    try {
      const { customer_ids, work_item_ids, assigned_to_ids, status_ids } = req.body || {};
      const toNumArray = (arr: any): number[] | undefined => {
        if (!Array.isArray(arr)) return undefined;
        const nums = arr.map((v) => parseInt(v, 10)).filter((n) => Number.isFinite(n));
        return nums.length > 0 ? nums : undefined;
      };
      const tasks = await filterTasks({
        customer_ids: toNumArray(customer_ids),
        work_item_ids: toNumArray(work_item_ids),
        assigned_to_ids: toNumArray(assigned_to_ids),
        status_ids: toNumArray(status_ids),
      });
      return successResponse(res, tasks);
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to filter tasks', err.statusCode || 500);
    }
  },

  async create(req: Request, res: Response) {
    try {
      const userIdRaw = (req as any).user?.id;
      const userId = userIdRaw ? parseInt(userIdRaw, 10) : NaN;
      if (!userId || Number.isNaN(userId)) return errorResponse(res, 'Created by user ID is required', 400);

      const { title, description, work_item_id, customer_id, assigned_to, status_id } = req.body;
      const task = await createTask({
        title,
        description,
        work_item_id: parseInt(work_item_id, 10),
        customer_id: parseInt(customer_id, 10),
        assigned_to: assigned_to ? parseInt(assigned_to, 10) : undefined,
        status_id: parseInt(status_id, 10),
      }, userId);
      return successResponse(res, task, 'Task created', 201);
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to create task', err.statusCode || 500);
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userIdRaw = (req as any).user?.id;
      const userId = userIdRaw ? parseInt(userIdRaw, 10) : NaN;
      if (!userId || Number.isNaN(userId)) return errorResponse(res, 'Updated by user ID is required', 400);
      const id = parseInt(req.params.id, 10);

      const { title, description, work_item_id, customer_id, assigned_to, status_id, is_active } = req.body;
      const task = await updateTask(id, {
        title,
        description,
        work_item_id: work_item_id ? parseInt(work_item_id, 10) : undefined,
        customer_id: customer_id ? parseInt(customer_id, 10) : undefined,
        assigned_to: assigned_to ? parseInt(assigned_to, 10) : undefined,
        status_id: status_id ? parseInt(status_id, 10) : undefined,
        is_active,
      }, userId);
      return successResponse(res, task, 'Task updated');
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to update task', err.statusCode || 500);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const userIdRaw = (req as any).user?.id;
      const userId = userIdRaw ? parseInt(userIdRaw, 10) : NaN;
      if (!userId || Number.isNaN(userId)) return errorResponse(res, 'Updated by user ID is required', 400);
      const id = parseInt(req.params.id, 10);
      await deleteTask(id, userId);
      return successResponse(res, { id }, 'Task deleted');
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to delete task', err.statusCode || 500);
    }
  },
};
