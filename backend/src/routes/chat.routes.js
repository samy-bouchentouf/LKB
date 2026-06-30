import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  // afficher ce que reçoit le backend
  console.log(req.body);

  res.json({
    message: "message reçu"
  });
});

export default router;