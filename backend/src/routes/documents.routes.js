import express from "express";

import {
    uploadDocument,
    listDocuments
} from "../controllers/documents.controller.js";

const router = express.Router();

router.post("/upload", uploadDocument);
router.get("/files", listDocuments);

export default router;