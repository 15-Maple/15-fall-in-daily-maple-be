import { prisma } from "#db";

// 데이터 처리와 로직만 담당함 (req, res를 알 수 없음)
export const getFocusRecords = async () => {
  const records = await prisma.focusSession.findMany();
  return records;
};

export const createFocusSession = async (logId, targetSeconds) => {
  const result = await prisma.focusSession.upsert({
    where: {
      logId: Number(logId),
    },
    // 데이터 존재: 덮어쓰기
    update: {
      targetSeconds: Number(targetSeconds),
      createdAt: new Date(),
    },
    // 데이터 없음: 생성
    create: {
      logId: Number(logId),
      targetSeconds: Number(targetSeconds),
    },
  });
  return result;
};

export const getFocusSession = async (logId) => {
  return await prisma.focusSession.findUnique({
    where: { logId: Number(logId) },
  });
};

export const deleteFocusSession = async (logId) => {
  return await prisma.focusSession.delete({
    where: { logId: Number(logId) },
  });
};
