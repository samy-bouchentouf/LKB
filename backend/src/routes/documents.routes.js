import express from "express";
import multer from "multer";
import { upload } from "../controllers/documents.controller.js";

const router = express.Router();

// config multer
const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage });

// route upload
router.post("/upload", uploadMiddleware.single("file"), upload);

export default router;
