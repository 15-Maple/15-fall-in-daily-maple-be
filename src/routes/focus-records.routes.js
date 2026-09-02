import express from "express";

import * as focusController from "#controllers/focus-records.controller.js";

export const focusRecordRoutes = express.Router();

// GET /api/focus-records (집중 기록 전체 목록 조회)
focusRecordRoutes.get("/", focusController.getRecords);
