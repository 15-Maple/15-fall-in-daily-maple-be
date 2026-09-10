import { prisma } from "#db";

//시:분:초 를 버리고 '오늘' 날짜만 만드는 함수 한국시간 기준으로
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const getToday = () => {
  const kstNow = new Date(new Date().getTime() + KST_OFFSET_MS);
  return new Date(
    Date.UTC(
      kstNow.getUTCFullYear(),
      kstNow.getUTCMonth(),
      kstNow.getUTCDate(),
    ),
  );
};

export const getTodayHabits = async (logId, page, limit) => {
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
