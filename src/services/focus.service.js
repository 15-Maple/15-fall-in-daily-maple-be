import { prisma } from "#db";
import { HttpException } from "#errors";
import { formatDateTime } from "#utils";

export const getFocusRecords = async () => {
  const records = await prisma.focusSession.findMany();
  return records;
};

export const createFocusSession = async (logId, targetSeconds) => {
  const result = await prisma.focusSession.upsert({
    where: {
      logId: Number(logId),
    },
    // 데이터 있음: 덮어쓰기
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

export const finishAndGiveReward = async (logId) => {
  // 세션 조회
  const session = await getFocusSession(logId);

  // 세션 검증
  if (!session) {
    throw new HttpException(404, "진행 중인 집중이 없습니다.");
  }

  // 시간 검증
  const now = new Date();
  const elapsedSeconds = Math.floor((now - session.createdAt) / 1000);
  if (elapsedSeconds < session.targetSeconds) {
    throw new HttpException(403, "아직 목표 시간이 지나지 않았습니다."); // 포인트 증가 우회 api 차단
  }

  // 포인트 및 설명 계산
  const earnedPoints = 3 + Math.floor(session.targetSeconds / 600);
  const targetMinutes = Math.floor(session.targetSeconds / 60);
  const startTime = formatDateTime(session.createdAt);
  const endTime = formatDateTime(now);
  const description = `${startTime} ~ ${endTime}까지 ${targetMinutes}분 집중`;

  // 트랜잭션(에러가 나면 전부 롤백됨)
  await prisma.$transaction(async (tx) => {
    // 포인트 내역 생성
    await tx.pointHistory.create({
      data: {
        logId: Number(logId),
        pointsChanged: earnedPoints,
        description: description,
      },
    });

    // 집중 확인용 세션 삭제
    await tx.focusSession.delete({
      where: { logId: Number(logId) },
    });

    // Log 테이블 총 포인트 업데이트
    await tx.log.update({
      where: { id: Number(logId) },
      data: {
        points: {
          increment: earnedPoints,
        },
      },
    });
  });

  return earnedPoints;
};
