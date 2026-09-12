import express from "express";
import { z } from "zod";

import * as habitController from "#controllers/habits.controller.js";
import { validate } from "#middlewares";

//{ mergeParams: true } :logId가 안으로 전달되지 않아서 넣음
export const habitRoutes = express.Router({ mergeParams: true });
export const togleHabitRoutes = express.Router({ mergeParams: true });

// 1개의 logId -> 최대 30개의 습관
const querySchema = z.object({
  page: z.coerce.number().min(1).max(6).default(1),
  limit: z.coerce.number().min(1).max(30).default(6),
});

// logId 파라미터 검증 (오늘의 습관 조회 / 주간 습관 조회 공통)
const logIdParamsSchema = z.object({
  logId: z.coerce.number().int().positive(),
});

// habitId 파라미터 검증 (습관 체크 생성 / 삭제 공통)
const habitIdParamsSchema = z.object({
  habitId: z.coerce.number().int().positive(),
});

// GET /api/{logId}/habits
habitRoutes.get(
  "/",
  validate(logIdParamsSchema, "params"),
  validate(querySchema, "query"),
  habitController.getHabits,
);

// GET /api/{logId}/habits/weekly
habitRoutes.get(
  "/weekly",
  validate(logIdParamsSchema, "params"),
  habitController.getHabitsWeekly,
);

togleHabitRoutes.post(
  "/",
  validate(habitIdParamsSchema, "params"),
  habitController.createHabitHistory,
);

togleHabitRoutes.delete(
  "/",
  validate(habitIdParamsSchema, "params"),
  habitController.deleteHabitHistory,
);
