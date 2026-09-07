import { prisma } from "#db";

//시:분:초 를 버리고 '오늘' 날짜만 만드는 함수
const getToday = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
};

// 데이터 처리와 로직만 담당함 (req, res를 알 수 없음)
export const getTodayHabits = async (logId) => {
  const habits = await prisma.habit.findMany({
    where: { logId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      habitHistories: { where: { recordDate: getToday() } },
    },
  });

  return habits.map((habit) => ({
    id: habit.id,
    name: habit.name,
    //isChecked: habit.habitHistories[0]?.isChecked ?? false,  사용하지않음.
    isChecked: habit.habitHistories.length > 0,
  }));
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
