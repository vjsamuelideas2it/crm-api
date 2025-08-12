import { prisma } from '../prisma/client';
import { logger } from '../utils/logger';

// Types
export interface RoleResponse {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

// Helper function to format role data
const formatRoleResponse = (role: any): RoleResponse => ({
  id: role.id,
  name: role.name,
  description: role.description,
  is_active: role.is_active,
  created_at: role.created_at.toISOString(),
});

// Get all active roles
export const getAllActiveRoles = async () => {
  try {
    const roles = await prisma.role.findMany({
      where: {
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        is_active: true,
        created_at: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formattedRoles = roles.map(formatRoleResponse);

    logger.info(`Retrieved ${roles.length} active roles`);
    
    return {
      roles: formattedRoles,
      total: formattedRoles.length,
    };
    
  } catch (error) {
    logger.error('Error retrieving roles:', error);
    throw error;
  }
};

// Get role by ID
export const getRoleById = async (roleId: number) => {
  try {
    const role = await prisma.role.findUnique({
      where: {
        id: roleId,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        is_active: true,
        created_at: true,
      },
    });

    if (!role) {
      throw new Error('Role not found');
    }

    const formattedRole = formatRoleResponse(role);

    logger.info(`Retrieved role: ${role.name} (ID: ${role.id})`);
    
    return formattedRole;
    
  } catch (error) {
    logger.error('Error retrieving role:', error);
    throw error;
  }
}; 