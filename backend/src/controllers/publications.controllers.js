import { uploadMiddleware, getFiles } from "../services/publications.service.js";
import { exec } from "child_process";
import path from "path";

// ✅ upload fichier
export const uploadPublication = (req, res) => {
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

        console.log("📄 Upload OK :", req.file.filename);
          
        
        const pdfPath = path.join(
            process.cwd(),
            "backend",
            "uploads-pdf",
            req.file.filename
        );

        const title = path.parse(req.file.filename).name;

        exec(
            `python backend/app/operators/run_import_pdf.py "${pdfPath}" "${title}"`,
            (error, stdout, stderr) => {

                if (error) {
                    console.error("❌ Import PDF :", error);

                    if (stderr) {
                        console.error(stderr);
                    }

                    return;
                }

                console.log("✅ Import PDF :", stdout);

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
export const listPublications = (req, res) => {
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