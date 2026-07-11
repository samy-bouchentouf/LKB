/**
 * Incidents controller.
 *
 * Handles incident requests and returns
 * incident data to the frontend.
 */

import {
    getIncidents as getIncidentsService,
    saveIncident as saveIncidentService,
    renameIncident as renameIncidentService,
    deleteIncident as deleteIncidentService,
    getIncidentPath
} from "../services/incidents.service.js";

async function getIncidents(req, res) {

    try {

        const incidents =
            await getIncidentsService();

        return res.status(200).json(
            incidents
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to retrieve incidents.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to retrieve incidents."
        });

    }

}

async function saveIncident(req, res) {

    try {

        const {
            title,
            problem,
            cause,
            solution,
            overwrite
        } = req.body;

        if (!title) {

            return res.status(400).json({
                message:
                    "Incident title is required."
            });

        }

        await saveIncidentService({

            title,
            problem,
            cause,
            solution,
            overwrite

        });

        return res.status(201).json({
            message:
                "Incident report saved successfully."
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
            "[ERROR] Failed to save incident report.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to save incident report."
        });

    }

}

async function renameIncident(req, res) {

    try {

        const {
            oldName,
            newName
        } = req.body;

        if (!oldName || !newName) {

            return res.status(400).json({
                message:
                    "Old and new incident names are required."
            });

        }

        await renameIncidentService(
            oldName,
            newName
        );

        return res.status(200).json({
            message:
                "Incident renamed successfully."
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
            "[ERROR] Failed to rename incident.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to rename incident."
        });

    }

}

async function deleteIncident(req, res) {

    try {

        const {
            filename
        } = req.params;

        await deleteIncidentService(
            filename
        );

        return res.status(200).json({
            message:
                "Incident deleted successfully."
        });

    } catch (error) {

        console.error(
            "[ERROR] Failed to delete incident.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to delete incident."
        });

    }

}

async function openIncident(req, res) {

    try {

        const {
            filename
        } = req.params;

        const filePath =
            getIncidentPath(
                filename
            );

        return res.sendFile(
            filePath
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to open incident.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to open incident."
        });

    }

}

async function downloadIncident(req, res) {

    try {

        const {
            filename
        } = req.params;

        const filePath =
            getIncidentPath(
                filename
            );

        return res.download(
            filePath
        );

    } catch (error) {

        console.error(
            "[ERROR] Failed to download incident.",
            error
        );

        return res.status(500).json({
            message:
                "Failed to download incident."
        });

    }

}

export {
    getIncidents,
    saveIncident,
    renameIncident,
    deleteIncident,
    openIncident,
    downloadIncident
};