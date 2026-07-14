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

    const loading =
        displayLoadingMessage();

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

        clearInterval(
            loading.interval
        );

        updateAssistantMessage(
            loading,
            data.answer,
            data.sources
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to send message.",
            error
        );

        clearInterval(
            loading.interval
        );

        updateAssistantMessage(
            loading,
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
        "max-w-[50%] ml-auto mb-4 bg-[#2E5CB8] text-white rounded-2xl px-5 py-4";

    bubble.innerHTML = `
        <div class="text-xl font-bold mb-3">
            YOU
        </div>

        <div class="chat-message">
            ${message}
        </div>
    `;

    conversation.appendChild(
        bubble
    );

    conversation.scrollTop =
        conversation.scrollHeight;

}

function displayLoadingMessage() {

    const conversation =
        document.getElementById(
            "chat-conversation"
        );

    const bubble =
        document.createElement(
            "div"
        );

    bubble.className =
        "max-w-7xl mx-auto mb-4 bg-white border border-stone-200 rounded-2xl px-5 py-4 shadow-sm";

    bubble.innerHTML = `
        <div class="flex items-center justify-between mb-3">

            <div class="text-xl font-bold text-[#1E3A8A]">
                LKB BOT
            </div>

            <button
                class="copy-button text-2xl text-stone-300"
                title="Copy response"
                disabled
            >
                ⧉
            </button>

        </div>

        <div
            class="loading-content text-2xl"
        >
            ● ● ●
        </div>
    `;

    conversation.appendChild(
        bubble
    );

    conversation.scrollTop =
        conversation.scrollHeight;

    const content =
        bubble.querySelector(
            ".loading-content"
        );

    let step = 0;

    const interval =
        setInterval(() => {

            const frames = [
                `
                    <span class="text-[#2E5CB8]">●</span>
                    <span class="text-stone-300">●</span>
                    <span class="text-stone-300">●</span>
                `,
                `
                    <span class="text-stone-300">●</span>
                    <span class="text-[#2E5CB8]">●</span>
                    <span class="text-stone-300">●</span>
                `,
                `
                    <span class="text-stone-300">●</span>
                    <span class="text-stone-300">●</span>
                    <span class="text-[#2E5CB8]">●</span>
                `
            ];

            content.innerHTML =
                frames[step];

            step =
                (step + 1)
                % frames.length;

        }, 300);

    return {
        bubble,
        content,
        interval
    };
}

function updateAssistantMessage(
    loading,
    answer,
    sources = []
) {

    const conversation =
        document.getElementById(
            "chat-conversation"
        );

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

                <div class="flex flex-col gap-2">

                    ${sources.map(source => {

                        const category =
                            categoryLabels[source.category]
                            || source.category;

                        return `
                            <a
                                href="${source.url}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="block px-3 py-2 bg-sky-50 text-sky-700 rounded-xl text-sm hover:bg-sky-100 transition-colors"
                            >
                                [${category}] ${source.source}
                            </a>
                        `;

                    }).join("")}

                </div>

            </div>
        `;
    }

    const copyButton =
        loading.bubble.querySelector(
            ".copy-button"
        );

    copyButton.outerHTML = `
        <button
            class="copy-button text-2xl text-stone-400 hover:text-[#1E3A8A] transition-colors"
            title="Copy response"
        >
            ⧉
        </button>
    `;

    loading.content.className =
        "loading-content text-stone-700 chat-answer";

    loading.content.innerHTML = "";

    const words =
        answer.split(" ");

    let wordIndex = 0;

    const typingInterval =
        setInterval(() => {

            wordIndex += 2;

            const partialAnswer =
                words
                    .slice(
                        0,
                        wordIndex
                    )
                    .join(" ");

            loading.content.innerHTML =
                marked.parse(
                    partialAnswer
                );

            if (
                wordIndex >=
                words.length
            ) {

                clearInterval(
                    typingInterval
                );

                loading.content.innerHTML =
                    formattedAnswer +
                    sourcesHtml;
            }

        }, 50);

    const newCopyButton =
        loading.bubble.querySelector(
            ".copy-button"
        );

    newCopyButton.addEventListener(
        "click",
        async () => {

            await navigator.clipboard.writeText(
                loading.content.innerText
            );

            newCopyButton.textContent =
                "✓";

            newCopyButton.classList.remove(
                "text-stone-400"
            );

            newCopyButton.classList.add(
                "text-[#2E5CB8]"
            );

            setTimeout(
                () => {

                    newCopyButton.textContent =
                        "⧉";

                    newCopyButton.classList.remove(
                        "text-[#2E5CB8]"
                    );

                    newCopyButton.classList.add(
                        "text-stone-400"
                    );

                },
                2000
            );

        }
    );
}