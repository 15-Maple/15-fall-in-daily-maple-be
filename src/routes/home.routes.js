import express from "express";

import * as homeController from "#controllers/home.controller.js";

export const homeRoutes = express.Router();

homeRoutes.get("/logs", homeController.getHomeLogs);
