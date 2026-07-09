/**
 * Express application configuration.
 *
 * Registers middleware, routes and
 * shared application settings.
 */

const express = require("express");
const path = require("path");

const chatRoutes = require("./routes/chat.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const publicationsRoutes = require("./routes/publications.routes");
const componentsRoutes = require("./routes/components.routes");
const diagramsRoutes = require("./routes/diagrams.routes");
const incidentsRoutes = require("./routes/incidents.routes");

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

app.use("/api/chat", chatRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/publications", publicationsRoutes);

app.use("/api/components", componentsRoutes);

app.use("/api/diagrams", diagramsRoutes);

app.use("/api/incidents", incidentsRoutes);

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
*/

app.get("*", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );

});

module.exports = app;