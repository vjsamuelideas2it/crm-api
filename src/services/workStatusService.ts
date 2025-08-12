import { prisma } from '../prisma/client';

export const getAllWorkStatuses = async () => {
  const statuses = await prisma.workStatus.findMany({
    where: { is_active: true },
    orderBy: { id: 'asc' },
  });
  return statuses;
};
