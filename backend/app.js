/**
 * Express application configuration.
 *
 * Registers middleware, routes and
 * shared application settings.
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import homeRoutes from "./routes/home.routes.js";
//import chatRoutes from "./routes/chat.routes.js";
//import publicationsRoutes from "./routes/publications.routes.js";
//import componentsRoutes from "./routes/components.routes.js";
//import diagramsRoutes from "./routes/diagrams.routes.js";
//import incidentsRoutes from "./routes/incidents.routes.js";

const app = express();

/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| Frontend
|--------------------------------------------------------------------------
*/

app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/home", homeRoutes);

//app.use("/api/chat", chatRoutes);

//app.use("/api/publications", publicationsRoutes);

//app.use("/api/components", componentsRoutes);

//app.use("/api/diagrams", diagramsRoutes);

//app.use("/api/incidents", incidentsRoutes);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {

    res.status(200).json({
        status: "ok"
    });

});

/*
|--------------------------------------------------------------------------
| Frontend Fallback
|--------------------------------------------------------------------------

app.get("*", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );

});
*/

export default app;