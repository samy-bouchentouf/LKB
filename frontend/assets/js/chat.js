/**
 * Chat module.
 *
 * Handles user interactions,
 * conversation persistence
 * and sidebar management.
 */

/* ============================================================
 * 0.GLOBAL STATE
 * ========================================================== */

let currentConversationId =
    null;

let sidebarOpen =
    true;

let conversationSearch =
    "";

function renderMath(
    element
) {

    if (
        typeof renderMathInElement
        !== "function"
    ) {

        return;

    }

    renderMathInElement(
        element,
        {
            delimiters: [
                {
                    left: "$$",
                    right: "$$",
                    display: true
                },
                {
                    left: "$",
                    right: "$",
                    display: false
                },
                {
                    left: "\\(",
                    right: "\\)",
                    display: false
                },
                {
                    left: "\\[",
                    right: "\\]",
                    display: true
                }
            ],
            throwOnError: false
        }
    );

}

/* ============================================================
 * 1.LAYOUT MANAGEMENT
 * ========================================================== */

function moveComposerToWelcome() {

    const composer =
        document.getElementById(
            "chat-composer"
        );

    const anchor =
        document.getElementById(
            "welcome-composer-anchor"
        );

    if (
        !composer ||
        !anchor
    ) {
        return;
    }

    anchor.appendChild(
        composer
    );

}

function moveComposerToConversation() {

    const composer =
        document.getElementById(
            "chat-composer"
        );

    const conversation =
        document.getElementById(
            "chat-conversation"
        );

    if (
        !composer ||
        !conversation
    ) {
        return;
    }

    conversation.after(
        composer
    );

}

/* ============================================================
 * 2.INITIALIZATION
 * ========================================================== */

function initializeChat() {

    const sendButton =
        document.getElementById(
            "send-button"
        );

    const input =
        document.getElementById(
            "chat-input"
        );

    const sidebarToggle =
        document.getElementById(
            "sidebar-toggle"
        );

    if (!sendButton || !input) {
        return;
    }

    document.getElementById(
        "chat-shell"
    ).style.visibility =
        "hidden";

    sendButton.addEventListener(
        "click",
        sendMessage
    );

    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                sendMessage();

            }

        }
    );

    sidebarToggle?.addEventListener(
        "click",
        toggleSidebar
    );

    document.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(
                    ".conversation-menu"
                )
                .forEach(
                    menu =>
                        menu.classList.add(
                            "hidden"
                        )
                );

        }
    );

    const toggle =
        document.getElementById(
            "sidebar-toggle"
        );

    const sidebar =
        document.getElementById(
            "chat-sidebar"
        );

    if (sidebar) {

        sidebar.style.width =
            "288px";

        sidebar.style.opacity =
            "1";

        sidebar.style.transition =
            "width 250ms ease, opacity 250ms ease";

        sidebar.style.overflow =
            "hidden";

    }

    if (toggle) {

        toggle.innerHTML = "←";

        toggle.style.left = "287px";

        toggle.style.transition =
            "left 250ms ease";

    }

    const savedConversationId =
        sessionStorage.getItem(
            "currentConversationId"
        );

    if (
        savedConversationId &&
        !sessionStorage.getItem(
            "quickQuestion"
        )
    ) {

        openConversation(
            savedConversationId
        );

    } else {

        moveComposerToWelcome();

        loadConversations();

        document.getElementById(
            "chat-shell"
        ).style.visibility =
            "visible";

    }

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

/* ============================================================
 * 3.CONVERSATION MANAGEMENT
 * ========================================================== */

async function loadConversations() {

    try {

        const response =
            await fetch(
                "/api/chat/conversations"
            );

        if (!response.ok) {

            throw new Error(
                "Failed to retrieve conversations."
            );

        }

        const conversations =
            await response.json();

        renderConversations(
            conversations
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to load conversations.",
            error
        );

    }

}

