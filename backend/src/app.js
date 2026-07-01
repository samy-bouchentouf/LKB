import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";
import documentsRoutes from "./routes/documents.routes.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/chat", chatRoutes);
app.use("/api/documents", documentsRoutes);

// test route
app.get("/", (req, res) => {
  res.send("✅ API OK");
});

export default app;