/**
 * Chat module.
 *
 * Handles user interactions with
 * the LKB chatbot.
 */

function initializeChat() {

    const sendButton =
        document.getElementById(
            "send-button"
        );

    const input =
        document.getElementById(
            "chat-input"
        );

    if (!sendButton || !input) {
        return;
    }

    sendButton.addEventListener(
        "click",
        sendMessage
    );

    input.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                sendMessage();

            }

        }
    );

    const quickQuestion =
        sessionStorage.getItem(
            "quickQuestion"
        );

    if (quickQuestion) {

        input.value =
            quickQuestion;

        sessionStorage.removeItem(
            "quickQuestion"
        );

        sendMessage();

    }

}

async function sendMessage() {

    const input =
        document.getElementById(
            "chat-input"
        );

    const welcome =
        document.getElementById(
            "chat-welcome"
        );

    const conversation =
        document.getElementById(
            "chat-conversation"
        );

    const question =
        input.value.trim();

    if (!question) {
        return;
    }

    welcome.classList.add(
        "hidden"
    );

    conversation.classList.remove(
        "hidden"
    );

    displayUserMessage(question);

    input.value = "";

    try {

        const response =
            await fetch(
                "/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        question
                    })
                }
            );

        if (!response.ok) {

            throw new Error(
                "Failed to retrieve chatbot response."
            );

        }

        const data =
            await response.json();

        displayAssistantMessage(
            data.answer,
            data.sources
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to send message.",
            error
        );

        displayAssistantMessage(
            "An error occurred while communicating with the chatbot.",
            []
        );

    }

}

function displayUserMessage(message) {

    const conversation =
        document.getElementById(
            "chat-conversation"
        );

    const bubble =
        document.createElement(
            "div"
        );

    bubble.className =
        "max-w-3xl ml-auto mb-4 bg-[#2E5CB8] text-white rounded-2xl px-5 py-4";

    bubble.innerHTML = `
        <div class="text-xs uppercase font-semibold opacity-80 mb-2">
            You
        </div>

        <div>
            ${message}
        </div>
    `;

    conversation.appendChild(
        bubble
    );

    conversation.scrollTop =
        conversation.scrollHeight;

}

function displayAssistantMessage(
    answer,
    sources = []
) {

    const conversation =
        document.getElementById(
            "chat-conversation"
        );

    const bubble =
        document.createElement(
            "div"
        );

    let sourcesHtml = "";

    if (sources.length > 0) {

        sourcesHtml = `
            <div class="mt-4 pt-4 border-t border-stone-200">

                <div class="text-xs uppercase font-semibold text-stone-500 mb-2">
                    Sources
                </div>

                <div class="flex flex-wrap gap-2">

                    ${sources.map(source => `
                        <span class="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-xs">
                            ${source.source}
                        </span>
                    `).join("")}

                </div>

            </div>
        `;
    }

    bubble.className =
        "max-w-3xl mr-auto mb-4 bg-white border border-stone-200 rounded-2xl px-5 py-4 shadow-sm";

    bubble.innerHTML = `
        <div class="text-xs uppercase font-semibold text-stone-500 mb-2">
            Assistant
        </div>

        <div class="text-stone-700 whitespace-pre-wrap">
            ${answer}
        </div>

        ${sourcesHtml}
    `;

    conversation.appendChild(
        bubble
    );

    conversation.scrollTop =
        conversation.scrollHeight;

}