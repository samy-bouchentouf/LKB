export const upload = (req, res) => {
    console.log("Fichier reçu :", req.file);

    res.json({
        message: "Fichier bien reçu ✅",
    });
};
