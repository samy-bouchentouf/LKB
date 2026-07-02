import express from "express";
import {
    uploadPublication,
    listPublications
} from "../controllers/publications.controllers.js";

const router = express.Router();

router.post("/upload", uploadPublication);
router.get("/files", listPublications);

export default router;