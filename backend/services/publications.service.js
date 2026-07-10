/**
 * Publications service.
 *
 * Handles publication retrieval and
 * filesystem operations.
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import {
    triggerSynchronization
} from "./sync.service.js";

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const PUBLICATIONS_PATH = path.join(
    __dirname,
    "../../documents/publications"
);

async function getPublications() {

    try {

        const entries =
            await fs.readdir(
                PUBLICATIONS_PATH,
                {
                    withFileTypes: true
                }
            );

        const publications =
            await Promise.all(

                entries
                    .filter(
                        entry => entry.isFile()
                    )
                    .map(
                        async entry => {

                            const filePath =
                                path.join(
                                    PUBLICATIONS_PATH,
                                    entry.name
                                );

                            const stats =
                                await fs.stat(
                                    filePath
                                );

                            return {

                                name:
                                    entry.name,

                                size:
                                    stats.size,

                                createdAt:
                                    stats.birthtime

                            };

                        }
                    )

            );

        return publications;

    } catch (error) {

        console.error(
            "[ERROR] Failed to retrieve publications.",
            error
        );

        return [];

    }

}

async function uploadPublication(
    file
) {

    if (!file) {

        throw new Error(
            "No file provided."
        );

    }

    await triggerSynchronization();

    return {

        filename:
            file.filename

    };

}

async function renamePublication(
    oldName,
    newName
) {

    const oldPath =
        path.join(
            PUBLICATIONS_PATH,
            oldName
        );

    const newPath =
        path.join(
            PUBLICATIONS_PATH,
            newName
        );

    await fs.rename(
        oldPath,
        newPath
    );

    /*
     * No synchronization required.
     *
     * The document content does not change,
     * therefore the hash remains identical.
     */

}

async function deletePublication(
    filename
) {

    const filePath =
        path.join(
            PUBLICATIONS_PATH,
            filename
        );

    await fs.unlink(
        filePath
    );

    await triggerSynchronization();

}

function getPublicationPath(
    filename
) {

    return path.join(
        PUBLICATIONS_PATH,
        filename
    );

}

export {
    getPublications,
    uploadPublication,
    renamePublication,
    deletePublication,
    getPublicationPath
};