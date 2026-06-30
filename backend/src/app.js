import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// route chat
app.use("/api/chat", chatRoutes);

// test route
app.get("/", (req, res) => {
  res.send("✅ API OK");
});

export default app;