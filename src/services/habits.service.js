import { prisma } from "#db";
import { getToday } from "#utils";

export const getHabits = async (logId, page, limit) => {
  const skip = (page - 1) * limit;
  //다음 페이지 여부확인을 위한 7번쨰 습관 조회
  const take = limit + 1;
  const habits = await prisma.habit.findMany({
    where: { logId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take,
    skip,
    include: {
      habitHistories: { where: { recordDate: getToday() } },
    },
  });
  const hasNextPage = habits.length > limit;
  const trimmed = habits.slice(0, limit);

  return {
    items: trimmed.map((habit) => ({
      id: habit.id,
      name: habit.name,
      isChecked: habit.habitHistories.length > 0,
    })),
    hasNextPage,
  };
};

//습관 이력 생성
export const createHabitHistory = async (habitId) => {
  const created = await prisma.habitHistory.create({
    data: { habitId, recordDate: getToday() },
  });
  return created;
};

//습관 이력 삭제
export const deleteHabitHistory = async (habitId) => {
  const deleted = await prisma.habitHistory.delete({
    where: {
      habitId_recordDate: {
        habitId,
        recordDate: getToday(),
      },
    },
  });
  return deleted;
};

export const getHabitsWeekly = async (logId) => {
  const today = getToday();
  const dayOfWeek = today.getDay();
  const dayOfWeekStart = dayOfWeek === 0 ? Number(6) : Number(dayOfWeek - 1);
  const dayOfWeekEnd = Number(6) - dayOfWeekStart;
  const weekStart = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate() - dayOfWeekStart,
    ),
  );
  const weekEnd = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate() + dayOfWeekEnd,
    ),
  );

  const weeklyHabits = await prisma.habit.findMany({
    where: {
      logId,
      OR: [
        { deletedAt: null },
        {
          habitHistories: {
            some: {
              recordDate: {
                gte: weekStart,
                lte: weekEnd,
              },
            },
          },
        },
      ],
    },
    orderBy: { createdAt: "asc" },
    include: {
      habitHistories: {
        where: {
          recordDate: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      },
    },
  });

  //일주일 true/false 배열 만들기
  const buildWeeklyRecords = (habitHistories, weekStart) => {
    const records = Array(7).fill(false);

    habitHistories.forEach((history) => {
      const diffDays = Math.round(
        (history.recordDate.getTime() - weekStart.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      records[diffDays] = true;
    });

    return records;
  };

  return {
    weekStart,
    weekEnd,
    habits: weeklyHabits.map((weeklyHabit) => ({
      habitId: weeklyHabit.id,
      name: weeklyHabit.name,
      isDeleted: weeklyHabit.deletedAt !== null,
      records: buildWeeklyRecords(weeklyHabit.habitHistories, weekStart),
    })),
  };
};
