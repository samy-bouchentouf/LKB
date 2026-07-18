/**
 * Chat controller.
 *
 * Handles chatbot requests and manages
 * conversation operations.
 */

import {
    sendMessage as sendMessageService,
    getConversations as getConversationsService,
    getConversation as getConversationService,
    renameConversation as renameConversationService,
    deleteConversation as deleteConversationService
} from "../services/chat.service.js";

async function sendMessage(req, res) {

    try {

        const {
            question,
            conversationId
        } = req.body;

        if (!question?.trim()) {

            return res.status(400).json({
                message: "Question is required."
            });

        }

        const response =
            await sendMessageService(
                question,
                conversationId
            );

        return res.status(200).json(
            response
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to process chat request.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to process chat request."
        });

    }

}

async function getConversations(req, res) {

    try {

        const conversations =
            await getConversationsService();

        return res.status(200).json(
            conversations
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to retrieve conversations.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to retrieve conversations."
        });

    }

}

async function getConversation(req, res) {

    try {

        const {
            id
        } = req.params;

        const conversation =
            await getConversationService(
                id
            );

        return res.status(200).json(
            conversation
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to retrieve conversation.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to retrieve conversation."
        });

    }

}

async function renameConversation(req, res) {

    try {

        const {
            id
        } = req.params;

        const {
            title
        } = req.body;

        if (!title?.trim()) {

            return res.status(400).json({
                message: "Title is required."
            });

        }

        await renameConversationService(
            id,
            title
        );

        return res.status(200).json({
            message:
                "Conversation renamed successfully."
        });

    } catch (error) {

        console.error(
            "[ERROR] Failed to rename conversation.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to rename conversation."
        });

    }

}

async function deleteConversation(req, res) {

    try {

        const {
            id
        } = req.params;

        await deleteConversationService(
            id
        );

        return res.status(200).json({
            message:
                "Conversation deleted successfully."
        });

    } catch (error) {

        console.error(
            "[ERROR] Failed to delete conversation.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to delete conversation."
        });

    }

}

export {
    sendMessage,
    getConversations,
    getConversation,
    renameConversation,
    deleteConversation
};