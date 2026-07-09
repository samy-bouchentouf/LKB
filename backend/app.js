/**
 * Express application configuration.
 *
 * Registers middleware, routes and
 * shared application settings.
 */

import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";
import documentsRoutes from "./routes/documents.routes.js";
import publicationsRoutes from "./routes/publications.routes.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/chat", chatRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/publications", publicationsRoutes);
app.use("/uploads-pdf", express.static("backend/uploads-pdf"));
app.use("/uploads-component", express.static("backend/uploads-component"));

// test route
app.get("/", (req, res) => {
  res.send("✅ API OK");
});

export default app;