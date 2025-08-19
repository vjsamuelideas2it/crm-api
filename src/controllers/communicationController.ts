import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { listCommunications, getCommunicationById, createCommunication, updateCommunication, deleteCommunication, filterCommunications } from '../services/communicationService';

export const communicationController = {
  async list(req: Request, res: Response) {
    try {
      const { lead_id, created_by } = req.query as { lead_id?: string; created_by?: string };
      const items = await listCommunications({
        lead_id: lead_id ? parseInt(lead_id, 10) : undefined,
        created_by: created_by ? parseInt(created_by, 10) : undefined,
      });
      return successResponse(res, items);
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to fetch communications', err.statusCode || 500);
    }
  },

  async detail(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const item = await getCommunicationById(id);
      return successResponse(res, item);
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to fetch communication', err.statusCode || 500);
    }
  },

  async filter(req: Request, res: Response) {
    try {
      const { lead_ids, created_by_ids } = req.body || {};
      const toNumArray = (arr: any): number[] | undefined => {
        if (!Array.isArray(arr)) return undefined;
        const nums = arr.map((v) => parseInt(v, 10)).filter((n) => Number.isFinite(n));
        return nums.length > 0 ? nums : undefined;
      };
      const items = await filterCommunications({
        lead_ids: toNumArray(lead_ids),
        created_by_ids: toNumArray(created_by_ids),
      });
      return successResponse(res, items);
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to filter communications', err.statusCode || 500);
    }
  },

  async create(req: Request, res: Response) {
    try {
      const userIdRaw = (req as any).user?.id;
      const userId = userIdRaw ? parseInt(userIdRaw, 10) : NaN;
      if (!userId || Number.isNaN(userId)) return errorResponse(res, 'Created by user ID is required', 400);
      const { lead_id, message } = req.body;
      const item = await createCommunication({ lead_id: parseInt(lead_id, 10), message }, userId);
      return successResponse(res, item, 'Communication created', 201);
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to create communication', err.statusCode || 500);
    }
  },

  async update(req: Request, res: Response) {
    try {
      const userIdRaw = (req as any).user?.id;
      const userId = userIdRaw ? parseInt(userIdRaw, 10) : NaN;
      if (!userId || Number.isNaN(userId)) return errorResponse(res, 'Updated by user ID is required', 400);
      const id = parseInt(req.params.id, 10);
      const { message, is_active } = req.body;
      const item = await updateCommunication(id, { message, is_active }, userId);
      return successResponse(res, item, 'Communication updated');
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to update communication', err.statusCode || 500);
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const userIdRaw = (req as any).user?.id;
      const userId = userIdRaw ? parseInt(userIdRaw, 10) : NaN;
      if (!userId || Number.isNaN(userId)) return errorResponse(res, 'Updated by user ID is required', 400);
      const id = parseInt(req.params.id, 10);
      await deleteCommunication(id, userId);
      return successResponse(res, { id }, 'Communication deleted');
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to delete communication', err.statusCode || 500);
    }
  },
};
