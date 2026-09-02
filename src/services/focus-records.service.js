import { prisma } from "#db";

// 데이터 처리와 로직만 담당함 (req, res를 알 수 없음)
export const getFocusRecords = async () => {
  // Prisma(내장 Repository) 사용
  const records = await prisma.focusRecord.findMany();
  return records;
};
