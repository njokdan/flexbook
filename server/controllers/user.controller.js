import User from "../models/user.model";
import { extend, isEmpty } from "lodash";
import errorHandler from "./error.controller";
import jwt from "jsonwebtoken";
import config from "./../../config/config";
import formidable from "formidable";
import fs from "fs";
import profileImage from "../../client/assets/images/dyinginside.jpg";

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
  const form = formidable({ multiples: true, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    let user = req.profile;
    user = extend(user, fields);
    user.updated = Date.now();
    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }
    try {
      await user.save();
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
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

// Get photo
const photo = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};

// send default profile photo
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + profileImage);
};

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update,
  photo,
  defaultPhoto,
};
