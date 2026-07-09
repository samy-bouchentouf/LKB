/**
 * Application entry point.
 *
 * Starts the Express server and exposes
 * the LKB API.
 */

import app from "./app.js";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`✅ Backend lancé sur http://localhost:${PORT}`);
});