function renderConversations(
    conversations
) {

    const container =
        document.getElementById(
            "conversations-list"
        );

    if (!container) {
        return;
    }

    const newChatSelected =
        currentConversationId ===
        null;

    container.innerHTML = `
        <div
            id="new-chat-button"
            class="
                flex items-center justify-between
                px-3 py-2
                rounded-xl
                cursor-pointer
                text-base
                mb-3
                ${
                    newChatSelected
                        ? "bg-[#DFF1FF] text-[#075985] font-medium transition-colors"
                        : "text-stone-500 hover:bg-[#F5F5F4] hover:text-stone-800 transition-colors"
                }
            "
        >
            <span>New Chat</span>

            <span
                class="
                    w-6 h-6
                    flex items-center justify-center
                    rounded-md
                    border border-current
                "
            >
                <svg
                    class="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        d="M12 3V21M3 12H21"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                    />
                </svg>
            </span>
        </div>

        <div class="mb-3">
            <input
                id="conversation-search"
                type="text"
                placeholder="Search conversations..."
                value="${conversationSearch}"
                class="
                    w-full
                    px-3 py-2
                    text-base
                    bg-stone-50
                    border border-stone-200
                    rounded-xl
                    outline-none
                    focus:border-sky-300
                    focus:ring-2
                    focus:ring-sky-100
                "
            >
        </div>
    `;

    document
        .getElementById(
            "new-chat-button"
        )
        ?.addEventListener(
            "click",
            startNewChat
        );

    document
        .getElementById(
            "conversation-search"
        )
        ?.addEventListener(
            "input",
            event => {

                conversationSearch =
                    event.target.value
                        .toLowerCase();

                document
                    .querySelectorAll(
                        ".conversation-item"
                    )
                    .forEach(
                        item => {

                            item.style.display =
                                item.dataset.title.includes(
                                    conversationSearch
                                )
                                    ? ""
                                    : "none";

                        }
                    );

            }
        );

    conversations.forEach(
        conversation => {

            const isSelected =
                currentConversationId ===
                conversation.id;

            const item =
                document.createElement(
                    "div"
                );

            item.classList.add(
                "conversation-item"
            );

            item.dataset.title =
                (
                    conversation.title ||
                    ""
                ).toLowerCase();

            if (
                conversationSearch &&
                !item.dataset.title.includes(
                    conversationSearch.toLowerCase()
                )
            ) {

                item.style.display =
                    "none";

            }

            item.className =
                isSelected
                    ? "conversation-item group relative flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer bg-[#DFF1FF] text-[#075985] font-medium transition-colors mb-1"
                    : "conversation-item group relative flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-stone-500 hover:bg-[#F5F5F4] hover:text-stone-800 transition-colors mb-1";

            const title =
                document.createElement(
                    "div"
                );

            title.className =
                "flex-1 truncate text-base";

            title.textContent =
                conversation.title;

            title.addEventListener(
                "click",
                () =>
                    openConversation(
                        conversation.id
                    )
            );

            const menuButton =
                document.createElement(
                    "button"
                );

            menuButton.className =
                "opacity-0 group-hover:opacity-100 px-2 text-stone-500 hover:text-stone-900";

            menuButton.textContent =
                "⋮";

            const menu =
                document.createElement(
                    "div"
                );

            menu.className =
                "hidden absolute right-2 top-10 z-10 bg-white border border-stone-200 rounded-lg shadow-md min-w-[120px]";

            menu.innerHTML = `
                <button
                    class="rename-conversation w-full text-left px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100"
                >
                    Rename
                </button>

                <button
                    class="delete-conversation w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                    Delete
                </button>
            `;

            menuButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const wasHidden =
                        menu.classList.contains(
                            "hidden"
                        );

                    document
                        .querySelectorAll(
                            ".conversation-menu"
                        )
                        .forEach(
                            element =>
                                element.classList.add(
                                    "hidden"
                                )
                        );

                    if (wasHidden) {

                        menu.classList.remove(
                            "hidden"
                        );

                    }

                }
            );

            menu.classList.add(
                "conversation-menu"
            );

            menu.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                }
            );

            menu
                .querySelector(
                    ".rename-conversation"
                )
                .addEventListener(
                    "click",
                    () =>
                        renameConversation(
                            conversation.id
                        )
                );

            menu
                .querySelector(
                    ".delete-conversation"
                )
                .addEventListener(
                    "click",
                    () =>
                        deleteConversation(
                            conversation.id
                        )
                );

            item.appendChild(
                title
            );

            item.appendChild(
                menuButton
            );

            item.appendChild(
                menu
            );

            container.appendChild(
                item
            );

        }
    );

}

