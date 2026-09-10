import express from "express";
import { z } from "zod";

import * as focusController from "#controllers/focus.controller.js";
import { validate } from "#middlewares";

export const focusRoutes = express.Router();

const createSchema = z.object({
  logId: z
    .number({ error: "로그 ID는 숫자로 입력해 주세요" })
    .int("로그 ID는 정수여야 합니다")
    .positive("로그 ID는 1 이상의 양수여야 합니다"),

  targetSeconds: z
    .number({ error: "목표 시간(초)은 숫자로 입력해 주세요" })
    .int("목표 시간은 정수여야 합니다")
    .min(1, "목표 시간은 최소 1초 이상이어야 합니다"),
});

const finishSchema = z.object({
  logId: z
    .number({ error: "로그 ID는 숫자로 입력해 주세요" })
    .int("로그 ID는 정수여야 합니다")
    .positive("로그 ID는 1 이상의 양수여야 합니다"),
});

// GET /api/focus (집중 기록 전체 목록 조회)
focusRoutes.get("/", focusController.getRecords);

// POST /api/focus (집중 기록 생성)
focusRoutes.post("/", validate(createSchema), focusController.createRecord);

// POST /focus/finish (집중 종료)
focusRoutes.post(
  "/finish",
  validate(finishSchema),
  focusController.finishFocusSession,
);

// GET /api/focus (집중 기록 조회)
focusRoutes.get("/:logId", focusController.getRecord);

// DELETE /api/focus (집중 기록 삭제)
focusRoutes.delete("/:logId", focusController.deleteRecord);
