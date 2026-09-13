import express from "express";
import { z } from "zod";

import * as focusController from "#controllers/focus.controller.js";
import { requireLogAuth, validate } from "#middlewares";

export const focusRoutes = express.Router();

const createSchema = z.object({
  targetSeconds: z
    .number({ error: "목표 시간(초)은 숫자로 입력해 주세요" })
    .int("목표 시간은 정수여야 합니다")
    .min(600, "목표 시간은 최소 10분 이상이어야 합니다."),
});

// POST /api/focus (집중 세션 생성)
focusRoutes.post(
  "/",
  requireLogAuth,
  validate(createSchema),
  focusController.createRecord,
);

// POST /focus/finish (집중 종료)
focusRoutes.post("/finish", requireLogAuth, focusController.finishFocusSession);

// GET /api/focus/me (집중 세션 조회): api 테스트용
focusRoutes.get("/me", requireLogAuth, focusController.getRecord);

// DELETE /api/focus/me (집중 세션 삭제): api 테스트용
focusRoutes.delete("/me", requireLogAuth, focusController.deleteRecord);
