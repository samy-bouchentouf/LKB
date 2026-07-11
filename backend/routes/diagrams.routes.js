/**
 * Diagrams routes.
 *
 * Defines API endpoints used to manage
 * experiment diagrams.
 */

import express from "express";

import {
    getDiagrams,
    saveDiagram,
    getComponents,
    renameDiagram,
    deleteDiagram,
    downloadDiagram
} from "../controllers/diagrams.controller.js";

const router = express.Router();

router.get(
    "/",
    getDiagrams
);

router.post(
    "/save",
    saveDiagram
);

router.get(
    "/components",
    getComponents
);

router.put(
    "/rename",
    renameDiagram
);

router.delete(
    "/:filename",
    deleteDiagram
);

router.get(
    "/download/:filename",
    downloadDiagram
);

export default router;