import { prisma } from '../prisma/client';
import { logger } from '../utils/logger';

export interface CreateTaskData {
  title: string;
  description?: string;
  work_item_id: number;
  customer_id: number;
  assigned_to?: number;
  status_id: number;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  work_item_id?: number;
  customer_id?: number;
  assigned_to?: number;
  status_id?: number;
  is_active?: boolean;
}

const getTaskIncludes = () => ({
  work_item: true,
  customer: true,
  status: true,
  assigned_user: { select: { id: true, name: true, email: true } },
  created_user: { select: { id: true, name: true } },
  updated_user: { select: { id: true, name: true } },
});

async function assertValidWorkItem(workItemId: number) {
  const item = await prisma.workItem.findFirst({ where: { id: workItemId, is_active: true } });
  if (!item) {
    const err = new Error('Invalid work_item_id');
    (err as any).statusCode = 400;
    throw err;
  }
  return item;
}

async function assertValidCustomer(customerId: number) {
  const customer = await prisma.lead.findFirst({ where: { id: customerId, is_active: true, is_converted: true } });
  if (!customer) {
    const err = new Error('Invalid customer_id. Customer must exist and be a converted lead');
    (err as any).statusCode = 400;
    throw err;
  }
  return customer;
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

export const getAllTasks = async (filters?: { customer_id?: number; work_item_id?: number; assigned_to?: number; status_id?: number }): Promise<any[]> => {
  // Build a flexible where with AND groups so we can support relational OR filters cleanly
  const andClauses: any[] = [{ is_active: true }];

  if (filters?.customer_id) {
    andClauses.push({ customer_id: filters.customer_id });
  }

  if (filters?.work_item_id) {
    andClauses.push({ work_item_id: filters.work_item_id });
  }

  if (typeof filters?.assigned_to === 'number') {
    // Include tasks directly assigned to the user OR tasks whose parent work item is assigned to the user
    andClauses.push({
      OR: [
        { assigned_to: filters.assigned_to },
        { work_item: { assigned_to: filters.assigned_to } },
      ],
    });
  }

  if (filters?.status_id) {
    andClauses.push({ status_id: filters.status_id });
  }

  const where: any = { AND: andClauses };

  const tasks = await prisma.task.findMany({ where, include: getTaskIncludes(), orderBy: { created_at: 'desc' } });
  return tasks;
};

export const filterTasks = async (filters: { customer_ids?: number[]; work_item_ids?: number[]; assigned_to_ids?: number[]; status_ids?: number[] }): Promise<any[]> => {
  const andClauses: any[] = [{ is_active: true }];

  if (filters.customer_ids && filters.customer_ids.length > 0) {
    andClauses.push({ customer_id: { in: filters.customer_ids } });
  }
  if (filters.work_item_ids && filters.work_item_ids.length > 0) {
    andClauses.push({ work_item_id: { in: filters.work_item_ids } });
  }
  if (filters.assigned_to_ids && filters.assigned_to_ids.length > 0) {
    andClauses.push({
      OR: [
        { assigned_to: { in: filters.assigned_to_ids } },
        { work_item: { assigned_to: { in: filters.assigned_to_ids } } },
      ],
    });
  }
  if (filters.status_ids && filters.status_ids.length > 0) {
    andClauses.push({ status_id: { in: filters.status_ids } });
  }

  const where: any = { AND: andClauses };
  const tasks = await prisma.task.findMany({ where, include: getTaskIncludes(), orderBy: { created_at: 'desc' } });
  return tasks;
};

export const getTaskById = async (id: number): Promise<any> => {
  const task = await prisma.task.findFirst({ where: { id, is_active: true }, include: getTaskIncludes() });
  if (!task) {
    const error = new Error('Task not found');
    (error as any).statusCode = 404;
    throw error;
  }
  return task;
};

export const createTask = async (data: CreateTaskData, userId: number): Promise<any> => {
  const workItem = await assertValidWorkItem(data.work_item_id);
  await assertValidCustomer(data.customer_id);
  if (workItem.customer_id !== data.customer_id) {
    const err = new Error('Task customer_id must match the work item customer_id');
    (err as any).statusCode = 400;
    throw err;
  }
  await assertValidAssignee(data.assigned_to);
  await assertValidStatus(data.status_id);

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      work_item_id: data.work_item_id,
      customer_id: data.customer_id,
      assigned_to: data.assigned_to,
      status_id: data.status_id,
      created_by: userId,
      updated_by: userId,
    },
    include: getTaskIncludes(),
  });
  logger.info(`Task created: ${task.title} by user ${userId}`);
  return task;
};

export const updateTask = async (id: number, data: UpdateTaskData, userId: number): Promise<any> => {
  if (data.work_item_id) await assertValidWorkItem(data.work_item_id);
  if (data.customer_id) await assertValidCustomer(data.customer_id);
  await assertValidAssignee(data.assigned_to);
  if (typeof data.status_id === 'number') await assertValidStatus(data.status_id);

  if (data.work_item_id && data.customer_id) {
    const workItem = await prisma.workItem.findUnique({ where: { id: data.work_item_id } });
    if (workItem && workItem.customer_id !== data.customer_id) {
      const err = new Error('Task customer_id must match the work item customer_id');
      (err as any).statusCode = 400;
      throw err;
    }
  }

  const task = await prisma.task.update({
    where: { id },
    data: { ...data, updated_by: userId },
    include: getTaskIncludes(),
  });
  logger.info(`Task updated: ${id} by user ${userId}`);
  return task;
};

export const deleteTask = async (id: number, userId: number): Promise<void> => {
  await prisma.task.update({ where: { id }, data: { is_active: false, updated_by: userId } });
  logger.info(`Task soft-deleted: ${id} by user ${userId}`);
};
