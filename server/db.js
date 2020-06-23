/* DB connection helper */

require("dotenv").config();

import mongoose from "mongoose";
import config from "../config/config";

const mongoUri = process.env.MONGODB_URI || config.mongoUri;

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.info(
        "\x1b[42m\x1b[30m%s\x1b[0m",
        `Connected to ${mongoUri} successfully.`
      );
    },
    (err) => {
      console.error("\x1b[41m%s\x1b[0m", `Could not connect to ${mongoUri}.`);
    }
  );
