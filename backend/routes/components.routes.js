/**
 * Components routes.
 *
 * Defines API endpoints used to manage
 * technical documentation.
 */

import express from "express";

import fs from "fs";
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

const COMPONENTS_PATH =
    path.join(
        __dirname,
        "../../documents/components"
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
                COMPONENTS_PATH
            );

        },

        filename: (
            req,
            file,
            callback
        ) => {

            const filePath =
                path.join(
                    COMPONENTS_PATH,
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
                    `[WARN] Component upload rejected: "${file.originalname}" already exists.`
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
                    `[WARN] Component upload overwrite: "${file.originalname}".`
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
    getComponents
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