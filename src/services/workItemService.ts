import { prisma } from '../prisma/client';
import { logger } from '../utils/logger';

export interface CreateWorkItemData {
  title: string;
  description?: string;
  customer_id: number;
  assigned_to?: number;
  status_id: number;
}

export interface UpdateWorkItemData {
  title?: string;
  description?: string;
  customer_id?: number;
  assigned_to?: number;
  status_id?: number;
  is_active?: boolean;
}

const getWorkItemIncludes = () => ({
  customer: true,
  assigned_user: {
    select: { id: true, name: true, email: true },
  },
  status: true,
  created_user: { select: { id: true, name: true } },
  updated_user: { select: { id: true, name: true } },
});

export const getAllWorkItems = async (filters?: { customer_id?: number; assigned_to?: number; status_id?: number }): Promise<any[]> => {
  const where: any = { is_active: true };
  if (filters?.customer_id) where.customer_id = filters.customer_id;
  if (filters?.assigned_to) where.assigned_to = filters.assigned_to;
  if (filters?.status_id) where.status_id = filters.status_id;

  const items = await prisma.workItem.findMany({ where, include: getWorkItemIncludes(), orderBy: { created_at: 'desc' } });
  return items;
};

export const filterWorkItems = async (filters: { customer_ids?: number[]; assigned_to_ids?: number[]; status_ids?: number[] }): Promise<any[]> => {
  const andClauses: any[] = [{ is_active: true }];

  if (filters.customer_ids && filters.customer_ids.length > 0) {
    andClauses.push({ customer_id: { in: filters.customer_ids } });
  }

  if (filters.assigned_to_ids && filters.assigned_to_ids.length > 0) {
    andClauses.push({ assigned_to: { in: filters.assigned_to_ids } });
  }

  if (filters.status_ids && filters.status_ids.length > 0) {
    andClauses.push({ status_id: { in: filters.status_ids } });
  }

  const where: any = { AND: andClauses };

  const items = await prisma.workItem.findMany({ where, include: getWorkItemIncludes(), orderBy: { created_at: 'desc' } });
  return items;
};

export const getWorkItemById = async (id: number): Promise<any> => {
  const item = await prisma.workItem.findFirst({ where: { id, is_active: true }, include: getWorkItemIncludes() });
  if (!item) {
    const error = new Error('Work item not found');
    (error as any).statusCode = 404;
    throw error;
  }
  return item;
};

async function assertValidCustomer(customerId: number) {
  const customer = await prisma.lead.findFirst({ where: { id: customerId, is_active: true, is_converted: true } });
  if (!customer) {
    const err = new Error('Invalid customer_id. Customer must exist and be a converted lead');
    (err as any).statusCode = 400;
    throw err;
  }
}

async function assertValidAssignee(userId?: number) {
  if (!userId) return;
  const user = await prisma.user.findFirst({ where: { id: userId, is_active: true } });
  if (!user) {
    const err = new Error('Invalid assigned_to user id');
    (err as any).statusCode = 400;
    throw err;
  }
}

async function assertValidStatus(statusId: number) {
  const status = await prisma.workStatus.findFirst({ where: { id: statusId, is_active: true } });
  if (!status) {
    const err = new Error('Invalid status_id');
    (err as any).statusCode = 400;
    throw err;
  }
}

export const createWorkItem = async (data: CreateWorkItemData, userId: number): Promise<any> => {
  await assertValidCustomer(data.customer_id);
  await assertValidAssignee(data.assigned_to);
  await assertValidStatus(data.status_id);

  const item = await prisma.workItem.create({
    data: {
      title: data.title,
      description: data.description,
      customer_id: data.customer_id,
      assigned_to: data.assigned_to,
      status_id: data.status_id,
      created_by: userId,
      updated_by: userId,
    },
    include: getWorkItemIncludes(),
  });
  logger.info(`Work item created: ${item.title} by user ${userId}`);
  return item;
};

export const updateWorkItem = async (id: number, data: UpdateWorkItemData, userId: number): Promise<any> => {
  if (data.customer_id) await assertValidCustomer(data.customer_id);
  if (data.assigned_to) await assertValidAssignee(data.assigned_to);
  if (data.status_id) await assertValidStatus(data.status_id);

  const item = await prisma.workItem.update({
    where: { id },
    data: { ...data, updated_by: userId },
    include: getWorkItemIncludes(),
  });
  logger.info(`Work item updated: ${id} by user ${userId}`);
  return item;
};

export const deleteWorkItem = async (id: number, userId: number): Promise<void> => {
  await prisma.workItem.update({ where: { id }, data: { is_active: false, updated_by: userId } });
  logger.info(`Work item soft-deleted: ${id} by user ${userId}`);
};
