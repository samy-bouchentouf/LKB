/**
 * Diagrams service.
 *
 * Handles diagram retrieval,
 * persistence and filesystem operations.
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const DIAGRAMS_PATH =
    path.join(
        __dirname,
        "../../documents/diagrams"
    );

const COMPONENTS_PATH =
    path.join(
        __dirname,
        "../../documents/components"
    );

async function getDiagrams() {

    try {

        const entries =
            await fs.readdir(
                DIAGRAMS_PATH,
                {
                    withFileTypes: true
                }
            );

        const diagrams =
            await Promise.all(

                entries
                    .filter(
                        entry =>
                            entry.isFile() &&
                            path.extname(
                                entry.name
                            ) === ".png"
                    )
                    .map(
                        async entry => {

                            const filePath =
                                path.join(
                                    DIAGRAMS_PATH,
                                    entry.name
                                );

                            const stats =
                                await fs.stat(
                                    filePath
                                );

                            return {

                                name:
                                    path.parse(
                                        entry.name
                                    ).name,

                                filename:
                                    entry.name,

                                size:
                                    stats.size,

                                createdAt:
                                    stats.birthtime

                            };

                        }
                    )

            );

        return diagrams;

    } catch (error) {

        console.error(
            "[ERROR] Failed to retrieve diagrams.",
            error
        );

        return [];

    }

}

async function saveDiagram(
    diagram
) {

    const {
        name,
        nodes,
        connections,
        image
    } = diagram;

    const jsonPath =
        path.join(
            DIAGRAMS_PATH,
            `${name}.json`
        );

    const pngPath =
        path.join(
            DIAGRAMS_PATH,
            `${name}.png`
        );

    await fs.writeFile(
        jsonPath,
        JSON.stringify(
            {
                name,
                nodes,
                connections
            },
            null,
            4
        ),
        "utf-8"
    );

    if (image) {

        const base64Data =
            image.replace(
                /^data:image\/png;base64,/,
                ""
            );

        await fs.writeFile(
            pngPath,
            Buffer.from(
                base64Data,
                "base64"
            )
        );

    }

}

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
            entries
                .filter(
                    entry =>
                        entry.isFile()
                )
                .map(
                    entry =>
                        path.parse(
                            entry.name
                        ).name
                )
                .sort(
                    (
                        first,
                        second
                    ) =>
                        first.localeCompare(
                            second
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

async function renameDiagram(
    oldName,
    newName
) {

    const oldJsonPath =
        path.join(
            DIAGRAMS_PATH,
            `${oldName}.json`
        );

    const oldPngPath =
        path.join(
            DIAGRAMS_PATH,
            `${oldName}.png`
        );

    const newJsonPath =
        path.join(
            DIAGRAMS_PATH,
            `${newName}.json`
        );

    const newPngPath =
        path.join(
            DIAGRAMS_PATH,
            `${newName}.png`
        );

    try {

        await fs.rename(
            oldJsonPath,
            newJsonPath
        );

    } catch {

        /* ignore */

    }

    try {

        await fs.rename(
            oldPngPath,
            newPngPath
        );

    } catch {

        /* ignore */

    }

}

async function deleteDiagram(
    filename
) {

    const diagramName =
        path.parse(
            filename
        ).name;

    const jsonPath =
        path.join(
            DIAGRAMS_PATH,
            `${diagramName}.json`
        );

    const pngPath =
        path.join(
            DIAGRAMS_PATH,
            `${diagramName}.png`
        );

    try {

        await fs.unlink(
            jsonPath
        );

    } catch {

        /* ignore */

    }

    try {

        await fs.unlink(
            pngPath
        );

    } catch {

        /* ignore */

    }

}

function getDiagramPath(
    filename
) {

    return path.join(
        DIAGRAMS_PATH,
        filename
    );

}

export {
    getDiagrams,
    saveDiagram,
    getComponents,
    renameDiagram,
    deleteDiagram,
    getDiagramPath
};