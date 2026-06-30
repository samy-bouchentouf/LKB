import express from "express";
import cors from "cors";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route (pour vérifier que tout marche)
app.get("/", (req, res) => {
  res.send("✅ API OK");
});

export default app;