async function openConversation(
    conversationId
) {

    try {

        const response =
            await fetch(
                `/api/chat/conversations/${conversationId}`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to retrieve conversation."
            );

        }

        const conversation =
            await response.json();

        currentConversationId =
            conversation.id;

        sessionStorage.setItem(
            "currentConversationId",
            conversation.id
        );

        await loadConversations();

        const welcome =
            document.getElementById(
                "chat-welcome"
            );

        const conversationContainer =
            document.getElementById(
                "chat-conversation"
            );

        welcome.classList.add(
            "hidden"
        );

        conversationContainer.classList.remove(
            "hidden"
        );

        moveComposerToConversation();

        conversationContainer.innerHTML =
            "";

        renderConversationMessages(
            conversation.messages
        );

        document.getElementById(
            "chat-shell"
        ).style.visibility =
            "visible";

    } catch (error) {

        console.error(
            "[ERROR] Failed to open conversation.",
            error
        );

        document.getElementById(
            "chat-shell"
        ).style.visibility =
            "visible";

    }

}

async function renameConversation(
    conversationId
) {

    const newTitle =
        prompt(
            "Enter a new conversation title:"
        );

    if (!newTitle?.trim()) {
        return;
    }

    try {

        const response =
            await fetch(
                `/api/chat/conversations/${conversationId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(
                        {
                            title:
                                newTitle.trim()
                        }
                    )
                }
            );

        if (!response.ok) {

            throw new Error(
                "Failed to rename conversation."
            );

        }

        await loadConversations();

    } catch (error) {

        console.error(
            "[ERROR] Failed to rename conversation.",
            error
        );

    }

}

async function deleteConversation(
    conversationId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this conversation?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `/api/chat/conversations/${conversationId}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            throw new Error(
                "Failed to delete conversation."
            );

        }

        if (
            currentConversationId ===
            conversationId
        ) {

            startNewChat();

        } else {

        await loadConversations();

        }

    } catch (error) {

        console.error(
            "[ERROR] Failed to delete conversation.",
            error
        );

    }

}

function startNewChat() {

    currentConversationId =
        null;

    sessionStorage.removeItem(
        "currentConversationId"
    );

    const welcome =
        document.getElementById(
            "chat-welcome"
        );

    const conversation =
        document.getElementById(
            "chat-conversation"
        );

    const input =
        document.getElementById(
            "chat-input"
        );

    conversation.innerHTML =
        "";

    conversation.classList.add(
        "hidden"
    );

    welcome.classList.remove(
        "hidden"
    );

    moveComposerToWelcome();

    input.value = "";

    loadConversations();

    if (!sidebarOpen) {

        expandSidebar();

    }

}

/* ============================================================
 * 4.SIDEBAR MANAGEMENT
 * ========================================================== */

function collapseSidebar() {

    const sidebar =
        document.getElementById(
            "chat-sidebar"
        );

    const toggle =
        document.getElementById(
            "sidebar-toggle"
        );

    sidebar.style.transition =
        "width 250ms ease, opacity 250ms ease";

    sidebar.style.width =
        "0px";

    sidebar.style.opacity =
        "0";

    sidebar.style.overflow =
        "hidden";

    toggle.innerHTML = "→";

    toggle.style.left =
        "0px";

    sidebarOpen =
        false;

}

