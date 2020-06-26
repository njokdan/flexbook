/* Server entry point */

// SSR configuration is in client.routes.js

require("dotenv").config();

import app from "./express";
import config from "../config/config";

const PORT = config.port;

// Connect to database
require("./db");

// Start the server
app.listen(PORT, (err) => {
  if (err) {
    console.log("\x1b[41m%s\x1b[0m", `Error starting server: ${err}`);
  }
  console.info("\x1b[42m\x1b[30m%s\x1b[0m", `Server started on port ${PORT}.`);
});
