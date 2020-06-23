import User from "../models/user.model";
import { extend, isEmpty } from "lodash";
import errorHandler from "./error.controller";
import jwt from "jsonwebtoken";
import config from "./../../config/config";

// Creates a new user
const create = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = jwt.sign({ _id: user._id }, config.jwtSecret);
    res.cookie("t", token, { expire: new Date() + 9999 });
    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        message: "Successfully signed up!",
      },
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// Return a filtered list of all users
const list = async (req, res) => {
  try {
    let users = await User.find().select("name email updated created");
    res.status(200).json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// Find a user by ID and set req.profile as the user
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status("400").json({
        error: "User not found",
      });
    req.profile = user;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve user",
    });
  }
};

// Return a specific user (filtered)
const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

// Updates a user
const update = async (req, res) => {
  console.log(req.body, req.profile);
  if (isEmpty(req.body)) {
    return res.status(400).json({
      error: "No updates specified.",
    });
  }
  try {
    let user = req.profile;
    user = extend(user, req.body);
    user.updated = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// Removes a user from the db
const remove = async (req, res) => {
  try {
    let user = req.profile;
    let deletedUser = await user.remove();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.status(200).json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { create, userByID, read, list, remove, update };
