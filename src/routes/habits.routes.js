import express from "express";
import { z } from "zod";

import * as habitController from "#controllers/habits.controller.js";
import { requireLogAuth, validate } from "#middlewares";
//B0 상수 사용
import { MAX_HABIT_COUNT } from "#services/habits.service.js";

export const habitRoutes = express.Router();
export const togleHabitRoutes = express.Router({ mergeParams: true });

// 1개의 logId -> 최대 30개의 습관
const querySchema = z.object({
  page: z.coerce.number().min(1).max(6).default(1),
  limit: z.coerce.number().min(1).max(30).default(6),
});

// logId 파라미터 검증 (주간 습관기록표 조회용 - 상세페이지에서 비로그인으로도 조회 가능해야 함)
const logIdParamsSchema = z.object({
  logId: z.coerce.number().int().positive(),
});

// habitId 파라미터 검증 (습관 체크 생성 / 삭제 공통)
const habitIdParamsSchema = z.object({
  habitId: z.coerce.number().int().positive(),
});

// 습관 이름: 트림 후 비교 (대소문자 다르면 다른 습관으로 취급)
const habitNameSchema = z
  .string()
  .trim()
  .min(1, "습관 이름을 입력해주세요.")
  .max(30, "습관 이름은 최대 30자까지 입력할 수 있습니다.");

// 습관 목록 일괄 생성/수정/삭제 검증 스키마
const syncHabitsSchema = z
  .object({
    create: z
      .array(z.object({ name: habitNameSchema }))
      .max(MAX_HABIT_COUNT)
      .default([]),
    update: z
      .array(
        z.object({
          id: z.coerce.number().int().positive(),
          name: habitNameSchema,
        }),
      )
      .max(MAX_HABIT_COUNT)
      .default([]),
    delete: z
      .array(z.coerce.number().int().positive())
      .max(MAX_HABIT_COUNT)
      .default([]),
  })
  .superRefine((data, ctx) => {
    // create + update 안에서 이름이 서로 중복되면 DB까지 안 가고 바로 400
    const names = [
      ...data.create.map((item) => item.name),
      ...data.update.map((item) => item.name),
    ];
    const seen = new Set();

    names.forEach((name) => {
      if (seen.has(name)) {
        ctx.addIssue({
          code: "custom",
          message: `요청 안에 중복된 습관 이름이 있습니다: ${name}`,
          path: ["name"],
        });
      }
      seen.add(name);
    });
  });

habitRoutes.get(
  "/me",
  requireLogAuth,
  validate(querySchema, "query"),
  habitController.getHabits,
);

habitRoutes.get(
  "/:logId/weekly",
  validate(logIdParamsSchema, "params"),
  habitController.getHabitsWeekly,
);
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

// 습관 목록 일괄 저장 (생성/수정/삭제 한 번에)
habitRoutes.put(
  "/me",
  requireLogAuth,
  validate(syncHabitsSchema, "body"),
  habitController.syncHabits,
);
