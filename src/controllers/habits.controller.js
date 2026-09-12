import * as habitService from "#services/habits.service.js";

export const getHabits = async (req, res) => {
  const { logId } = res.locals.validated.params;
  const { page, limit } = res.locals.validated.query;

  const { items, hasNextPage } = await habitService.getHabits(
    logId,
    page,
    limit,
  );

  res.status(200).json({
    success: true,
    message: "오늘의 습관목록 조회 성공",
    data: { items, pagination: { hasNextPage } },
  });
};

export const createHabitHistory = async (req, res) => {
  const { habitId } = res.locals.validated.params;

  await habitService.createHabitHistory(habitId);

  res.status(201).json({
    success: true,
    message: "오늘의 습관목록 토글 생성",
  });
};

export const deleteHabitHistory = async (req, res) => {
  const { habitId } = res.locals.validated.params;

  await habitService.deleteHabitHistory(habitId);

  res.status(200).json({
    success: true,
    message: "오늘의 습관목록 토글 삭제",
  });
};

export const getHabitsWeekly = async (req, res) => {
  const { logId } = res.locals.validated.params;

  const { weekStart, weekEnd, habits } =
    await habitService.getHabitsWeekly(logId);

  res.status(200).json({
    success: true,
    message: "습관기록표 조회 성공",
    data: { weekStart, weekEnd, habits },
  });
};
