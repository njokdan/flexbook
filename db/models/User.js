const mongoose = require("mongoose");
const validator = require('validator')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  token: {
    type: String,
    trim: true
  }
});

userSchema.pre("save", async function(next) {
  const user = this;

  if (!validator.isEmail(user.email)) {
    throw new Error('Please insert email')
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;