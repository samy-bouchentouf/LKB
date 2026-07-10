/**
 * Document management module.
 *
 * Handles document listing, uploading
 * and retrieval operations.
 */

let documentType = null;

let documentsCache = [];

async function initializeDocuments(
    type
) {

    documentType =
        type;

    initializeDropzone();

    initializeSearch();

    initializeSorting();

    await loadDocuments();

}

async function loadDocuments() {

    try {

        const response =
            await fetch(
                `/api/${documentType}`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to retrieve documents."
            );

        }

        documentsCache =
            await response.json();

        applySortingAndRender();

    } catch (error) {

        console.error(
            "[ERROR] Failed to load documents.",
            error
        );

    }

}

function applySortingAndRender() {

    const sortSelect =
        document.getElementById(
            "document-sort"
        );

    const documents =
        [...documentsCache];

    if (sortSelect) {

        switch (
            sortSelect.value
        ) {

            case "az":

                documents.sort(
                    (a, b) =>
                        a.name.localeCompare(
                            b.name
                        )
                );

                break;

            case "za":

                documents.sort(
                    (a, b) =>
                        b.name.localeCompare(
                            a.name
                        )
                );

                break;

            case "oldest":

                documents.sort(
                    (a, b) =>
                        new Date(
                            a.createdAt
                        ) -
                        new Date(
                            b.createdAt
                        )
                );

                break;

            case "newest":

            default:

                documents.sort(
                    (a, b) =>
                        new Date(
                            b.createdAt
                        ) -
                        new Date(
                            a.createdAt
                        )
                );

        }

    }

    renderDocuments(
        documents
    );

}

function initializeSorting() {

    const sortSelect =
        document.getElementById(
            "document-sort"
        );

    if (!sortSelect) {
        return;
    }

    sortSelect.addEventListener(
        "change",
        applySortingAndRender
    );

}

function renderDocuments(
    documents
) {

    const grid =
        document.getElementById(
            "documents-grid"
        );

    const count =
        document.getElementById(
            "documents-count"
        );

    if (!grid || !count) {
        return;
    }

    count.textContent =
        `${documents.length} document(s)`;

    grid.innerHTML =
        documents.map(
            document => {

                const encodedName =
                    encodeURIComponent(
                        document.name
                    );

                return `

                    <div class="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full">

                        <div class="text-3xl mb-3">
                            📄
                        </div>

                        <h4 class="font-semibold text-stone-800 break-words flex-1">
                            ${document.name}
                        </h4>

                        <div class="flex gap-2 mt-5">

                            <button
                                class="flex-1 bg-stone-100 text-stone-700 rounded-xl py-2 text-sm font-medium"
                                onclick="downloadDocument('${encodedName}')"
                            >
                                Download
                            </button>

                            <button
                                class="flex-1 bg-amber-50 text-amber-700 rounded-xl py-2 text-sm font-medium"
                                onclick="renameDocument('${encodedName}')"
                            >
                                Rename
                            </button>

                            <button
                                class="flex-1 bg-red-50 text-red-700 rounded-xl py-2 text-sm font-medium"
                                onclick="deleteDocument('${encodedName}')"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");

}

function initializeSearch() {

    const searchInput =
        document.getElementById(
            "document-search"
        );

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        async () => {

            const response =
                await fetch(
                    `/api/${documentType}`
                );

            const documents =
                await response.json();

            const query =
                searchInput.value
                    .toLowerCase();

            const filtered =
                documents.filter(
                    document =>
                        document.name
                            .toLowerCase()
                            .includes(
                                query
                            )
                );

            renderDocuments(
                filtered
            );

        }
    );

}

function initializeDropzone() {

    const dropzone =
        document.getElementById(
            "document-dropzone"
        );

    if (!dropzone) {
        return;
    }

    const fileInput =
        document.createElement(
            "input"
        );

    fileInput.type = "file";

    fileInput.hidden = true;

    dropzone.appendChild(
        fileInput
    );

    dropzone.addEventListener(
        "click",
        () => {

            fileInput.click();

        }
    );

    fileInput.addEventListener(
        "change",
        async event => {

            const file =
                event.target.files[0];

            if (file) {

                await uploadDocument(
                    file
                );

            }

        }
    );

    dropzone.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

        }
    );

    dropzone.addEventListener(
        "drop",
        async event => {

            event.preventDefault();

            const file =
                event.dataTransfer
                    .files[0];

            if (file) {

                await uploadDocument(
                    file
                );

            }

        }
    );

}

async function uploadDocument(
    file
) {

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    const response =
        await fetch(
            `/api/${documentType}/upload`,
            {
                method: "POST",
                body: formData
            }
        );

    if (!response.ok) {

        throw new Error(
            "Failed to upload document."
        );

    }

    await loadDocuments();

}

async function renameDocument(
    filename
) {

    filename =
        decodeURIComponent(
            filename
        );

    const newName =
        prompt(
            "New filename:",
            filename
        );

    if (
        !newName ||
        newName === filename
    ) {
        return;
    }

    const response =
        await fetch(
            `/api/${documentType}/rename`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    oldName:
                        filename,

                    newName

                })

            }
        );

    if (!response.ok) {

        throw new Error(
            "Failed to rename document."
        );

    }

    await loadDocuments();

}

async function deleteDocument(
    filename
) {

    filename =
        decodeURIComponent(
            filename
        );

    const confirmed =
        confirm(
            `Delete "${filename}" ?`
        );

    if (!confirmed) {
        return;
    }

    const response =
        await fetch(
            `/api/${documentType}/${encodeURIComponent(filename)}`,
            {
                method: "DELETE"
            }
        );

    if (!response.ok) {

        throw new Error(
            "Failed to delete document."
        );

    }

    await loadDocuments();

}

function downloadDocument(
    filename
) {

    filename =
        decodeURIComponent(
            filename
        );

    window.open(
        `/api/${documentType}/download/${encodeURIComponent(filename)}`,
        "_blank"
    );

}

window.initializeDocuments =
    initializeDocuments;

window.renameDocument =
    renameDocument;

window.deleteDocument =
    deleteDocument;

window.downloadDocument =
    downloadDocument;