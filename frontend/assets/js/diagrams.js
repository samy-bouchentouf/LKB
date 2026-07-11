/**
 * Diagram management module.
 *
 * Handles diagram creation,
 * editing and export operations.
 */

/* ============================================================
 * 0.GLOBAL STATE
 * ========================================================== */

let diagramComponents = [];

let diagramConnections = [];

let selectedElement = null;

let pendingComponentPosition = null;

let editingElement = null;

let draggedComponentId =
    null;

let dragOffsetX =
    0;

let dragOffsetY =
    0;


/* ============================================================
 * 1.INITIALIZATION
 * ========================================================== */

async function initializeDiagrams() {

    initializeToolbar();

    initializeCanvas();

    initializeDiagramLibrary();

    document
        .getElementById(
            "confirm-component-button"
        )
        ?.addEventListener(
            "click",
            () => {

                if (
                    editingElement &&
                    editingElement.type ===
                        "component"
                ) {

                    confirmComponentEdition();

                } else {

                    confirmComponentCreation();

                }

            }
        );

    document
        .getElementById(
            "cancel-component-button"
        )
        ?.addEventListener(
            "click",
            closeComponentModal
        );

    document
        .getElementById(
            "connect-component-button"
        )
        ?.addEventListener(
            "click",
            connectSelectedComponent
        );

    document
        .getElementById(
            "confirm-save-button"
        )
        ?.addEventListener(
            "click",
            confirmSaveDiagram
        );

    document
        .getElementById(
            "cancel-save-button"
        )
        ?.addEventListener(
            "click",
            closeSaveModal
        );

    closeComponentModal();

    closeSaveModal();

    showEmptyState();

}

/* ============================================================
 * 2.TOOLBAR
 * ========================================================== */

function initializeToolbar() {

    document
        .getElementById(
            "add-component-button"
        )
        ?.addEventListener(
            "click",
            activateAddComponentMode
        );

    document
        .getElementById(
            "save-diagram-button"
        )
        ?.addEventListener(
            "click",
            openSaveModal
        );

    document
        .getElementById(
            "reset-diagram-button"
        )
        ?.addEventListener(
            "click",
            resetDiagram
        );

}

function activateAddComponentMode() {

    editingElement =
        null;

    const canvas =
        document.getElementById(
            "diagram-canvas"
        );

    if (!canvas) {
        return;
    }

    pendingComponentPosition = {

        x:
            canvas.clientWidth / 2,

        y:
            canvas.clientHeight / 2

    };

    document.getElementById(
        "component-name"
    ).value = "";

    document.getElementById(
        "component-color"
    ).value = "#3b82f6";

    document.getElementById(
        "connection-name"
    ).value = "";

    document.getElementById(
        "connect-component-select"
    ).innerHTML = "";

    document.getElementById(
        "component-connections-list"
    ).innerHTML = "";

    document.getElementById(
        "component-connections-section"
    ).classList.add(
        "hidden"
    );

    openComponentModal();

}


/* ============================================================
 * 3.CANVAS
 * ========================================================== */

function initializeCanvas() {

    const canvas =
        document.getElementById(
            "diagram-canvas"
        );

    if (!canvas) {
        return;
    }

    canvas.addEventListener(
        "click",
        clearSelection
    );

    document.addEventListener(
        "mousemove",
        handleCanvasDrag
    );

    document.addEventListener(
        "mouseup",
        stopCanvasDrag
    );

}

function handleCanvasDrag(
    event
) {

    if (
        !draggedComponentId
    ) {
        return;
    }

    const canvas =
        document.getElementById(
            "diagram-canvas"
        );

    const bounds =
        canvas.getBoundingClientRect();

    const x =
        event.clientX -
        bounds.left -
        dragOffsetX;

    const y =
        event.clientY -
        bounds.top -
        dragOffsetY;

    updateComponentPosition(
        draggedComponentId,
        x,
        y
    );

    renderComponents();

    renderConnections();

}

function stopCanvasDrag() {

    draggedComponentId =
        null;

}

function clearSelection() {

    selectedElement =
        null;

    updateComponentSelection();

}

function showEmptyState() {

    const emptyState =
        document.getElementById(
            "diagram-empty-state"
        );

    if (!emptyState) {
        return;
    }

    if (
        diagramComponents.length === 0
    ) {

        emptyState.classList.remove(
            "hidden"
        );

    }

}

function hideEmptyState() {

    const emptyState =
        document.getElementById(
            "diagram-empty-state"
        );

    if (!emptyState) {
        return;
    }

    emptyState.classList.add(
        "hidden"
    );

}


/* ============================================================
 * 4.COMPONENT MODAL
 * ========================================================== */

function openComponentModal() {

    const modal =
        document.getElementById(
            "component-modal"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "hidden"
    );

}

