import { prisma } from "#db";

export const getHomeLogs = async () => {
  return prisma.log.findMany({
    select: {
      id: true,
      name: true,
      nickname: true,
      description: true,
      background: true,
      points: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
