import express from "express";
import { z } from "zod";

import * as habitController from "#controllers/habits.controller.js";
import { requireLogAuth, validate } from "#middlewares";

export const habitRoutes = express.Router();
export const togleHabitRoutes = express.Router({ mergeParams: true });

// 1개의 logId -> 최대 30개의 습관
const querySchema = z.object({
  page: z.coerce.number().min(1).max(6).default(1),
  limit: z.coerce.number().min(1).max(30).default(6),
});

// habitId 파라미터 검증 (습관 체크 생성 / 삭제 공통)
const habitIdParamsSchema = z.object({
  habitId: z.coerce.number().int().positive(),
});

habitRoutes.get(
  "/me",
  requireLogAuth,
  validate(querySchema, "query"),
  habitController.getHabits,
);

habitRoutes.get("/me/weekly", requireLogAuth, habitController.getHabitsWeekly);

togleHabitRoutes.post(
  "/",
  requireLogAuth,
  validate(habitIdParamsSchema, "params"),
  habitController.createHabitHistory,
);

togleHabitRoutes.delete(
  "/",
  requireLogAuth,
  validate(habitIdParamsSchema, "params"),
  habitController.deleteHabitHistory,
);
