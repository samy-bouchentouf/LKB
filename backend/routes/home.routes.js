/**
 * Home routes.
 *
 * Defines API endpoints used to retrieve
 * home page information.
 */

import express from "express";

import {
    getHomeStatistics
} from "../controllers/home.controller.js";

const router = express.Router();

router.get(
    "/stats",
    getHomeStatistics
);

export default router;