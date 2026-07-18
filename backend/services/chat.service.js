/**
 * Chat service.
 *
 * Communicates with the RAG chatbot,
 * manages conversation persistence
 * and retrieves stored conversations.
 */

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

import {
    fileURLToPath
} from "url";

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const CHATBOT_API_URL =
    "http://localhost:8000";

const CONVERSATIONS_PATH =
    path.join(
        __dirname,
        "../data/conversations"
    );

async function sendMessage(
    question,
    conversationId
) {

    try {

        let messages = [];

        if (conversationId) {

            const conversation =
                await getConversation(
                    conversationId
                );

            messages =
                conversation.messages;

        }

        const response = await fetch(
            `${CHATBOT_API_URL}/ask`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    question,
                    conversationId,
                    messages
                }),
            }
        );

        if (!response.ok) {

            throw new Error(
                `Chatbot API returned status ${response.status}`
            );

        }

        const chatbotResponse =
            await response.json();

        if (!conversationId) {

            const conversation =
                await createConversation(
                    question,
                    chatbotResponse
                );

            return {
                conversationId:
                    conversation.id,

                answer:
                    chatbotResponse.answer,

                sources:
                    chatbotResponse.sources
            };

        }

        await appendMessages(
            conversationId,
            question,
            chatbotResponse
        );

        return {
            conversationId,
            answer:
                chatbotResponse.answer,

            sources:
                chatbotResponse.sources
        };

    } catch (error) {

        console.error(
            "[ERROR] Failed to communicate with chatbot API.",
            error
        );

        throw error;

    }

}

async function createConversation(
    question,
    chatbotResponse
) {

    const now =
        new Date().toISOString();

    const conversation = {

        id:
            crypto.randomUUID(),

        title:
            question
                .trim()
                .replace(/\s+/g, " ")
                .slice(0, 80),

        createdAt:
            now,

        updatedAt:
            now,

        messages: [

            {
                role:
                    "user",

                content:
                    question
            },

            {
                role:
                    "assistant",

                content:
                    chatbotResponse.answer,

                sources:
                    chatbotResponse.sources
            }

        ]

    };
    
    const filePath =
        path.join(
            CONVERSATIONS_PATH,
            `${conversation.id}.json`
        );

    await fs.writeFile(
        filePath,
        JSON.stringify(
            conversation,
            null,
            4
        ),
        "utf-8"
    );

    return conversation;

}

async function appendMessages(
    conversationId,
    question,
    chatbotResponse
) {

    const conversation =
        await getConversation(
            conversationId
        );

    conversation.updatedAt =
        new Date().toISOString();

    conversation.messages.push(
        {
            role:
                "user",

            content:
                question
        }
    );

    conversation.messages.push(
        {
            role:
                "assistant",

            content:
                chatbotResponse.answer,

            sources:
                chatbotResponse.sources
        }
    );

    const filePath =
        path.join(
            CONVERSATIONS_PATH,
            `${conversationId}.json`
        );

    await fs.writeFile(
        filePath,
        JSON.stringify(
            conversation,
            null,
            4
        ),
        "utf-8"
    );

}

async function getConversations() {

    try {

        const entries =
            await fs.readdir(
                CONVERSATIONS_PATH,
                {
                    withFileTypes: true
                }
            );

        const conversations =
            await Promise.all(

                entries
                    .filter(
                        entry =>
                            entry.isFile() &&
                            path.extname(
                                entry.name
                            ) === ".json"
                    )
                    .map(
                        async entry => {

                            const filePath =
                                path.join(
                                    CONVERSATIONS_PATH,
                                    entry.name
                                );

                            const content =
                                await fs.readFile(
                                    filePath,
                                    "utf-8"
                                );

                            const conversation =
                                JSON.parse(
                                    content
                                );

                            return {

                                id:
                                    conversation.id,

                                title:
                                    conversation.title,

                                createdAt:
                                    conversation.createdAt,

                                updatedAt:
                                    conversation.updatedAt

                            };

                        }
                    )

            );

        conversations.sort(
            (
                first,
                second
            ) =>
                new Date(
                    second.updatedAt
                ) -
                new Date(
                    first.updatedAt
                )
        );

        return conversations;

    } catch (error) {

        console.error(
            "[ERROR] Failed to retrieve conversations.",
            error
        );

        return [];

    }

}

async function getConversation(
    conversationId
) {

    const filePath =
        path.join(
            CONVERSATIONS_PATH,
            `${conversationId}.json`
        );

    const content =
        await fs.readFile(
            filePath,
            "utf-8"
        );

    return JSON.parse(
        content
    );

}

async function renameConversation(
    conversationId,
    title
) {

    const conversation =
        await getConversation(
            conversationId
        );

    conversation.title =
        title
            .trim()
            .replace(/\s+/g, " ")
            .slice(0, 80);

    const filePath =
        path.join(
            CONVERSATIONS_PATH,
            `${conversationId}.json`
        );

    await fs.writeFile(
        filePath,
        JSON.stringify(
            conversation,
            null,
            4
        ),
        "utf-8"
    );

}

async function deleteConversation(
    conversationId
) {

    const filePath =
        path.join(
            CONVERSATIONS_PATH,
            `${conversationId}.json`
        );

    await fs.unlink(
        filePath
    );

}

export {
    sendMessage,
    getConversations,
    getConversation,
    renameConversation,
    deleteConversation
};