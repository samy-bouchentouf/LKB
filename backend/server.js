/**
 * Application entry point.
 *
 * Starts the Express server and exposes
 * the LKB API.
 */

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("");
    console.log("==================================");
    console.log("[INFO] LKB AI Hub Backend Started");
    console.log(`[INFO] Server running on port ${PORT}`);
    console.log(`[INFO] Application available at http://localhost:${PORT}`);
    console.log("==================================");
    console.log("");

});