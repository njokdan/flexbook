/* Server entry point */

// SSR configuration is in client.routes.js

require("dotenv").config();
require("css.escape");

import app from "./express";
import config from "../config/config";

import devBundle from "./devBundle"; //comment out when building the application code for production

const PORT = config.port;
const env = config.env;

// Connect to database
require("./db");

// Start the server
app.listen(PORT, (err) => {
  if (err) {
    console.log("\x1b[41m%s\x1b[0m", `Error starting server: ${err}`);
  }
  console.info("\x1b[42m\x1b[30m%s\x1b[0m", `Server started on port ${PORT}.`);
});

if (env === "development") {
  devBundle.compile(app); //comment out when building the application code for production
}
