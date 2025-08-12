import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response';
import { getAllActiveRoles, getRoleById } from '../services/roleService';
import { asyncHandler } from '../middleware/errorHandler';

// Get all active roles
export const getRoles = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAllActiveRoles();
  return successResponse(res, result, 'Roles retrieved successfully');
});

// Get role by ID
export const getRole = asyncHandler(async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.id);
  
  if (isNaN(roleId)) {
    return errorResponse(res, 'Invalid role ID', 400);
  }
  
  const result = await getRoleById(roleId);
  return successResponse(res, result, 'Role retrieved successfully');
}); 