import {
    uploadMiddleware,
    getFiles
} from "../services/documents.service.js";

import { exec } from "child_process";
import path from "path";

// ✅ upload fichier
export const uploadDocument = (req, res) => {
    uploadMiddleware(req, res, (err) => {

        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Aucun fichier"
            });
        }

        console.log("📁 Upload TECH OK :", req.file.filename);

        const pdfPath = path.join(
            process.cwd(),
            "backend",
            "uploads-component",
            req.file.filename
        );

        const componentName = path.parse(
            req.file.filename
        ).name;

        console.log("🚀 Import Component :", pdfPath);

        exec(
            `python backend/run_import_component.py "${pdfPath}" "${componentName}"`,
            (error, stdout, stderr) => {

                if (error) {
                    console.error(
                        "❌ Import Component :",
                        error
                    );

                    if (stderr) {
                        console.error(stderr);
                    }

                    return;
                }

                console.log(
                    "✅ Import Component :",
                    stdout
                );

                if (stderr) {
                    console.error(stderr);
                }
            }
        );

        res.json({
            success: true,
            message: "Fichier uploadé",
            file: req.file.filename
        });
    });
};

// ✅ liste fichiers
export const listDocuments = (req, res) => {
    try {

        const files = getFiles();

        res.json({
            success: true,
            files
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Erreur lecture fichiers"
        });

    }
};