/**
 * Home module.
 *
 * Handles home page interactions
 * and dashboard statistics.
 */

async function loadHomeStatistics() {

    try {

        const response = await fetch(
            "/api/home/stats"
        );

        if (!response.ok) {

            throw new Error(
                "Failed to retrieve statistics."
            );

        }

        const statistics =
            await response.json();

        document.getElementById(
            "publications-count"
        ).textContent =
            statistics.publications;

        document.getElementById(
            "components-count"
        ).textContent =
            statistics.components;

        document.getElementById(
            "diagrams-count"
        ).textContent =
            statistics.diagrams;

        document.getElementById(
            "incidents-count"
        ).textContent =
            statistics.incidents;

    } catch (error) {

        console.error(
            "[ERROR] Failed to load home statistics.",
            error
        );

    }

}

function initializeHome() {

    loadHomeStatistics();

    const askButton =
        document.getElementById(
            "home-ask-button"
        );

    const questionInput =
        document.getElementById(
            "home-question"
        );

    if (!askButton || !questionInput) {
        return;
    }

    askButton.addEventListener(
        "click",
        askQuickQuestion
    );

    questionInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                askQuickQuestion();

            }

        }
    );

}

function askQuickQuestion() {

    const questionInput =
        document.getElementById(
            "home-question"
        );

    const question =
        questionInput.value.trim();

    if (!question) {
        return;
    }

    sessionStorage.setItem(
        "quickQuestion",
        question
    );

    loadPage("chat");

}