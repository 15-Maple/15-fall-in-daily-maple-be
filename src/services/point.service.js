import { prisma } from "#db";

//포인트 조회
export const getPoint = async (logId) => {
  const log = await prisma.log.findUnique({
    where: {
      id: logId,
    },

    select: {
      points: true,
    },
  });
  return log;
};
