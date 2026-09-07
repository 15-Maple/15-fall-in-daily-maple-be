import { prisma } from "#db";

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

export const postReaction = async (logId, reactionType) => {
  const reaction = await prisma.reaction.create({
    data: {
      logId: logId,
      reactionType: reactionType,
    },
  });
  return reaction;
};
