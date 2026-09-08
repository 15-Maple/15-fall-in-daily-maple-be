import { prisma } from "#db";

export const getHomeLogs = async () => {
  const logs = await prisma.log.findMany();

  return logs;
};