function closeComponentModal() {

    const modal =
        document.getElementById(
            "component-modal"
        );

    if (!modal) {
        return;
    }

    modal.classList.add(
        "hidden"
    );

}

function confirmComponentCreation() {

    if (
        !pendingComponentPosition
    ) {
        return;
    }

    const nameInput =
        document.getElementById(
            "component-name"
        );

    const colorInput =
        document.getElementById(
            "component-color"
        );

    const componentName =
        nameInput.value.trim();

    if (!componentName) {

        alert(
            "Component name is required."
        );

        return;

    }

    createComponent(
        {
            name:
                componentName,

            color:
                colorInput.value

        },

        pendingComponentPosition.x,
        pendingComponentPosition.y
    );

    pendingComponentPosition =
        null;

    editingElement =
        null;

    nameInput.value =
        "";

    closeComponentModal();

}

function confirmComponentEdition() {

    if (
        !editingElement ||
        editingElement.type !==
            "component"
    ) {
        return;
    }

    const name =
        document
            .getElementById(
                "component-name"
            )
            .value
            .trim();

    const color =
        document
            .getElementById(
                "component-color"
            )
            .value;

    if (!name) {

        alert(
            "Component name is required."
        );

        return;

    }

    updateComponent(
        editingElement.id,
        {
            name,
            color
        }
    );

    editingElement =
        null;

    closeComponentModal();

}


/* ============================================================
 * 5.COMPONENTS
 * ========================================================== */

function createComponent(
    componentData,
    x,
    y
) {

    const component = {

        id:
            crypto.randomUUID(),

        name:
            componentData.name,

        color:
            componentData.color,

        x,

        y

    };

    diagramComponents.push(
        component
    );

    hideEmptyState();

    renderComponents();

    renderConnections();

}

function renderComponents() {

    const canvas =
        document.getElementById(
            "diagram-canvas"
        );

    canvas
        .querySelectorAll(
            ".diagram-component"
        )
        .forEach(
            component =>
                component.remove()
        );

    diagramComponents.forEach(
        component => {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "diagram-component absolute px-4 py-2 rounded-xl border-2 cursor-move select-none shadow-sm font-medium";

            element.style.left =
                `${component.x}px`;

            element.style.top =
                `${component.y}px`;

            element.style.backgroundColor =
                component.color;

            element.dataset.id =
                component.id;

            element.textContent =
                component.name;

            element.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    selectComponent(
                        component.id
                    );

                }
            );

            canvas.appendChild(
                element
            );

            makeComponentDraggable(
                element,
                component.id
            );

        }
    );

    updateComponentSelection();

}

function selectComponent(
    componentId
) {

    selectedElement = {

        type:
            "component",

        id:
            componentId

    };

    updateComponentSelection();

    editSelectedElement();

}

function updateComponentSelection() {

    document
        .querySelectorAll(
            ".diagram-component"
        )
        .forEach(
            component => {

                component.classList.remove(
                    "ring-4",
                    "ring-sky-400"
                );

            }
        );

    if (
        !selectedElement ||
        selectedElement.type !==
            "component"
    ) {
        return;
    }

    const selectedNode =
        document.querySelector(
            `[data-id="${selectedElement.id}"]`
        );

    if (selectedNode) {

        selectedNode.classList.add(
            "ring-4",
            "ring-sky-400"
        );

    }

}

function deleteComponent(
    componentId
) {

    diagramComponents =
        diagramComponents.filter(
            component =>
                component.id !==
                componentId
        );

    diagramConnections =
        diagramConnections.filter(
            connection =>
                connection.from !==
                    componentId &&
                connection.to !==
                    componentId
        );

    selectedElement =
        null;

    editingElement =
        null;

    renderComponents();

    renderConnections();

    if (
        diagramComponents.length === 0
    ) {

        showEmptyState();

    }

}

function updateComponent(
    componentId,
    values
) {

    const component =
        diagramComponents.find(
            component =>
                component.id ===
                componentId
        );

    if (!component) {
        return;
    }

    component.name =
        values.name;

    component.color =
        values.color;

    renderComponents();

    renderConnections();

}


/* ============================================================
 * 6.DRAG & DROP
 * ========================================================== */

function makeComponentDraggable(
    element,
    componentId
) {

    element.addEventListener(
        "mousedown",
        event => {

            draggedComponentId =
                componentId;

            dragOffsetX =
                event.offsetX;

            dragOffsetY =
                event.offsetY;

        }
    );

}

function updateComponentPosition(
    componentId,
    x,
    y
) {

    const component =
        diagramComponents.find(
            component =>
                component.id ===
                componentId
        );

    if (!component) {
        return;
    }

    component.x =
        x;

    component.y =
        y;

}


/* ============================================================
 * 7.CONNECTIONS
 * ========================================================== */

