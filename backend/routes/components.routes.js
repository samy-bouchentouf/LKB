/**
 * Components routes.
 *
 * Defines API endpoints used to manage
 * technical documentation.
 */

import express from "express";

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import {
    getComponents,
    uploadComponent,
    renameComponent,
    deleteComponent,
    openComponent,
    downloadComponent
} from "../controllers/components.controller.js";

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
                    "../../documents/components"
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
    getComponents
);

router.post(
    "/upload",
    upload.single("file"),
    uploadComponent
);

router.put(
    "/rename",
    renameComponent
);

router.delete(
    "/:filename",
    deleteComponent
);

router.get(
    "/open/:filename",
    openComponent
);

router.get(
    "/download/:filename",
    downloadComponent
);

export default router;