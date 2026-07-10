/**
 * Components controller.
 *
 * Handles component requests and returns
 * component data to the frontend.
 */

import {
    getComponents as getComponentsService,
    uploadComponent as uploadComponentService,
    renameComponent as renameComponentService,
    deleteComponent as deleteComponentService,
    getComponentPath
} from "../services/components.service.js";

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

async function uploadComponent(req, res) {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: "No file uploaded."
            });

        }

        const component =
            await uploadComponentService(
                req.file
            );

        return res.status(201).json(
            component
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to upload component.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to upload component."
        });

    }

}

async function renameComponent(req, res) {

    try {
        
        const {
            oldName,
            newName
        } = req.body;

        if (!oldName || !newName) {

            return res.status(400).json({
                message:
                    "Old and new filenames are required."
            });

        } 
        
        await renameComponentService(
            oldName,
            newName
        );

        return res.status(200).json({
            message:
                "Component renamed successfully."
        });

    } catch (error) {

        console.error(
            "[ERROR] Failed to rename component.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to rename component."
        });

    }

}

async function deleteComponent(req, res) {

    try {

        const { filename } =
            req.params;

        await deleteComponentService(
            filename
        );

        return res.status(200).json({
            message:
                "Component deleted successfully."
        });

    } catch (error) {

        console.error(
            "[ERROR] Failed to delete component.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to delete component."
        });

    }

}

async function openComponent(req, res) {

    try {

        const { filename } =
            req.params;

        const filePath =
            getComponentPath(
                filename
            );

        return res.sendFile(
            filePath
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to open component.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to open component."
        });

    }

}

async function downloadComponent(req, res) {

    try {

        const { filename } =
            req.params;

        const filePath =
            getComponentPath(
                filename
            );

        return res.download(
            filePath
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to download component.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to download component."
        });

    }

}

export {
    getComponents,
    uploadComponent,
    renameComponent,
    deleteComponent,
    openComponent,
    downloadComponent
};