/**
 * Publications routes.
 *
 * Defines API endpoints used to manage
 * scientific publications.
 */

import express from "express";

import fs from "fs";
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

const PUBLICATIONS_PATH =
    path.join(
        __dirname,
        "../../documents/publications"
    );

const storage =
    multer.diskStorage({

        destination: (
            req,
            file,
            callback
        ) => {

            callback(
                null,
                PUBLICATIONS_PATH
            );

        },

        filename: (
            req,
            file,
            callback
        ) => {

            const filePath =
                path.join(
                    PUBLICATIONS_PATH,
                    file.originalname
                );

            const overwrite =
                req.headers[
                    "x-overwrite"
                ] === "true";

            if (
                fs.existsSync(
                    filePath
                ) &&
                !overwrite
            ) {

                console.warn(
                    `[WARN] Publication upload rejected: "${file.originalname}" already exists.`
                );

                return callback(
                    new Error(
                        "FILE_ALREADY_EXISTS"
                    )
                );

            }

            if (
                overwrite
            ) {

                console.warn(
                    `[WARN] Publication upload overwrite: "${file.originalname}".`
                );

            }

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
    (
        req,
        res,
        next
    ) => {

        upload.single(
            "file"
        )(
            req,
            res,
            error => {

                if (
                    error?.message ===
                    "FILE_ALREADY_EXISTS"
                ) {

                    return res.status(409).json({
                        message:
                            "FILE_ALREADY_EXISTS"
                    });

                }

                if (error) {

                    return res.status(500).json({
                        message:
                            error.message
                    });

                }

                next();

            }
        );

    },
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