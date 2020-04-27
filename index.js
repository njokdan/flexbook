require("./db/mongoose");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const hpp = require("hpp");

const authRouter = require("./routers/authRoutes");
const createContentRouter = require("./routers/textPostsRoutes");
const userProfileRouter = require("./routers/userProfileRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(hpp());
app.use(cookieParser());
app.use(
  cors({
    origin: [`${process.env.LOCAL_LINK}`], //test env
    credentials: true,
  })
);
app.use(function (error, req, res, next) {
  if (error) {
    return res.status(500).send({ Error: "Error" });
  } else {
    next();
  }
});

app.use(authRouter);
app.use(createContentRouter);
app.use(userProfileRouter);

app.disable("x-powered-by");

app.listen(PORT, () => {
  console.log("server is on on port " + PORT);
});
