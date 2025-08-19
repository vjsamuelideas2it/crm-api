import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { 
  getAllWorkItems, getWorkItemById, createWorkItem, updateWorkItem, deleteWorkItem, filterWorkItems
} from '../services/workItemService';

export const workItemController = {
  async getAll(req: Request, res: Response) {
    try {
      const { customer_id, assigned_to, status_id } = req.query;
      const items = await getAllWorkItems({
        customer_id: customer_id ? parseInt(customer_id as string, 10) : undefined,
        assigned_to: assigned_to ? parseInt(assigned_to as string, 10) : undefined,
        status_id: status_id ? parseInt(status_id as string, 10) : undefined,
      });
      return successResponse(res, items);
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to fetch work items', err.statusCode || 500);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const item = await getWorkItemById(id);
      return successResponse(res, item);
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to fetch work item', err.statusCode || 500);
    }
  },

  async filter(req: Request, res: Response) {
    try {
      const { customer_ids, assigned_to_ids, status_ids } = req.body || {};
      const toNumArray = (arr: any): number[] | undefined => {
        if (!Array.isArray(arr)) return undefined;
        const nums = arr.map((v) => parseInt(v, 10)).filter((n) => Number.isFinite(n));
        return nums.length > 0 ? nums : undefined;
      };
      const items = await filterWorkItems({
        customer_ids: toNumArray(customer_ids),
        assigned_to_ids: toNumArray(assigned_to_ids),
        status_ids: toNumArray(status_ids),
      });
      return successResponse(res, items);
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to filter work items', err.statusCode || 500);
    }
  },

  async create(req: Request, res: Response) {
    try {
      const userIdRaw = (req as any).user?.id;
      const userId = userIdRaw ? parseInt(userIdRaw, 10) : NaN;
      if (!userId || Number.isNaN(userId)) return errorResponse(res, 'Created by user ID is required', 400);

      const { title, description, customer_id, assigned_to, status_id } = req.body;
      const item = await createWorkItem({
        title,
        description,
        customer_id: parseInt(customer_id, 10),
        assigned_to: assigned_to ? parseInt(assigned_to, 10) : undefined,
        status_id: parseInt(status_id, 10),
      }, userId);
      return successResponse(res, item, 'Work item created', 201);
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to create work item', err.statusCode || 500);
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userIdRaw = (req as any).user?.id;
      const userId = userIdRaw ? parseInt(userIdRaw, 10) : NaN;
      if (!userId || Number.isNaN(userId)) return errorResponse(res, 'Updated by user ID is required', 400);
      const id = parseInt(req.params.id, 10);

      const { title, description, customer_id, assigned_to, status_id, is_active } = req.body;
      const item = await updateWorkItem(id, {
        title,
        description,
        customer_id: customer_id ? parseInt(customer_id, 10) : undefined,
        assigned_to: assigned_to ? parseInt(assigned_to, 10) : undefined,
        status_id: status_id ? parseInt(status_id, 10) : undefined,
        is_active,
      }, userId);
      return successResponse(res, item, 'Work item updated');
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to update work item', err.statusCode || 500);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const userIdRaw = (req as any).user?.id;
      const userId = userIdRaw ? parseInt(userIdRaw, 10) : NaN;
      if (!userId || Number.isNaN(userId)) return errorResponse(res, 'Updated by user ID is required', 400);
      const id = parseInt(req.params.id, 10);
      await deleteWorkItem(id, userId);
      return successResponse(res, { id }, 'Work item deleted');
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to delete work item', err.statusCode || 500);
    }
  },
};
