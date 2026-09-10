import { prisma } from "#db";
import { hashPassword } from "#utils";

// 데이터 처리와 로직만 담당함 (req, res를 알 수 없음)
// 현재 로그 조회
export const getLog = async (logId) => {
  const log = await prisma.log.findUnique({
    where: {
      id: logId,
    },

    select: {
      id: true,
      name: true,
      nickname: true,
      description: true,
      background: true,
      points: true,
      createdAt: true,
    },
  });
  return log;
};

// 로그 생성
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