function createConnection(
    connectionData
) {

    const alreadyExists =
        diagramConnections.some(
            connection =>

                (
                    connection.from ===
                    connectionData.from &&
                    connection.to ===
                    connectionData.to
                ) ||

                (
                    connection.from ===
                    connectionData.to &&
                    connection.to ===
                    connectionData.from
                )

        );

    if (alreadyExists) {

        alert(
            "This connection already exists."
        );

        return;

    }

    diagramConnections.push({

        id:
            crypto.randomUUID(),

        from:
            connectionData.from,

        to:
            connectionData.to,

        name:
            connectionData.name,

        color:
            connectionData.color

    });

    renderConnections();

}

function renderConnections() {

    const svg =
        document.getElementById(
            "diagram-connections-layer"
        );

    if (!svg) {
        return;
    }

    svg.innerHTML = "";

    diagramConnections.forEach(
        drawConnection
    );

}

function drawConnection(
    connection
) {

    const svg =
        document.getElementById(
            "diagram-connections-layer"
        );

    const source =
        diagramComponents.find(
            component =>
                component.id ===
                connection.from
        );

    const target =
        diagramComponents.find(
            component =>
                component.id ===
                connection.to
        );

    if (
        !source ||
        !target
    ) {
        return;
    }

    const x1 =
        source.x + 60;

    const y1 =
        source.y + 24;

    const x2 =
        target.x + 60;

    const y2 =
        target.y + 24;

    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

    line.setAttribute(
        "x1",
        x1
    );

    line.setAttribute(
        "y1",
        y1
    );

    line.setAttribute(
        "x2",
        x2
    );

    line.setAttribute(
        "y2",
        y2
    );

    line.setAttribute(
        "stroke",
        connection.color
    );

    line.setAttribute(
        "stroke-width",
        "3"
    );

    line.dataset.connectionId =
        connection.id;

    line.style.cursor =
        "default";

    svg.appendChild(
        line
    );

    const label =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

    label.setAttribute(
        "x",
        (x1 + x2) / 2
    );

    label.setAttribute(
        "y",
        (y1 + y2) / 2 - 8
    );

    label.setAttribute(
        "fill",
        connection.color
    );

    label.setAttribute(
        "text-anchor",
        "middle"
    );

    label.setAttribute(
        "font-size",
        "12"
    );

    label.dataset.connectionId =
        connection.id;

    label.textContent =
        connection.name;

    label.style.cursor =
        "default";

    svg.appendChild(
        label
    );

}


function deleteConnection(
    connectionId
) {

    diagramConnections =
        diagramConnections.filter(
            connection =>
                connection.id !==
                connectionId
        );

    selectedElement =
        null;

    renderConnections();

}

function updateConnection(
    connectionId,
    values
) {

    const connection =
        diagramConnections.find(
            connection =>
                connection.id ===
                connectionId
        );

    if (!connection) {
        return;
    }

    connection.name =
        values.name;

    connection.color =
        values.color;

    renderConnections();

}


/* ============================================================
 * 8.EDIT
 * ========================================================== */

function editSelectedElement() {

    if (
        !selectedElement ||
        selectedElement.type !==
            "component"
    ) {
        return;
    }

    const component =
        diagramComponents.find(
            component =>
                component.id ===
                selectedElement.id
        );

    if (!component) {
        return;
    }

    editingElement = {

        type:
            "component",

        id:
            component.id

    };

    document.getElementById(
        "component-name"
    ).value =
        component.name;

    document.getElementById(
        "component-color"
    ).value =
        component.color;

    populateConnectComponentSelect(
        component.id
    );

    renderComponentConnections(
        component.id
    );

    document.getElementById(
            "component-connections-section"
        ).classList.remove(
            "hidden"
        );
    
    openComponentModal();

}

function populateConnectComponentSelect(
    componentId
) {

    const select =
        document.getElementById(
            "connect-component-select"
        );

    if (!select) {
        return;
    }

    select.innerHTML = "";

    diagramComponents
        .filter(
            component =>
                component.id !==
                componentId
        )
        .forEach(
            component => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    component.id;

                option.textContent =
                    component.name;

                select.appendChild(
                    option
                );

            }
        );

}

