import {
    uploadMiddleware,
    getFiles
} from "../services/documents.service.js";

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