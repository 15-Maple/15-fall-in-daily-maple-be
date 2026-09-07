import { getReactions, postReaction } from "#services/reaction.service.js";

export const getReactionsCtr = async (req, res) => {
  const logId = Number(req.parmas.logId);

  const reactions = await getReactions(logId);
  res.status(200).json(reactions);
};

export const postReactionCtr = async (req, res) => {
  const logId = Number(req.parmas.logId);
  const reactionsType = req.body.reactionsType;

  const reaction = await postReaction(logId, reactionsType);
  res.status(201).json(reaction);
};
