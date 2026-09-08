import express from "express";

// import { HTTP_STATUS } from "#constants";
// import { BadRequestException } from "#errors";
import * as logController from "#controllers/logs.controller.js";

export const logRoutes = express.Router();

logRoutes.post("/", logController.createLog);
