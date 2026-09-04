import { prisma } from "#db";

//시:분:초 를 버리고 '오늘' 날짜만 만드는 함수
const getTodayDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// 데이터 처리와 로직만 담당함 (req, res를 알 수 없음)
export const getTodayHabits = async (logId) => {
  const today = getTodayDate();

  const habits = await prisma.habit.findMany({
    where: { logId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      habitHistories: { where: { recordDate: today } },
    },
  });

  return habits.map((habit) => ({
    id: habit.id,
    name: habit.name,
    //isChecked: habit.habitHistories[0]?.isChecked ?? false,  사용하지않음.
  }));
};
