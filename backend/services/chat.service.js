/**
 * Chat service.
 *
 * Communicates with the RAG chatbot
 * and retrieves generated answers.
 */

const CHATBOT_API_URL =
    "http://localhost:8000";

async function askQuestion(question) {

    try {

        const response = await fetch(
            `${CHATBOT_API_URL}/ask`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    question
                }),
            }
        );

        if (!response.ok) {

            throw new Error(
                `Chatbot API returned status ${response.status}`
            );

        }

        const data =
            await response.json();

        return data;

    } catch (error) {

        console.error(
            "[ERROR] Failed to communicate with chatbot API.",
            error
        );

        throw error;

    }

}

export {
    askQuestion
};