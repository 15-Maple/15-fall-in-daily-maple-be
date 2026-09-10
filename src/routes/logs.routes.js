import express from "express";
import { z } from "zod";

import * as logController from "#controllers/logs.controller.js";
import { validate } from "#middlewares";

export const logRoutes = express.Router();

// 배경 허용값
const ALLOWED_BACKGROUNDS = [
  "bgGreen",
  "bgYellow",
  "bgBlue",
  "bgPink",
  "bgDesk",
  "bgWindow",
  "bgTile",
  "bgPlant",
];

export const createLogSchema = z
  .object({
    // const { nickname, name, description, background, password, passwordConfirm } = logData;
    nickname: z
      .string()
      .trim()
      .min(1, "닉네임은 필수입니다.")
      .max(12, "닉네임 글자수 초과입니다."),
    name: z
      .string()
      .trim()
      .min(1, "로그 이름은 필수입니다.")
      .max(20, "로그 이름 글자수 초과입니다."),
    description: z
      .string()
      .trim()
      .max(140, "소개 글자수 초과입니다.")
      .nullable()
      .optional()
      .transform((value) =>
        value === null || value === undefined || value === "" ? null : value,
      ),
    background: z
      .enum(ALLOWED_BACKGROUNDS, { error: "허용되지 않은 배경입니다." })
      .default("bgGreen"),
    password: z.string().optional(),
    passwordConfirm: z.string().optional(),
  })
  .superRefine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
  });

export const updateLogSchema = z
  .object({
    nickname: z
      .string()
      .trim()
      .min(1, "닉네임은 필수입니다.")
      .max(12, "닉네임 글자수 초과입니다."),

    name: z
      .string()
      .trim()
      .min(1, "로그 이름은  필수입니다.")
      .max(20, "로그 이름 글자수 초과입니다."),

    description: z
      .string()
      .trim()
      .max(140, "소개 글자수 초과입니다.")
      .nullable()
      .optional()
      .transform((value) =>
        value === null || value === undefined || value === "" ? null : value,
      ),
    background: z
      .enum(ALLOWED_BACKGROUNDS, { error: "허용되지 않은 배경입니다." })
      .default("bgGreen"),
    password: z.string(),
    passwordConfirm: z.string(),
  })
  .superRefine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
  });

const logIdSchema = z.object({
  logId: z.coerce.number().int().positive(),
});

// Get /api/logs/:logId (로그 하나 조회)
logRoutes.get("/:logId", logController.getLog);

// POST /api/logs (로그 생성)
logRoutes.post("/", validate(createLogSchema), logController.createLog);

// PATCH /api/logs/:logId (로그 수정)
logRoutes.patch(
  "/:logId",
  validate(logIdSchema, "params"),
  validate(updateLogSchema, "body"),
  logController.updateLog,
);
