import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { getAllActiveLeadStatuses, getLeadStatusById } from '../services/leadStatusService';
import { asyncHandler } from '../middleware/errorHandler';

// Get all active lead statuses
export const getLeadStatuses = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAllActiveLeadStatuses();
  return successResponse(res, result, 'Lead statuses retrieved successfully');
});

// Get lead status by ID
export const getLeadStatus = asyncHandler(async (req: Request, res: Response) => {
  const statusId = parseInt(req.params.id);

  if (isNaN(statusId)) {
    return errorResponse(res, 'Invalid lead status ID', 400);
  }

  const result = await getLeadStatusById(statusId);
  return successResponse(res, result, 'Lead status retrieved successfully');
}); 