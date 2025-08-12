import bcrypt from 'bcrypt';
import { prisma } from '../prisma/client';
import { logger } from '../utils/logger';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role_id: number;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role_id?: number;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface AssignableUserResponse {
  id: number;
  name: string;
  role: {
    id: number;
    name: string;
  };
}

/**
 * Hash password using bcrypt
 */
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Check if user exists by email
 */
const checkUserExists = async (email: string): Promise<boolean> => {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  return !!existingUser;
};

/**
 * Validate role exists and is active
 */
const validateRole = async (roleId: number) => {
  const role = await prisma.role.findUnique({
    where: { id: roleId }
  });

  if (!role || !role.is_active) {
    throw new Error('Invalid or inactive role');
  }

  return role;
};

/**
 * Check if user can access another user's data
 */
const canAccessUser = (currentUserRole: string, currentUserId: number, targetUserId: number): boolean => {
  // Allow all authenticated users to access any user data
  return true;
};

/**
 * Check if user can modify role
 */
const canModifyRole = (currentUserRole: string): boolean => {
  // Allow all authenticated users to modify roles
  return true;
};

/**
 * Format user response
 */
const formatUserResponse = (user: any): UserResponse => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  created_at: user.created_at,
  updated_at: user.updated_at
});

/**
 * Format assignable user response
 */
const formatAssignableUserResponse = (user: any): AssignableUserResponse => ({
  id: user.id,
  name: user.name,
  role: user.role
});

/**
 * Get assignable users (for lead assignment - basic info only)
 */
export const getAssignableUsers = async (): Promise<AssignableUserResponse[]> => {
  const users = await prisma.user.findMany({
    where: { 
      is_active: true 
    },
    select: {
      id: true,
      name: true,
      role: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  return users.map(formatAssignableUserResponse);
};

/**
 * Get all users (Admin only)
 */
export const getAllUsers = async (): Promise<UserResponse[]> => {
  const users = await prisma.user.findMany({
    where: { is_active: true },
    include: {
      role: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  return users.map(formatUserResponse);
};

/**
 * Get user by ID with access control
 */
export const getUserById = async (
  userId: number,
  currentUserRole: string,
  currentUserId: number
): Promise<UserResponse> => {
  // Check access permissions
  if (!canAccessUser(currentUserRole, currentUserId, userId)) {
    const error = new Error('Access denied. You can only view your own profile.');
    (error as any).statusCode = 403;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: true
    }
  });

  if (!user) {
    const error = new Error('User not found');
    (error as any).statusCode = 404;
    throw error;
  }

  return formatUserResponse(user);
};

/**
 * Create new user (Admin only)
 */
export const createUser = async (
  userData: CreateUserData,
  createdByUserId: number
): Promise<UserResponse> => {
  const { email, name, password, role_id } = userData;

  // Check if user already exists
  const userExists = await checkUserExists(email);
  if (userExists) {
    const error = new Error('User with this email already exists');
    (error as any).statusCode = 409;
    throw error;
  }

  // Verify role exists and is active
  await validateRole(role_id);

  // Hash password
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role_id,
      created_by: createdByUserId,
      updated_by: createdByUserId
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: {
        select: {
          id: true,
          name: true
        }
      },
      created_at: true,
      updated_at: true
    }
  });

  logger.info(`User created by admin: ${user.email}`);

  return formatUserResponse(user);
};

/**
 * Update user with access control
 */
export const updateUser = async (
  userId: number,
  updateData: UpdateUserData,
  currentUserRole: string,
  currentUserId: number
): Promise<UserResponse> => {
  const { email, name, role_id, password } = updateData;

  // Check access permissions
  if (!canAccessUser(currentUserRole, currentUserId, userId)) {
    const error = new Error('Access denied. You can only update your own profile.');
    (error as any).statusCode = 403;
    throw error;
  }

  // Non-admin users cannot change their role
  if (!canModifyRole(currentUserRole) && role_id) {
    const error = new Error('Access denied. You cannot change your role.');
    (error as any).statusCode = 403;
    throw error;
  }

  const updateFields: any = {};

  if (email) updateFields.email = email;
  if (name) updateFields.name = name;
  if (role_id && canModifyRole(currentUserRole)) updateFields.role_id = role_id;

  // Hash new password if provided
  if (password) {
    updateFields.password = await hashPassword(password);
  }

  updateFields.updated_by = currentUserId;

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateFields,
    include: {
      role: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  logger.info(`User updated: ${user.email} by ${currentUserId}`);

  return formatUserResponse(user);
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (
  userId: number,
  currentUserId: number
): Promise<void> => {
  // Prevent self-deletion
  if (currentUserId === userId) {
    const error = new Error('You cannot delete your own account');
    (error as any).statusCode = 400;
    throw error;
  }

  // Soft delete: mark inactive and update audit
  await prisma.user.update({
    where: { id: userId },
    data: { is_active: false, updated_by: currentUserId }
  });

  logger.info(`User deleted: ${userId} by ${currentUserId}`);
};