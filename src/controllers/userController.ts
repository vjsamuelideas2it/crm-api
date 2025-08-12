import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAssignableUsers
} from '../services/userService';

export const userController = {
  // Get current user profile (for token validation)
  getCurrentUser: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUser = req.user!;

    const user = await getUserById(
      parseInt(currentUser.id),
      currentUser.role,
      parseInt(currentUser.id)
    );

    res.status(200).json({
      success: true,
      data: user
    });
  }),

  // Get assignable users (for lead assignment)
  getAssignableUsers: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const users = await getAssignableUsers();

    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
  }),

  // Get all users (Admin only)
  getAll: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
  }),

  // Get user by ID
  getById: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const currentUser = req.user!;

    const user = await getUserById(
      parseInt(id),
      currentUser.role,
      parseInt(currentUser.id)
    );

    res.status(200).json({
      success: true,
      data: user
    });
  }),

  // Create new user (Admin only)
  create: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const currentUser = req.user!;

    // Convert string fields to appropriate types
    const userData = {
      ...req.body,
      role_id: req.body.role_id ? parseInt(req.body.role_id) : undefined,
    };

    const user = await createUser(userData, parseInt(currentUser.id));

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  }),

  // Update user
  update: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const currentUser = req.user!;

    // Convert string fields to appropriate types
    const updateData = {
      ...req.body,
      role_id: req.body.role_id ? parseInt(req.body.role_id) : undefined,
    };

    const user = await updateUser(
      parseInt(id),
      updateData,
      currentUser.role,
      parseInt(currentUser.id)
    );

    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  }),

  // Delete user (Admin only)
  delete: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const currentUser = req.user!;

    await deleteUser(parseInt(id), parseInt(currentUser.id));

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  })
}; 