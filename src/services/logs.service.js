import { prisma } from "#db";
import { hashPassword } from "#utils";

// 데이터 처리와 로직만 담당함 (req, res를 알 수 없음)
export const getLogs = async () => {
  // Prisma(내장 Repository) 사용
  const logs = await prisma.log.findMany();
  return logs;
};

export const createLog = async ({
  nickname,
  name,
  description,
  background,
  password,
}) => {
  const hashedPassword = await hashPassword(password);

  const savedLog = await prisma.log.create({
    data: {
      nickname,
      name,
      description,
      background,
      password: hashedPassword,
    },
  });

  return {
    logId: savedLog.id,
    nickname: savedLog.nickname,
    name: savedLog.name,
    description: savedLog.description,
    background: savedLog.background,
    points: savedLog.points,
    createdAt: savedLog.createdAt,
  };
};
