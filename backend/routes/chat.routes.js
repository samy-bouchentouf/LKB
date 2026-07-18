/**
 * Chat routes.
 *
 * Defines API endpoints used to interact
 * with the chatbot and manage
 * conversations.
 */

import express from "express";

import {
    sendMessage,
    getConversations,
    getConversation,
    renameConversation,
    deleteConversation
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post(
    "/",
    sendMessage
);

router.get(
    "/conversations",
    getConversations
);

router.get(
    "/conversations/:id",
    getConversation
);

router.put(
    "/conversations/:id",
    renameConversation
);

router.delete(
    "/conversations/:id",
    deleteConversation
);

export default router;