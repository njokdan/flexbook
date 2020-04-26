const mongoose = require("mongoose");
const mongoURL = require('./mongoURL') //hidden

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongo instance");
});

mongoose.connection.on("error", err => {
  console.error("Error connecting to mongo ", err);
});