function expandSidebar() {

    const sidebar =
        document.getElementById(
            "chat-sidebar"
        );

    const toggle =
        document.getElementById(
            "sidebar-toggle"
        );

    sidebar.style.transition =
        "width 250ms ease, opacity 250ms ease";

    sidebar.style.width =
        "288px";

    sidebar.style.opacity =
        "1";

    sidebar.style.overflow =
        "hidden";

    toggle.innerHTML = "←";

    toggle.style.left =
        "287px";

    sidebarOpen =
        true;

}

function toggleSidebar() {

    if (sidebarOpen) {

        collapseSidebar();

        return;

    }

    expandSidebar();

}

/* ============================================================
 * 5.MESSAGE PROCESSING
 * ========================================================== */

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

    moveComposerToConversation();

    if (sidebarOpen) {

        collapseSidebar();

    }

    displayUserMessage(
        question
    );

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

                    body: JSON.stringify(
                        {
                            question,
                            conversationId:
                                currentConversationId
                        }
                    )
                }
            );

        if (!response.ok) {

            throw new Error(
                "Failed to retrieve chatbot response."
            );

        }

        const data =
            await response.json();

        currentConversationId =
            data.conversationId;

        sessionStorage.setItem(
            "currentConversationId",
            data.conversationId
        );

        clearInterval(
            loading.interval
        );

        updateAssistantMessage(
            loading,
            data.answer,
            data.sources
        );

        await loadConversations();

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

/* ============================================================
 * 6.MESSAGE RENDERING
 * ========================================================== */

function renderConversationMessages(
    messages
) {

    messages.forEach(
        message => {

            if (
                message.role ===
                "user"
            ) {

                displayUserMessage(
                    message.content
                );

                return;

            }

            if (
                message.role ===
                "assistant"
            ) {

                displayAssistantMessage(
                    message.content,
                    message.sources || []
                );

            }

        }
    );

}

function displayUserMessage(
    message
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
        "max-w-[50%] ml-auto mb-4 bg-[#2E5CB8] text-white rounded-2xl px-5 py-4";

    bubble.innerHTML = `
        <div class="flex items-center justify-between mb-3">

            <div class="text-xl font-bold">
                YOU
            </div>

            <button
                class="copy-button text-2xl text-white/70 hover:text-white transition-colors -mt-2"
                title="Copy message"
            >
                ⧉
            </button>

        </div>

        <div class="chat-message">
            ${message}
        </div>
    `;

    conversation.appendChild(
        bubble
    );

    renderMath(
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
                message
            );

            copyButton.textContent =
                "✓";

            setTimeout(
                () => {

                    copyButton.textContent =
                        "⧉";

                },
                2000
            );

        }
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

    bubble.className =
        "max-w-7xl mx-auto mb-4 bg-white border border-stone-200 rounded-2xl px-5 py-4 shadow-sm";

    bubble.innerHTML = `
        <div class="flex items-center justify-between mb-3">

            <div class="text-xl font-bold text-[#1E3A8A]">
                LKB BOT
            </div>

            <button
                class="copy-button text-2xl text-stone-400 hover:text-[#1E3A8A] transition-colors -mt-2"
                title="Copy response"
            >
                ⧉
            </button>

        </div>

        <div class="text-stone-700 chat-answer">
            ${marked.parse(answer)}
            ${sourcesHtml}
        </div>
    `;

    conversation.appendChild(
        bubble
    );

    renderMath(
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
                bubble
                    .querySelector(
                        ".chat-answer"
                    )
                    .innerText
            );

            copyButton.textContent =
                "✓";

            setTimeout(
                () => {

                    copyButton.textContent =
                        "⧉";

                },
                2000
            );

        }
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
            class="copy-button text-2xl text-stone-400 hover:text-[#1E3A8A] transition-colors -mt-2"
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

                renderMath(
                    loading.content
                );
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
                loading.bubble
                    .querySelector(
                        ".chat-answer"
                    )
                    .innerText
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