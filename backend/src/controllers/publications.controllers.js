import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

// Configuration du stockage de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtre de sécurité (Formats acceptés : PDF et Python uniquement)
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.py'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Format non supporté ! Seuls les fichiers .pdf et .py sont autorisés.'), false);
    }
};

// Initialisation de Multer avec la limite de 20 Mo
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 }
}).single('file');

// Permet d'accéder aux fichiers uploadés directement via une URL
app.use('/uploads', express.static(UPLOAD_DIR));

// Route POST pour recevoir un fichier
app.post('/api/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'Le fichier dépasse la limite de 20 Mo.' });
            }
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Aucun fichier reçu.' });
        }

        console.log(`Fichier reçu avec succès : ${req.file.originalname}`);
        res.status(200).json({
            success: true,
            message: 'Fichier déposé avec succès !',
            fileInfo: {
                originalName: req.file.originalname,
                savedName: req.file.filename,
                size: req.file.size,
                path: req.file.path
            }
        });
    });
});

// Route GET pour lister les fichiers déjà uploadés
app.get('/api/files', (req, res) => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erreur lecture dossier.' });
        }
        const fileList = files.map(filename => {
            const stats = fs.statSync(path.join(UPLOAD_DIR, filename));
            return {
                filename,
                size: stats.size,
                uploadedAt: stats.mtime
            };
        });
        res.json({ success: true, files: fileList });
    });
});

app.delete('/api/files/:filename', (req, res) => {
            const filename = req.params.filename;
            const filePath = path.join(UPLOAD_DIR, filename);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ success: false, message: 'Fichier introuvable.' });
            }

            fs.unlink(filePath, (err) => {
                if (err) return res.status(500).json({ success: false, message: 'Erreur suppression.' });
                res.json({ success: true, message: 'Fichier supprimé.' });
            });
        });

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});