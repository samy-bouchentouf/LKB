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

async function saveIncident(
    overwrite = false
) {

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
                .trim(),

        overwrite

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

        if (
            response.status === 409
        ) {

            const action =
                await openConflictModal(
                    payload.title
                );

            if (
                action ===
                "cancel"
            ) {

                return;

            }

            if (
                action ===
                "rename"
            ) {

                let counter = 1;

                let suggestedTitle =
                    `${payload.title}(${counter})`;

                while (

                    documentsCache.some(
                        document =>
                            document.name.replace(
                                ".pdf",
                                ""
                            ) ===
                            suggestedTitle
                    )

                ) {

                    counter++;

                    suggestedTitle =
                        `${payload.title}(${counter})`;

                }

                const newTitle =
                    prompt(
                        "New incident title:",
                        suggestedTitle
                    );

                if (
                    !newTitle
                ) {

                    return;

                }

                document.getElementById(
                    "incident-title"
                ).value =
                    newTitle;

                return saveIncident();

            }

            if (
                action ===
                "overwrite"
            ) {

                return saveIncident(
                    true
                );

            }

            return;

        }

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