/**
 * Navigation module.
 *
 * Handles page loading and navigation
 * throughout the application.
 */

async function loadPage(pageName) {

    try {

        const container =
            document.getElementById("page-container");

        const response =
            await fetch(`pages/${pageName}.html`);

        if (!response.ok) {
            throw new Error(
                `Unable to load page: ${pageName}`
            );
        }

        const html =
            await response.text();

        container.innerHTML = html;

        updateNavigation(pageName);

        if (pageName === "home") {

            initializeHome();

        }

        if (pageName === "chat") {

            initializeChat();

        }

        if (pageName === "publications") {

            initializeDocuments(
                "publications"
            );

        }

        if (pageName === "components") {

            initializeDocuments(
                "components"
            );

        }

        if (pageName === "diagrams") {

            initializeDiagrams();

        }

    } catch (error) {

        console.error(error);

        document.getElementById(
            "page-container"
        ).innerHTML = `
            <div class="flex items-center justify-center h-full">
                <div class="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 shadow-sm">
                    Unable to load page: ${pageName}
                </div>
            </div>
        `;
    }
}

function updateNavigation(activePage) {

    document
        .querySelectorAll(".nav-button")
        .forEach(button => {

            button.classList.remove(
                "nav-button-active"
            );
        });

    const activeButton =
        document.getElementById(
            `nav-${activePage}`
        );

    if (activeButton) {

        activeButton.classList.add(
            "nav-button-active"
        );
    }
}