const mongoose = require("mongoose");
const validator = require("validator");
const uid = require("uid");

const ProfilePage = require("./UserProfilePage");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  token: {
    type: String,
    trim: true,
    unique: true,
  },
  userProfile: {
    type: String,
    trim: true,
  },
  profilePicture: {
    type: String,
    trim: true,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (!validator.isEmail(user.email)) {
    throw new Error("Please insert email");
  }

  next();
});

userSchema.post("save", async function (next) {
  const user = this;

  const page = new ProfilePage({
    ownedBy: user._id,
    link: uid(),
    ownedByUser: user.name,
  });

  page.save();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
