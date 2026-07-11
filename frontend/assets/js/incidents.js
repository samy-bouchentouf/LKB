/**
 * Incident management module.
 *
 * Handles incident report creation
 * and library initialization.
 */

async function initializeIncidents() {

    initializeDocuments(
        "incidents"
    );

    document
        .getElementById(
            "save-incident-button"
        )
        ?.addEventListener(
            "click",
            saveIncident
        );

}

async function saveIncident() {

    const payload = {

        title:
            document
                .getElementById(
                    "incident-title"
                )
                .value
                .trim(),

        problem:
            document
                .getElementById(
                    "incident-problem"
                )
                .value
                .trim(),

        cause:
            document
                .getElementById(
                    "incident-cause"
                )
                .value
                .trim(),

        solution:
            document
                .getElementById(
                    "incident-solution"
                )
                .value
                .trim()

    };

    if (!payload.title) {

        alert(
            "Incident title is required."
        );

        return;

    }

    try {

        const response =
            await fetch(
                "/api/incidents/save",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );

        if (!response.ok) {

            throw new Error(
                "Failed to save incident."
            );

        }

        document.getElementById(
            "incident-title"
        ).value = "";

        document.getElementById(
            "incident-problem"
        ).value = "";

        document.getElementById(
            "incident-cause"
        ).value = "";

        document.getElementById(
            "incident-solution"
        ).value = "";

        alert(
            "Incident report saved successfully."
        );

        initializeDocuments(
            "incidents"
        );

    } catch (error) {

        console.error(
            error
        );

        alert(
            "Failed to save incident report."
        );

    }

}

window.initializeIncidents =
    initializeIncidents;