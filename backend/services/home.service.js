/**
 * Home service.
 *
 * Computes knowledge base statistics
 * displayed on the home page.
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const DOCUMENTS_PATH = path.join(
    __dirname,
    "../../documents"
);

async function countFiles(directory) {

    try {

        const files =
            await fs.readdir(directory);

        return files.length;

    } catch (error) {

        console.error(
            `[ERROR] Unable to read directory: ${directory}`
        );

        return 0;

    }

}

async function getStatistics() {

    const publicationsPath = path.join(
        DOCUMENTS_PATH,
        "publications"
    );

    const componentsPath = path.join(
        DOCUMENTS_PATH,
        "components"
    );

    const diagramsPath = path.join(
        DOCUMENTS_PATH,
        "diagrams"
    );

    const incidentsPath = path.join(
        DOCUMENTS_PATH,
        "incidents"
    );

    const [
        publications,
        components,
        diagrams,
        incidents
    ] = await Promise.all([
        countFiles(publicationsPath),
        countFiles(componentsPath),
        countFiles(diagramsPath),
        countFiles(incidentsPath)
    ]);

    return {
        publications,
        components,
        diagrams,
        incidents
    };

}

export {
    getStatistics
};