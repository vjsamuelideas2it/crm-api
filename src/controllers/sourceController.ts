import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { getAllActiveSources, getSourceById } from '../services/sourceService';
import { asyncHandler } from '../middleware/errorHandler';

// Get all active sources
export const getSources = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAllActiveSources();
  return successResponse(res, result, 'Sources retrieved successfully');
});

// Get source by ID
export const getSource = asyncHandler(async (req: Request, res: Response) => {
  const sourceId = parseInt(req.params.id);

  if (isNaN(sourceId)) {
    return errorResponse(res, 'Invalid source ID', 400);
  }

  const result = await getSourceById(sourceId);
  return successResponse(res, result, 'Source retrieved successfully');
}); 