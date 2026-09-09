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
      .min(2, "닉네임은 2글자 이상 필수입니다.")
      .max(12, "닉네임 글자수 초과입니다."),
    name: z
      .string()
      .trim()
      .min(2, "로그 이름은 2글자 이상 필수입니다.")
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
    password: z.string().min(1, "비밀번호는 필수입니다."),
    passwordConfirm: z.string().min(1, "비밀번호 확인은 필수입니다."),
  })
  .superRefine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
  });

// password 암호화 로직 추가해야 한다.

// POST /api/logs (로그 생성)
logRoutes.post("/", validate(createLogSchema), logController.createLog);
