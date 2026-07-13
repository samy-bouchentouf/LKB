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
        "max-w-5xl ml-auto mb-4 bg-[#2E5CB8] text-white rounded-2xl px-5 py-4";

    bubble.innerHTML = `
        <div class="text-xl font-bold mb-3">
            YOU
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

    bubble.className =
        "max-w-5xl mr-auto mb-4 bg-white border border-stone-200 rounded-2xl px-5 py-4 shadow-sm";

    const formattedAnswer =
        marked.parse(answer);

    let sourcesHtml = "";

    if (sources.length > 0) {

        const categoryLabels = {
            publications: "Publications",
            components: "Components",
            incidents: "Incidents",
            diagrams: "Diagrams"
        };

        sourcesHtml = `
            <div class="mt-4 pt-4 border-t border-stone-200">

                <div class="text-xs uppercase font-semibold text-stone-500 mb-2">
                    Sources
                </div>

                <div class="flex flex-wrap gap-2">

                    ${sources.map(source => {

                        const category =
                            categoryLabels[source.category]
                            || source.category;

                        return `
                            <span class="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-xs">
                                [${category}] ${source.source}
                            </span>
                        `;

                    }).join("")}

                </div>

            </div>
        `;
    }

    bubble.innerHTML = `
        <div class="flex items-center justify-between mb-3">

            <div class="text-xl font-bold text-[#2E5CB8]">
                LKB BOT
            </div>

            <button
                class="copy-button text-2xl text-stone-400 hover:text-[#2E5CB8] transition-colors"
                title="Copy response"
            >
                ⧉
            </button>

        </div>

        <div class="text-stone-700 chat-answer">
            ${formattedAnswer}
        </div>

        ${sourcesHtml}
    `;

    conversation.appendChild(
        bubble
    );

    const copyButton =
        bubble.querySelector(
            ".copy-button"
        );

    copyButton.addEventListener(
        "click",
        async () => {

            await navigator.clipboard.writeText(
                answer
            );

            copyButton.textContent =
                "✓";

            copyButton.classList.remove(
                "text-stone-400"
            );

            copyButton.classList.add(
                "text-[#2E5CB8]"
            );

            setTimeout(
                () => {

                    copyButton.textContent =
                        "⧉";

                    copyButton.classList.remove(
                        "text-[#2E5CB8]"
                    );

                    copyButton.classList.add(
                        "text-stone-400"
                    );

                },
                2000
            );
        }
    );

    conversation.scrollTop =
        conversation.scrollHeight;
}