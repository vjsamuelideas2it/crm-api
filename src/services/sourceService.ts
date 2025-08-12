import { prisma } from '../prisma/client';
import { logger } from '../utils/logger';

// Types
export interface SourceResponse {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

// Helper function to format source data
const formatSourceResponse = (source: any): SourceResponse => ({
  id: source.id,
  name: source.name,
  description: source.description,
  is_active: source.is_active,
  created_at: source.created_at.toISOString(),
});

// Get all active sources
export const getAllActiveSources = async () => {
  try {
    const sources = await prisma.source.findMany({
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

    const formattedSources = sources.map(formatSourceResponse);

    logger.info(`Retrieved ${sources.length} active sources`);

    return {
      sources: formattedSources,
      total: formattedSources.length,
    };

  } catch (error) {
    logger.error('Error retrieving sources:', error);
    throw error;
  }
};

// Get source by ID
export const getSourceById = async (sourceId: number) => {
  try {
    const source = await prisma.source.findUnique({
      where: {
        id: sourceId,
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

    if (!source) {
      throw new Error('Source not found');
    }

    const formattedSource = formatSourceResponse(source);

    logger.info(`Retrieved source: ${source.name} (ID: ${source.id})`);

    return formattedSource;

  } catch (error) {
    logger.error('Error retrieving source:', error);
    throw error;
  }
}; 