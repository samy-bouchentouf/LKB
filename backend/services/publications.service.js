import multer from "multer";
import path from "path";
import fs from "fs";

// 📁 dossier uploads
const UPLOAD_DIR = path.join(process.cwd(), "backend", "uploads-pdf");

// créer si absent
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ✅ config multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// ✅ filtre fichiers
const fileFilter = (req, file, cb) => {
    const allowed = [".pdf", ".py"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Format non supporté"), false);
    }
};

// ✅ upload middleware
export const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 }
}).single("file");

// ✅ récupérer liste fichiers
export const getFiles = () => {
    const files = fs.readdirSync(UPLOAD_DIR);

    return files.map((filename) => {
        const stats = fs.statSync(path.join(UPLOAD_DIR, filename));
        return {
            filename,
            size: stats.size,
            uploadedAt: stats.mtime
        };
    });
};