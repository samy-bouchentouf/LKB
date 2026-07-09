/**
 * Chat routes.
 *
 * Defines API endpoints used to interact
 * with the chatbot.
 */

import express from "express";
import { handleChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", handleChat);

export default router;

