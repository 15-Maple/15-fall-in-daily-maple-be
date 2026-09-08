import { prisma } from "#db";

// 리액션 조회
export const getReactions = async (logId) => {
  const reactions = await prisma.reaction.groupBy({
    by: ["reactionType"],

    where: {
      logId: logId,
    },

    _count: {
      reactionType: true,
    },

    orderBy: {
      _count: {
        reactionType: "desc",
      },
    },
  });

  return reactions.map((reaction) => {
    return {
      emoji: reaction.reactionType,
      count: reaction._count.reactionType,
    };
  });
};

// 리액션 추가
export const postReaction = async (logId, reactionType) => {
  const reaction = await prisma.reaction.create({
    data: {
      logId: logId,
      reactionType: reactionType,
    },
  });

  return reaction;
};
