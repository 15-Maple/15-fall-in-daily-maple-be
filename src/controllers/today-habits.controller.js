import { BadRequestException } from "#errors";
import * as habitService from "#services/today-habits.service.js";

export const getTodayHabits = async (req, res) => {
  const logId = Number(req.params.logId);
  const { page, limit } = res.locals.validated.query;

  console.log(`습관 조회 logId= ${logId}`);

  if (!Number.isInteger(logId) || logId <= 0) {
    throw new BadRequestException("올바르지 않는 로그 아이디입니다.");
  }

  // 에러는 Express 5가 캐치해서 에러 미들웨어로 던져주기 때문에 특별한 처리가 없다면 try catch를 사용하지 않아도 됨
  const { items, hasNextPage } = await habitService.getTodayHabits(
    logId,
    page,
    limit,
  );

  // 응답 예시입니다.
  res.status(200).json({
    success: true,
    message: "오늘의 습관목록 조회 성공",
    data: { items, pagination: { hasNextPage } },
  });
};

export const createHabitHistory = async (req, res) => {
  const habitId = Number(req.params.habitId);

  // 에러는 Express 5가 캐치해서 에러 미들웨어로 던져주기 때문에 특별한 처리가 없다면 try catch를 사용하지 않아도 됨
  await habitService.createHabitHistory(habitId);

  // 응답 예시입니다.
  res.status(201).json({
    success: true,
    message: "오늘의 습관목록 토글 생성",
  });
};

export const deleteHabitHistory = async (req, res) => {
  const habitId = Number(req.params.habitId);

  // 에러는 Express 5가 캐치해서 에러 미들웨어로 던져주기 때문에 특별한 처리가 없다면 try catch를 사용하지 않아도 됨
  await habitService.deleteHabitHistory(habitId);

  // 응답 예시입니다.
  res.status(200).json({
    success: true,
    message: "오늘의 습관목록 토글 삭제",
  });
};

export const getHabitsWeekly = async (req, res) => {
  const logId = Number(req.params.logId);

  if (!Number.isInteger(logId) || logId <= 0) {
    throw new BadRequestException("올바르지 않는 로그 아이디입니다.");
  }
  console.log(`주간 습관  logId= ${logId}`);

  const { weekStart, weekEnd, habits } =
    await habitService.getHabitsWeekly(logId);

  res.status(200).json({
    success: true,
    message: "습관기록표 조회 성공",
    data: { weekStart, weekEnd, habits },
  });
};