function renderComponentConnections(
    componentId
) {

    const container =
        document.getElementById(
            "component-connections-list"
        );

    if (!container) {
        return;
    }

    const connections =
        diagramConnections.filter(
            connection =>
                connection.from ===
                    componentId ||
                connection.to ===
                    componentId
        );

    container.innerHTML =
        connections
            .map(
                connection => {

                    const otherId =
                        connection.from ===
                        componentId
                            ? connection.to
                            : connection.from;

                    const otherComponent =
                        diagramComponents.find(
                            component =>
                                component.id ===
                                otherId
                        );

                    return `

                        <div class="border border-stone-200 rounded-xl p-3">

                            <div class="flex items-center gap-2">

                                <input
                                    class="connection-rename flex-1 border border-stone-200 rounded-lg px-2 py-1"
                                    data-id="${connection.id}"
                                    value="${connection.name}"
                                >

                                <span class="text-sm text-stone-500">
                                    → ${
                                        otherComponent
                                            ?.name ??
                                        "Unknown"
                                    }
                                </span>

                                <button
                                    class="connection-delete bg-red-50 text-red-700 px-3 py-1 rounded-lg"
                                    data-id="${connection.id}"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

    container
        .querySelectorAll(
            ".connection-delete"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteConnection(
                            button.dataset.id
                        );

                        renderComponentConnections(
                            componentId
                        );

                    }
                );

            }
        );

    container
        .querySelectorAll(
            ".connection-rename"
        )
        .forEach(
            input => {

                input.addEventListener(
                    "change",
                    () => {

                        updateConnection(
                            input.dataset.id,
                            {
                                name:
                                    input.value,
                                color:
                                    "#10b981"
                            }
                        );

                    }
                );

            }
        );

}

function connectSelectedComponent() {

    if (
        !editingElement ||
        editingElement.type !==
            "component"
    ) {
        return;
    }

    const targetId =
        document.getElementById(
            "connect-component-select"
        ).value;

    const connectionName =
        document.getElementById(
            "connection-name"
        ).value.trim();

    if (!targetId) {

        alert(
            "Please select a component."
        );

        return;

    }

    if (!connectionName) {

        alert(
            "Connection name is required."
        );

        return;

    }

    createConnection({

        from:
            editingElement.id,

        to:
            targetId,

        name:
            connectionName,

        color:
            "#10b981"

    });

    document.getElementById(
        "connection-name"
    ).value = "";

    renderComponentConnections(
        editingElement.id
    );

}

/* ============================================================
 * 9.RESET
 * ========================================================== */

function resetDiagram() {

    const confirmed =
        confirm(
            "Reset the entire diagram?"
        );

    if (!confirmed) {
        return;
    }

    diagramComponents = [];

    diagramConnections = [];

    selectedElement = null;

    editingElement = null;

    pendingComponentPosition = null;

    renderComponents();

    renderConnections();

    closeComponentModal();

    showEmptyState();

}


/* ============================================================
 * 10.SAVE MODAL
 * ========================================================== */

function openSaveModal() {

    const modal =
        document.getElementById(
            "save-diagram-modal"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "hidden"
    );

}

function closeSaveModal() {

    const modal =
        document.getElementById(
            "save-diagram-modal"
        );

    if (!modal) {
        return;
    }

    modal.classList.add(
        "hidden"
    );

}

async function confirmSaveDiagram() {

    const diagramName =
        document
            .getElementById(
                "diagram-name"
            )
            .value
            .trim();

    if (!diagramName) {

        alert(
            "Please enter a diagram name."
        );

        return;

    }

    try {

    await saveDiagram();

        closeSaveModal();

    } catch (error) {

        console.error(
            error
        );

        alert(
            "Failed to save diagram."
        );

    }

}


/* ============================================================
 * 11.EXPORT
 * ========================================================== */

function buildDiagramPayload() {

    const diagramName =
        document
            .getElementById(
                "diagram-name"
            )
            .value
            .trim();

    return {

        name:
            diagramName,

        nodes:
            [...diagramComponents],

        connections:
            [...diagramConnections]

    };

}

async function exportDiagramJson() {

    return buildDiagramPayload();

}

async function exportDiagramPng() {

    const canvas =
        document.getElementById(
            "diagram-canvas"
        );

    if (!canvas) {
        return null;
    }

    const dataUrl =
        await html2canvas(
            canvas
        ).then(
            renderedCanvas =>
                renderedCanvas.toDataURL(
                    "image/png"
                )
        );

    return dataUrl;

}


/* ============================================================
 * 12.BACKEND COMMUNICATION
 * ========================================================== */

async function saveDiagram() {

    const payload =
        await exportDiagramJson();

    payload.image =
        await exportDiagramPng();

    const response =
        await fetch(
            "/api/diagrams/save",
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
            "Failed to save diagram."
        );

    }

    alert(
        "Diagram saved successfully."
    );

    initializeDiagramLibrary();

}


/* ============================================================
 * 13.DIAGRAM LIBRARY
 * ========================================================== */

function initializeDiagramLibrary() {

    if (
        typeof initializeDocuments ===
        "function"
    ) {

        initializeDocuments(
            "diagrams"
        );

    }

}


/* ============================================================
 * 14.GLOBAL EXPORTS
 * ========================================================== */

window.initializeDiagrams =
    initializeDiagrams;