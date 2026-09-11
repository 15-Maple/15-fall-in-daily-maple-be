import express from "express";
import { z } from "zod";

import * as authController from "#controllers/auth.controller.js";
import { validate } from "#middlewares";

export const authRoutes = express.Router();

const verifySchema = z.object({
  logId: z.coerce
    .number({ error: "로그 ID는 숫자로 입력해 주세요" })
    .int("로그 ID는 정수여야 합니다")
    .positive("로그 ID는 1 이상의 양수여야 합니다"),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

// POST /api/auth/verify (비밀번호 검증 API)
authRoutes.post(
  "/verify",
  validate(verifySchema),
  authController.verifyLogPassword,
);
