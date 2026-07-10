/**
 * Synchronization service.
 *
 * Updates the chatbot knowledge base
 * after document additions or deletions.
 */

const CHATBOT_API_URL =
    "http://localhost:8000";

async function triggerSynchronization() {

    try {

        const response =
            await fetch(
                `${CHATBOT_API_URL}/sync`,
                {
                    method: "POST"
                }
            );

        if (!response.ok) {

            throw new Error(
                "Failed to synchronize knowledge base."
            );

        }

        return await response.json();

    } catch (error) {

        console.error(
            "[ERROR] Failed to synchronize knowledge base.",
            error
        );

        throw error;

    }

}

export {
    triggerSynchronization
};