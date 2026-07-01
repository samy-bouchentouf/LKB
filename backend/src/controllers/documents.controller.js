import fs from "fs";
import path from "path";

export const upload = (req, res) => {

    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: "Pas de fichier" });
    }

    // ✅ chemin de sauvegarde
    const filePath = path.join("uploads", file.originalname);

    // ✅ écrire le fichier sur disque
    fs.writeFileSync(filePath, file.buffer);

    console.log("📄 Fichier sauvegardé :", filePath);

    res.json({
        message: "Fichier sauvegardé ✅",
        path: filePath
    });
};