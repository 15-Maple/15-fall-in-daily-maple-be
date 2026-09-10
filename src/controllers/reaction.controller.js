import { getReactions, postReaction } from "#services/reaction.service.js";

// 리액션 조회
export const getReactionsCtr = async (req, res) => {
  const logId = Number(req.params.logId);

  const reactions = await getReactions(logId);

  res.status(200).json({
    success: true,
    data: reactions,
  });
};

// 리액션 추가
export const postReactionCtr = async (req, res) => {
  const logId = Number(req.params.logId);

  const reactionType = req.body.reactionType;

  const reaction = await postReaction(logId, reactionType);

  res.status(201).json({
    success: true,
    data: reaction,
  });
};
