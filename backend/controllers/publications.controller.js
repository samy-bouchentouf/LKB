/**
 * Publications controller.
 *
 * Handles publication requests and returns
 * publication data to the frontend.
 */

import {
    getPublications as getPublicationsService,
    uploadPublication as uploadPublicationService,
    renamePublication as renamePublicationService,
    deletePublication as deletePublicationService,
    getPublicationPath
} from "../services/publications.service.js";

async function getPublications(req, res) {

    try {

        const publications =
            await getPublicationsService();

        return res.status(200).json(
            publications
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to retrieve publications.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to retrieve publications."
        });

    }

}

async function uploadPublication(req, res) {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: "No file uploaded."
            });

        }

        const publication =
            await uploadPublicationService(
                req.file
            );

        return res.status(201).json(
            publication
        );

    } catch (error) {

        if (
            error.message ===
            "FILE_ALREADY_EXISTS"
        ) {

            return res.status(409).json({
                message:
                    "FILE_ALREADY_EXISTS"
            });

        }

        console.error(
            "[ERROR] Failed to upload publication.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to upload publication."
        });

    }

}

async function renamePublication(req, res) {

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
        
        await renamePublicationService(
            oldName,
            newName
        );

        return res.status(200).json({
            message:
                "Publication renamed successfully."
        });

    } catch (error) {

        if (
            error.message ===
            "FILE_ALREADY_EXISTS"
        ) {

            return res.status(409).json({
                message:
                    "FILE_ALREADY_EXISTS"
            });

        }

        console.error(
            "[ERROR] Failed to rename publication.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to rename publication."
        });

    }

}

async function deletePublication(req, res) {

    try {

        const { filename } =
            req.params;

        await deletePublicationService(
            filename
        );

        return res.status(200).json({
            message:
                "Publication deleted successfully."
        });

    } catch (error) {

        console.error(
            "[ERROR] Failed to delete publication.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to delete publication."
        });

    }

}

async function openPublication(req, res) {

    try {

        const { filename } =
            req.params;

        const filePath =
            getPublicationPath(
                filename
            );

        return res.sendFile(
            filePath
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to open publication.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to open publication."
        });

    }

}

async function downloadPublication(req, res) {

    try {

        const { filename } =
            req.params;

        const filePath =
            getPublicationPath(
                filename
            );

        return res.download(
            filePath
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to download publication.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to download publication."
        });

    }

}

export {
    getPublications,
    uploadPublication,
    renamePublication,
    deletePublication,
    openPublication,
    downloadPublication
};