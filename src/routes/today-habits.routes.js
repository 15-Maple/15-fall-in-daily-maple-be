import express from "express";
import { z } from "zod";

import * as habitController from "#controllers/today-habits.controller.js";
import { validate } from "#middlewares";

//{ mergeParams: true } :logId가 안으로 전달되지 않아서 넣음
export const todayHabitRoutes = express.Router({ mergeParams: true });
export const togleHabitRoutes = express.Router({ mergeParams: true });

// 목록 조회시 query가 있다면 querySchema 만들어서 검증
const querySchema = z.object({
  page: z.coerce.number().min(1).max(6).default(1),
  limit: z.coerce.number().min(1).max(30).default(6),
});

// GET /api/{logId}/habits
todayHabitRoutes.get(
  "/",
  validate(querySchema, "query"),
  habitController.getTodayHabits,
);

togleHabitRoutes.post("/", habitController.createHabitHistory);
togleHabitRoutes.delete("/", habitController.deleteHabitHistory);
