/**
 * Components service.
 *
 * Handles component retrieval and
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

const COMPONENTS_PATH = path.join(
    __dirname,
    "../../documents/components"
);

async function getComponents() {

    try {

        const entries =
            await fs.readdir(
                COMPONENTS_PATH,
                {
                    withFileTypes: true
                }
            );

        const components =
            await Promise.all(

                entries
                    .filter(
                        entry => entry.isFile()
                    )
                    .map(
                        async entry => {

                            const filePath =
                                path.join(
                                    COMPONENTS_PATH,
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

        return components;

    } catch (error) {

        console.error(
            "[ERROR] Failed to retrieve components.",
            error
        );

        return [];

    }

}

async function uploadComponent(
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

async function renameComponent(
    oldName,
    newName
) {

    const oldPath =
        path.join(
            COMPONENTS_PATH,
            oldName
        );

    const newPath =
        path.join(
            COMPONENTS_PATH,
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

async function deleteComponent(
    filename
) {

    const filePath =
        path.join(
            COMPONENTS_PATH,
            filename
        );

    await fs.unlink(
        filePath
    );

    await triggerSynchronization();

}

function getComponentPath(
    filename
) {

    return path.join(
        COMPONENTS_PATH,
        filename
    );

}

export {
    getComponents,
    uploadComponent,
    renameComponent,
    deleteComponent,
    getComponentPath
};