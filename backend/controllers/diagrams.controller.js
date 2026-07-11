/**
 * Diagrams controller.
 *
 * Handles diagram requests and returns
 * diagram data to the frontend.
 */

import {
    getDiagrams as getDiagramsService,
    saveDiagram as saveDiagramService,
    getComponents as getComponentsService,
    renameDiagram as renameDiagramService,
    deleteDiagram as deleteDiagramService,
    getDiagramPath
} from "../services/diagrams.service.js";

async function getDiagrams(req, res) {

    try {

        const diagrams =
            await getDiagramsService();

        return res.status(200).json(
            diagrams
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to retrieve diagrams.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to retrieve diagrams."
        });

    }

}

async function saveDiagram(req, res) {

    try {

        const {
            name,
            nodes,
            connections,
            image
        } = req.body;

        if (!name) {

            return res.status(400).json({
                message:
                    "Diagram name is required."
            });

        }

        await saveDiagramService({

            name,
            nodes,
            connections,
            image

        });

        return res.status(201).json({
            message:
                "Diagram saved successfully."
        });

    } catch (error) {

        console.error(
            "[ERROR] Failed to save diagram.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to save diagram."
        });

    }

}

async function getComponents(req, res) {

    try {

        const components =
            await getComponentsService();

        return res.status(200).json(
            components
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to retrieve components.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to retrieve components."
        });

    }

}

async function renameDiagram(req, res) {

    try {

        const {
            oldName,
            newName
        } = req.body;

        if (!oldName || !newName) {

            return res.status(400).json({
                message:
                    "Old and new diagram names are required."
            });

        }

        await renameDiagramService(
            oldName,
            newName
        );

        return res.status(200).json({
            message:
                "Diagram renamed successfully."
        });

    } catch (error) {

        console.error(
            "[ERROR] Failed to rename diagram.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to rename diagram."
        });

    }

}

async function deleteDiagram(req, res) {

    try {

        const {
            filename
        } = req.params;

        await deleteDiagramService(
            filename
        );

        return res.status(200).json({
            message:
                "Diagram deleted successfully."
        });

    } catch (error) {

        console.error(
            "[ERROR] Failed to delete diagram.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to delete diagram."
        });

    }

}

async function openDiagram(req, res) {

    try {

        const {
            filename
        } = req.params;

        const filePath =
            getDiagramPath(
                filename
            );

        return res.sendFile(
            filePath
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to open diagram.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to open diagram."
        });

    }

}

async function downloadDiagram(req, res) {

    try {

        const {
            filename
        } = req.params;

        const filePath =
            getDiagramPath(
                filename
            );

        return res.download(
            filePath
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to download diagram.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to download diagram."
        });

    }

}

export {
    getDiagrams,
    saveDiagram,
    getComponents,
    renameDiagram,
    deleteDiagram,
    openDiagram,
    downloadDiagram
};