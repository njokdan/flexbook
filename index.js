require("./db/mongoose");

const express = require("express");

const authRouter = require("./routers/authRoutes");
const createContentRouter = require("./routers/createContentRoutes");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(authRouter);
app.use(createContentRouter);

app.listen(port, () => {
  console.log("server is on on port " + port);
});
