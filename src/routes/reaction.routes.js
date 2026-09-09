import { Router } from "express";

import {
  getReactionsCtr,
  postReactionCtr,
} from "#controllers/reaction.controller.js";

export const reactionRoutes = Router({ mergeParams: true });

reactionRoutes.get("/", getReactionsCtr);
reactionRoutes.post("/", postReactionCtr);

export default reactionRoutes;
