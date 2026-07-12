/**
 * Incidents service.
 *
 * Handles incident retrieval,
 * persistence and filesystem operations.
 */

import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

const INCIDENTS_PATH =
    path.join(
        __dirname,
        "../../documents/incidents"
    );

const LKB_COLOR =
    "#2E5CB8";

const LOGO_PATH =
    path.join(
        __dirname,
        "../../frontend/assets/images/lkb.png"
    );

async function getIncidents() {

    try {

        const entries =
            await fs.readdir(
                INCIDENTS_PATH,
                {
                    withFileTypes: true
                }
            );

        const incidents =
            await Promise.all(

                entries
                    .filter(
                        entry =>
                            entry.isFile()
                    )
                    .map(
                        async entry => {

                            const filePath =
                                path.join(
                                    INCIDENTS_PATH,
                                    entry.name
                                );

                            const stats =
                                await fs.stat(
                                    filePath
                                );

                            return {

                                name:
                                    entry.name,

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

        return incidents;

    } catch (error) {

        console.error(
            "[ERROR] Failed to retrieve incidents.",
            error
        );

        return [];

    }

}

async function saveIncident(
    incident
) {

    const {
        title,
        problem,
        cause,
        solution
    } = incident;

    const overwrite =
        incident.overwrite === true ||
        incident.overwrite === "true";

    const pdfPath =
        path.join(
            INCIDENTS_PATH,
            `${title}.pdf`
        );

    if (!overwrite) {

        try {

            await fs.access(
                pdfPath
            );

            throw new Error(
                "FILE_ALREADY_EXISTS"
            );

        } catch (error) {

            if (
                error.message ===
                "FILE_ALREADY_EXISTS"
            ) {

                throw error;

            }

        }

    }

    await new Promise(
        (
            resolve,
            reject
        ) => {

            const document =
                new PDFDocument({
                    margin: 50
                });

            const stream =
                fsSync.createWriteStream(
                    pdfPath
                );

            document.pipe(
                stream
            );

            const reportDate =
                new Date()
                    .toLocaleDateString(
                        "fr-FR"
                    )
                    .replaceAll(
                        "/",
                        "-"
                    );

            /* =====================================================
             * Logo
             * =================================================== */

            if (
                fsSync.existsSync(
                    LOGO_PATH
                )
            ) {

                document.image(
                    LOGO_PATH,
                    50,
                    40,
                    {
                        width: 70
                    }
                );

            }

            /* =====================================================
             * Header
             * =================================================== */

            document
                .fillColor(
                    LKB_COLOR
                )
                .fontSize(24)
                .text(
                    "INCIDENT REPORT",
                    80,
                    50,
                    {
                        width: 450,
                        align: "center"
                    }
                );

            document
                .fillColor(
                    "#666666"
                )
                .fontSize(11)
                .text(
                    "Laboratoire Kastler Brossel",
                    80,
                    document.y,
                    {
                        width: 450,
                        align: "center"
                    }
                );

            document.moveDown();

            document
                .strokeColor(
                    LKB_COLOR
                )
                .lineWidth(1.5)
                .moveTo(
                    50,
                    document.y
                )
                .lineTo(
                    545,
                    document.y
                )
                .stroke();

            document.moveDown(1.5);

            /* =====================================================
            * Report Information
            * =================================================== */

            const infoY =
                document.y;

            document
                .rect(
                    50,
                    infoY,
                    495,
                    80
                )
                .strokeColor(
                    "#CFCFCF"
                )
                .stroke();

            document
                .fillColor(
                    LKB_COLOR
                )
                .fontSize(11)
                .text(
                    "REPORT INFORMATION",
                    65,
                    infoY + 10
                );

            document
                .moveTo(
                    50,
                    infoY + 30
                )
                .lineTo(
                    545,
                    infoY + 30
                )
                .stroke();

            document
                .fillColor(
                    "#666666"
                )
                .fontSize(10)
                .text(
                    "Title",
                    65,
                    infoY + 40
                );

            document
                .fillColor(
                    "#000000"
                )
                .fontSize(12)
                .text(
                    title,
                    120,
                    infoY + 40
                );

            document
                .fillColor(
                    "#666666"
                )
                .fontSize(10)
                .text(
                    "Date",
                    65,
                    infoY + 58
                );

            document
                .fillColor(
                    "#000000"
                )
                .fontSize(12)
                .text(
                    reportDate,
                    120,
                    infoY + 58
                );

            document.y =
                infoY + 100;

            /* =====================================================
             * Helper
             * =================================================== */

            function addSection(
                heading,
                content
            ) {

                const text =
                    content || "-";

                const textHeight =
                    document.heightOfString(
                        text,
                        {
                            width: 455
                        }
                    );

                const boxHeight =
                    Math.max(
                        75,
                        textHeight + 45
                    );

                const boxY =
                    document.y;

                document
                    .rect(
                        50,
                        boxY,
                        495,
                        boxHeight
                    )
                    .strokeColor(
                        "#CFCFCF"
                    )
                    .stroke();

                document
                    .fillColor(
                        LKB_COLOR
                    )
                    .fontSize(11)
                    .text(
                        heading,
                        65,
                        boxY + 10
                    );

                document
                    .moveTo(
                        50,
                        boxY + 30
                    )
                    .lineTo(
                        545,
                        boxY + 30
                    )
                    .stroke();

                document
                    .fillColor(
                        "#000000"
                    )
                    .fontSize(11)
                    .text(
                        text,
                        65,
                        boxY + 40,
                        {
                            width: 455
                        }
                    );

                document.y =
                    boxY +
                    boxHeight +
                    15;

            }

            /* =====================================================
             * Sections
             * =================================================== */

            addSection(
                "PROBLEM DESCRIPTION",
                problem
            );

            addSection(
                "ROOT CAUSE",
                cause
            );

            addSection(
                "CORRECTIVE ACTION",
                solution
            );

            /* =====================================================
             * Footer
             * =================================================== */

            document.moveDown(
                0.5
            );

            document
                .strokeColor(
                    "#D8D8D8"
                )
                .moveTo(
                    50,
                    document.y
                )
                .lineTo(
                    545,
                    document.y
                )
                .stroke();

            document.moveDown(
                0.5
            );

            document
                .fillColor(
                    "#888888"
                )
                .fontSize(9)
                .text(
                    "Generated by LKB AI Hub",
                    {
                        align:
                            "center"
                    }
                );

            document.end();

            stream.on(
                "finish",
                resolve
            );

            stream.on(
                "error",
                reject
            );

        }
    );

}

async function renameIncident(
    oldName,
    newName
) {

    const oldPath =
        path.join(
            INCIDENTS_PATH,
            oldName
        );

    const extension =
        path.extname(
            oldName
        );

    const newPath =
        path.join(
            INCIDENTS_PATH,
            `${newName}${extension}`
        );

    try {

        await fs.access(
            newPath
        );

        throw new Error(
            "FILE_ALREADY_EXISTS"
        );

    } catch (error) {

        if (
            error.message ===
            "FILE_ALREADY_EXISTS"
        ) {

            throw error;

        }

    }

    await fs.rename(
        oldPath,
        newPath
    );

}

async function deleteIncident(
    filename
) {

    const filePath =
        path.join(
            INCIDENTS_PATH,
            filename
        );

    await fs.unlink(
        filePath
    );

}

function getIncidentPath(
    filename
) {

    return path.join(
        INCIDENTS_PATH,
        filename
    );

}

export {
    getIncidents,
    saveIncident,
    renameIncident,
    deleteIncident,
    getIncidentPath
};