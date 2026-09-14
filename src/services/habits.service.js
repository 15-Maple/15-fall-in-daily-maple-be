import { prisma } from "#db";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "#errors";
import { getToday } from "#utils";

//B0 한사람 30습관 상수 정의
export const MAX_HABIT_COUNT = 30;

const assertHabitOwnership = async (habitId, logId) => {
  const habit = await prisma.habit.findUnique({ where: { id: habitId } });

  if (!habit) {
    throw new NotFoundException("존재하지 않는 습관입니다.");
  }

  if (habit.logId !== logId) {
    throw new ForbiddenException("해당 습관에 대한 권한이 없습니다.");
  }
};

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
export const createHabitHistory = async (habitId, logId) => {
  await assertHabitOwnership(habitId, logId);

  const created = await prisma.habitHistory.create({
    data: { habitId, recordDate: getToday() },
  });
  return created;
};

//습관 이력 삭제
export const deleteHabitHistory = async (habitId, logId) => {
  await assertHabitOwnership(habitId, logId);

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

//습관 주간 조회
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

// 습관 목록 일괄 생성/수정/삭제
export const syncHabits = async (logId, { create, update, deleteIds }) => {
  return prisma.$transaction(async (tx) => {
    // 1) 내 소유 습관 전체 조회 (삭제된 것 포함 - 소유권 검증 + 이름 중복/복구 판단용)
    const ownedHabits = await tx.habit.findMany({ where: { logId } });
    const ownedById = new Map(ownedHabits.map((habit) => [habit.id, habit]));

    // 2) update/delete 대상 소유권 검증
    [...update.map((item) => item.id), ...deleteIds].forEach((habitId) => {
      const habit = ownedById.get(habitId);
      if (!habit) {
        throw new NotFoundException("존재하지 않는 습관입니다.");
      }
      if (habit.deletedAt) {
        throw new NotFoundException("이미 삭제된 습관입니다.");
      }
    });

    // 3) 최종적으로 남게 될 이름 목록 계산 (트림 후, 대소문자 구분 비교)
    const deleteIdSet = new Set(deleteIds);
    const updateNameById = new Map(update.map((item) => [item.id, item.name]));

    const remainingActiveNames = ownedHabits
      .filter((habit) => !habit.deletedAt && !deleteIdSet.has(habit.id))
      .map((habit) => updateNameById.get(habit.id) ?? habit.name);

    const createNames = create.map((item) => item.name);

    // 4) 최대 30개 제한 (기존 활성 - 삭제 + 신규 생성)
    const finalCount = remainingActiveNames.length + createNames.length;
    if (finalCount > MAX_HABIT_COUNT) {
      throw new BadRequestException(
        `습관은 최대 ${MAX_HABIT_COUNT}개까지 등록할 수 있습니다.`,
      );
    }

    // 5) 최종 이름 중복 검사 (남는 기존 습관 + 새로 만들 습관 사이)
    const nameCount = new Map();
    [...remainingActiveNames, ...createNames].forEach((name) => {
      nameCount.set(name, (nameCount.get(name) ?? 0) + 1);
    });
    const duplicated = [...nameCount.entries()].find(([, count]) => count > 1);
    if (duplicated) {
      throw new ConflictException(
        `이미 존재하는 습관 이름입니다: ${duplicated[0]}`,
      );
    }

    // 6) 삭제 처리 (소프트 삭제)
    if (deleteIds.length > 0) {
      await tx.habit.updateMany({
        where: { id: { in: deleteIds }, logId },
        data: { deletedAt: new Date() },
      });
    }

    // 7) 이름 수정 처리
    for (const { id, name } of update) {
      await tx.habit.update({ where: { id }, data: { name } });
    }

    // 8) 생성 처리 - 같은 이름의 "소프트 삭제된" 습관이 있으면 복구, 없으면 새로 생성
    for (const { name } of create) {
      const deletedSameName = ownedHabits.find(
        (habit) => habit.deletedAt && habit.name === name,
      );

      if (deletedSameName) {
        await tx.habit.update({
          where: { id: deletedSameName.id },
          data: { deletedAt: null },
        });
      } else {
        await tx.habit.create({ data: { logId, name } });
      }
    }
  });
};
