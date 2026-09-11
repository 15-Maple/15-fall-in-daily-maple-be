import { prisma } from "#db";
import { hashPassword } from "#utils";

// 데이터 처리와 로직만 담당함 (req, res를 알 수 없음)
// 로그 전체 조회
export const getLogs = async () => {
  const logs = await prisma.log.findMany();

  return logs;
};

// 현재 로그 조회
export const getLogById = async (logId) => {
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

// 로그 수정
export const updateLog = async (logId, data) => {
  const id = logId;
  const { password } = data;

  // 대상 로그 조회
  const currentLog = await prisma.log.findUnique({
    where: { id },
  });

  if (!currentLog) {
    throw new Error("존재하지 않는 로그입니다.");
  }

  const updateData = {
    nickname: data.nickname,
    name: data.name,
    description: data.description || null,
    background: data.background,
  };

  // 비밀번호 변경값이 있을 때만 password 포함
  if (password) {
    updateData.password = await hashPassword(password);
  }

  const updatedLog = await prisma.log.update({
    where: { id },
    data: updateData,
  });

  return {
    logId: updatedLog.id,
    nickname: updatedLog.nickname,
    name: updatedLog.name,
    description: updatedLog.description,
    background: updatedLog.background,
    points: updatedLog.points,
    updatedAt: updatedLog.updatedAt,
  };
};

// 로그 삭제
export const deleteLog = async (logId) => {
  return await prisma.log.delete({
    where: { id: Number(logId) },
  });
};
