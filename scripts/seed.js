import { fakerKO as faker } from "@faker-js/faker";

import { prisma } from "#db";
import { hashPassword } from "#utils";

import { assertSafeSeedTarget, resetAllData } from "./seed-safety.js";

const NUM_LOGS = 20;

const LOG_NAME_SUFFIXES = [
  "의 로그",
  "의 소중한 일기",
  "의 하루 기록",
  "의 코딩 공부 일지",
  "의 성장일지",
  "의 행복기록",
  "의 비밀 노트",
  "의 소소한 일상",
  "의 끄적임",
  "의 개발 공장",
];

const password = await hashPassword("1234");

const BACKGROUNDS = [
  "bgGreen",
  "bgYellow",
  "bgBlue",
  "bgPink",
  "bgDesk",
  "bgWindow",
  "bgTile",
  "bgPlant",
];

const HABITS = [
  "일찍 일어나기",
  "물 1L 이상 마시기",
  "독서 30분 이상",
  "자바스크립트 공부하기",
  "영어 공부하기",
  "하루 계획 및 우선순위 정하기",
  "개발 블로그나 잔디(GitHub) 관리하기",
  "스트레칭 및 가벼운 운동 20분",
  "컴퓨터 앞 바른 자세 유지하기",
  "50분 집중 후 10분 휴식하기",
  "일기 쓰기 또는 하루 회고하기",
  "주변 공간 정리정돈하기",
  "소비 내역 기록하기",
  "스마트폰 사용 시간 제한하기",
  "정해진 시간에 취침하기",
];

const REACTION_TYPES = ["😀", "❤️", "🐿️", "⭐️"];

const makeLogInput = () => {
  // 로그 이름 만들기
  const nickname = faker.person.firstName();
  const suffix = faker.helpers.arrayElement(LOG_NAME_SUFFIXES);
  const name = `${nickname}${suffix}`;

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 32);

  return {
    name,
    nickname,
    password,
    description: faker.lorem.sentence(),
    background: faker.helpers.arrayElement(BACKGROUNDS),
    points: 0,
    createdAt: pastDate,
  };
};

// 같은 habit에 날짜가 겹치면 @@unique 제약에 걸리니, 최근 30일 중 겹치지 않게 뽑음
const pickUniqueRecentDates = (count) => {
  const pool = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (i + 1));
    date.setHours(0, 0, 0, 0);
    return date;
  });
  return faker.helpers.arrayElements(pool, count);
};

async function seed() {
  // 1. Log 생성
  const logs = await prisma.log.createManyAndReturn({
    data: Array.from({ length: NUM_LOGS }, makeLogInput),
  });

  // 2. Habit 생성 (log 당 1-4개)
  const habitData = logs.flatMap((log) => {
    const count = faker.number.int({ min: 1, max: 4 });

    // HABITS 배열에서 중복 없이 count 개수만큼 한 번에 뽑아둠
    const pickedHabits = faker.helpers.arrayElements(HABITS, count);

    return pickedHabits.map((habitName) => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 31);

      const isDeleted = faker.datatype.boolean({ probability: 0.2 });
      const deletedDate = new Date();
      deletedDate.setDate(deletedDate.getDate() - 5);

      return {
        logId: log.id,
        name: habitName,
        createdAt: pastDate,
        deletedAt: isDeleted ? deletedDate : null,
      };
    });
  });
  const habits = await prisma.habit.createManyAndReturn({ data: habitData });

  // 3. HabitHistory 생성 (부모: Habit)
  const habitHistoryData = habits.flatMap((habit) => {
    const count = faker.number.int({ min: 0, max: 10 });

    // 1-30일 전 사이의 날짜들을 뽑아옵니다.
    let randomDates = pickUniqueRecentDates(count);

    // 중간에 삭제된 습관
    if (habit.deletedAt) {
      // 뽑힌 날짜들 중에 '삭제된 날짜'보다 이전인 날짜만 남김 (삭제된 이후에는 체크한 기록이 없도록 필터링)
      randomDates = randomDates.filter(
        (recordDate) => recordDate < habit.deletedAt,
      );
    }

    return randomDates.map((recordDate) => ({
      habitId: habit.id,
      recordDate,
    }));
  });
  await prisma.habitHistory.createMany({ data: habitHistoryData });

  // 4. PointHistory 생성 (부모: Log)
  const pointHistoryData = [];

  logs.forEach((log) => {
    const completedCount = faker.number.int({ min: 0, max: 10 });

    for (let i = 0; i < completedCount; i++) {
      const targetSeconds = faker.helpers.arrayElement([
        1800, 2400, 3000, 3600,
      ]);
      const earnedPoints = 3 + Math.floor(targetSeconds / 600);
      const endedAt = faker.date.recent({ days: 20 });

      pointHistoryData.push({
        logId: log.id,
        pointsChanged: earnedPoints,
        description: "집중 완료 보상",
        createdAt: endedAt,
      });
    }
  });

  await prisma.pointHistory.createMany({ data: pointHistoryData });

  // 5. Reaction 생성 (부모: Log)
  const reactionData = logs.flatMap((log) => {
    const count = faker.number.int({ min: 0, max: 15 });
    return Array.from({ length: count }, () => ({
      logId: log.id,
      reactionType: faker.helpers.arrayElement(REACTION_TYPES),
    }));
  });
  await prisma.reaction.createMany({ data: reactionData });

  // 6. 반정규화 데이터 정합성 맞추기: Log 테이블의 총 포인트 업데이트
  const pointsByLog = {};

  for (const history of pointHistoryData) {
    if (!pointsByLog[history.logId]) {
      pointsByLog[history.logId] = 0;
    }
    pointsByLog[history.logId] += history.pointsChanged;
  }

  const updateLogPromises = logs.map((log) => {
    const totalPoints = pointsByLog[log.id] || 0; // 히스토리가 없으면 0점

    return prisma.log.update({
      where: { id: log.id },
      data: { points: totalPoints },
    });
  });

  await Promise.all(updateLogPromises);

  return {
    logCount: logs.length,
    habitCount: habits.length,
    habitHistoryCount: habitHistoryData.length,
    pointHistoryCount: pointHistoryData.length,
    reactionCount: reactionData.length,
  };
}

async function main() {
  assertSafeSeedTarget({
    databaseUrl: process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    args: process.argv,
  });

  await resetAllData();
  const result = await seed();

  console.log("🌱 시딩 완료:", result);
}

main()
  .catch((error) => {
    console.error("❌ 시딩 오류:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
