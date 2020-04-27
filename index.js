require("./db/mongoose");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routers/authRoutes");
const createContentRouter = require("./routers/createContentRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
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

app.disable("x-powered-by");

app.listen(PORT, () => {
  console.log("server is on on port " + PORT);
});
