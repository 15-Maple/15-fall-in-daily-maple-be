import express from "express";
import { z } from "zod";

import * as focusController from "#controllers/focus-records.controller.js";
import { validate } from "#middlewares";

export const focusRecordRoutes = express.Router();

const FOCUS_STATUSES = ["IN_PROGRESS", "COMPLETED", "CANCELED"];

const createSchema = z.object({
  logId: z
    .number({ error: "로그 ID는 숫자로 입력해 주세요" })
    .int("로그 ID는 정수여야 합니다")
    .positive("로그 ID는 1 이상의 양수여야 합니다"),

  targetSeconds: z
    .number({ error: "목표 시간(초)은 숫자로 입력해 주세요" })
    .int("목표 시간은 정수여야 합니다")
    .min(1, "목표 시간은 최소 1초 이상이어야 합니다"),

  status: z.enum(FOCUS_STATUSES, { error: "허용되지 않은 상태값입니다" }),
});

const updateSchema = createSchema.partial();

// 목록 조회시 query가 있다면 querySchema 만들어서 검증
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  keyword: z.string().default(""),
});
// query 검증이 필요한 경우:
// focusRecordRoutes.get("/", validate(querySchema, "query"), focusController.getRecords);
//
// 컨트롤러에서는 검증된 값을 사용:
// const { page, limit, keyword } = res.locals.validated.query;

// GET /api/focus-records (집중 기록 전체 목록 조회)
focusRecordRoutes.get("/", focusController.getRecords);

// POST /api/focus-records (집중 기록 생성)
focusRecordRoutes.post(
  "/",
  validate(createSchema),
  focusController.createRecord,
);

// PATCH /api/focus-records (집중 기록 수정)
focusRecordRoutes.patch(
  "/:id",
  validate(updateSchema),
  focusController.updateRecord,
);
