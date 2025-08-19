import { prisma } from '../prisma/client';
import { logger } from '../utils/logger';

export interface CreateCommunicationData {
  lead_id: number;
  message: string;
}

export interface UpdateCommunicationData {
  message?: string;
  is_active?: boolean;
}

const include = {
  created_user: { select: { id: true, name: true } },
  updated_user: { select: { id: true, name: true } },
};

export const listCommunications = async (filters: { lead_id?: number; created_by?: number }) => {
  const where: any = { is_active: true };
  if (filters.lead_id) where.lead_id = filters.lead_id;
  if (filters.created_by) where.created_by = filters.created_by;
  const items = await prisma.communication.findMany({ where, include, orderBy: { created_at: 'desc' } });
  return items;
};

export const filterCommunications = async (filters: { lead_ids?: number[]; created_by_ids?: number[] }) => {
  const andClauses: any[] = [{ is_active: true }];
  if (filters.lead_ids && filters.lead_ids.length > 0) {
    andClauses.push({ lead_id: { in: filters.lead_ids } });
  }
  if (filters.created_by_ids && filters.created_by_ids.length > 0) {
    andClauses.push({ created_by: { in: filters.created_by_ids } });
  }
  const where: any = { AND: andClauses };
  const items = await prisma.communication.findMany({ where, include, orderBy: { created_at: 'desc' } });
  return items;
};

export const getCommunicationById = async (id: number) => {
  const item = await prisma.communication.findFirst({ where: { id, is_active: true }, include });
  if (!item) {
    const error = new Error('Communication not found');
    (error as any).statusCode = 404;
    throw error;
  }
  return item;
};

export const createCommunication = async (data: CreateCommunicationData, userId: number) => {
  // Validate lead exists
  const lead = await prisma.lead.findFirst({ where: { id: data.lead_id, is_active: true } });
  if (!lead) {
    const err = new Error('Invalid lead_id');
    (err as any).statusCode = 400;
    throw err;
  }
  const item = await prisma.communication.create({
    data: { lead_id: data.lead_id, message: data.message, created_by: userId, updated_by: userId },
    include,
  });
  logger.info(`Communication created for lead ${data.lead_id} by user ${userId}`);
  return item;
};

export const updateCommunication = async (id: number, data: UpdateCommunicationData, userId: number) => {
  const item = await prisma.communication.update({ where: { id }, data: { ...data, updated_by: userId }, include });
  logger.info(`Communication updated ${id} by user ${userId}`);
  return item;
};

export const deleteCommunication = async (id: number, userId: number) => {
  await prisma.communication.update({ where: { id }, data: { is_active: false, updated_by: userId } });
  logger.info(`Communication soft-deleted ${id} by user ${userId}`);
};
