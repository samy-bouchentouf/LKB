/**
 * Incidents routes.
 *
 * Defines API endpoints used to manage
 * incident reports.
 */

import express from "express";

import {
    getIncidents,
    saveIncident,
    renameIncident,
    deleteIncident,
    openIncident,
    downloadIncident
} from "../controllers/incidents.controller.js";

const router = express.Router();

router.get(
    "/",
    getIncidents
);

router.post(
    "/save",
    saveIncident
);

router.put(
    "/rename",
    renameIncident
);

router.delete(
    "/:filename",
    deleteIncident
);

router.get(
    "/open/:filename",
    openIncident
);

router.get(
    "/download/:filename",
    downloadIncident
);

export default router;