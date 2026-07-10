/**
 * Chat controller.
 *
 * Handles chatbot requests and returns
 * generated answers to the frontend.
 */

import {
    askQuestion as askQuestionService
} from "../services/chat.service.js";

async function askQuestion(req, res) {

    try {

        const { question } = req.body;

        if (!question?.trim()) {

            return res.status(400).json({
                message: "Question is required."
            });

        }

        const response =
            await askQuestionService(
                question
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

export {
    askQuestion
};