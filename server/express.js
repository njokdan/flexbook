// Express server configuration

// Dependencies
import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import path from "path";

// Routes
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import clientRoutes from "./routes/client.routes";
import postRoutes from "./routes/post.routes";

// Config for developement - production config in .env
import config from "../config/config";

// import devBundle from "./devBundle"; //comment out when building the application code for production

const CURRENT_WORKING_DIR = process.cwd();

const app = express();

// devBundle.compile(app); //comment out when building the application code for production

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));

// Routes
app.use("/", userRoutes);
app.use("/", postRoutes);
app.use("/", authRoutes);

// Server side rendering routes - main routes
app.use("/", clientRoutes);

/*
 * Auth error handling.
 * 'UnauthorizedError' is thrown by express-jwt.
 */
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    config.env === "development"
      ? res.status(401).json({ error: err.name + ": " + err.message })
      : res.status(401).json({ error: "Forbbiden" });
  } else if (err) {
    if (config.env === "development") {
      console.error("\x1b[41m%s\x1b[0m", err);
      return res.status(401).json({ error: err.name + ": " + err.message });
    }
    res.status(401).json({ error: "Forbbiden" });
  }
});

export default app;
