import { Request, Response } from 'express';
import { getAllWorkStatuses } from '../services/workStatusService';
import { successResponse, errorResponse } from '../utils/response';

export const workStatusController = {
  async list(req: Request, res: Response) {
    try {
      const statuses = await getAllWorkStatuses();
      return successResponse(res, { statuses });
    } catch (err: any) {
      return errorResponse(res, err.message || 'Failed to fetch statuses', err.statusCode || 500);
    }
  }
};
