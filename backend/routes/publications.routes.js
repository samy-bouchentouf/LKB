/**
 * Publications routes.
 *
 * Defines API endpoints used to manage
 * scientific publications.
 */

import express from "express";

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import {
    getPublications,
    uploadPublication,
    renamePublication,
    deletePublication,
    openPublication,
    downloadPublication
} from "../controllers/publications.controller.js";

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const storage =
    multer.diskStorage({

        destination: (
            req,
            file,
            callback
        ) => {

            callback(
                null,
                path.join(
                    __dirname,
                    "../../documents/publications"
                )
            );

        },

        filename: (
            req,
            file,
            callback
        ) => {

            callback(
                null,
                file.originalname
            );

        }

    });

const upload =
    multer({

        storage,

        fileFilter: (
            req,
            file,
            callback
        ) => {

            const allowedExtensions = [

                ".pdf",
                ".docx",
                ".txt",
                ".md"

            ];

            const extension =
                path.extname(
                    file.originalname
                ).toLowerCase();

            if (
                allowedExtensions.includes(
                    extension
                )
            ) {

                callback(
                    null,
                    true
                );

            } else {

                callback(
                    new Error(
                        "Unsupported file format."
                    )
                );

            }

        }

    });

const router = express.Router();

router.get(
    "/",
    getPublications
);

router.post(
    "/upload",
    upload.single("file"),
    uploadPublication
);

router.put(
    "/rename",
    renamePublication
);

router.delete(
    "/:filename",
    deletePublication
);

router.get(
    "/open/:filename",
    openPublication
);

router.get(
    "/download/:filename",
    downloadPublication
);

export default router;