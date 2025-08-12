import { prisma } from '../prisma/client';
import { logger } from '../utils/logger';

// Types
export interface LeadStatusResponse {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

// Helper function to format lead status data
const formatLeadStatusResponse = (status: any): LeadStatusResponse => ({
  id: status.id,
  name: status.name,
  description: status.description,
  is_active: status.is_active,
  created_at: status.created_at.toISOString(),
});

// Get all active lead statuses
export const getAllActiveLeadStatuses = async () => {
  try {
    const statuses = await prisma.leadStatus.findMany({
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

    const formattedStatuses = statuses.map(formatLeadStatusResponse);

    logger.info(`Retrieved ${statuses.length} active lead statuses`);

    return {
      statuses: formattedStatuses,
      total: formattedStatuses.length,
    };

  } catch (error) {
    logger.error('Error retrieving lead statuses:', error);
    throw error;
  }
};

// Get lead status by ID
export const getLeadStatusById = async (statusId: number) => {
  try {
    const status = await prisma.leadStatus.findUnique({
      where: {
        id: statusId,
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

    if (!status) {
      throw new Error('Lead status not found');
    }

    const formattedStatus = formatLeadStatusResponse(status);

    logger.info(`Retrieved lead status: ${status.name} (ID: ${status.id})`);

    return formattedStatus;

  } catch (error) {
    logger.error('Error retrieving lead status:', error);
    throw error;
  }
}; 