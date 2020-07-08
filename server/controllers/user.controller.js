import User from "../models/user.model";
import Post from "../models/post.model";
import { extend } from "lodash";
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
    let user = await User.findById(id)
      .populate("following", "_id name")
      .populate("followers", "_id name");
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
    await User.updateMany(
      { followers: user._id, following: user._id },
      {
        $pull: {
          followers: { $in: [user._id] },
          following: { $in: [user._id] },
        },
      }
    );

    await Post.deleteMany({ postedBy: user._id });

    await Post.updateMany(
      {
        $or: [
          { likes: user._id },
          { comments: { $elemMatch: { postedBy: user._id } } },
        ],
      },
      {
        $pull: {
          comments: { postedBy: { $in: [user._id] } },
          likes: { $in: [user._id] },
        },
      }
    );

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

// Get profile photo
const photo = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};

// get default profile photo
const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd() + profileImage);
};

//  Update a user's following list (who the user follows)
const addUserFollowingList = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { following: req.body.followId },
    });
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// Add a new follower to a user (update list of followers of a user)
const addUserFollowedByList = async (req, res) => {
  try {
    let result = await User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.body.userId } },
      { new: true }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    result.hashed_password = undefined;
    result.salt = undefined;
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// remove a user from following list of a user (stop following someone)
const removeUserFollowingList = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, {
      $pull: { following: req.body.unfollowId },
    });
    next();
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// remove follower from a user's followers list
const removeUserFollowedByList = async (req, res) => {
  try {
    let result = await User.findByIdAndUpdate(
      req.body.unfollowId,
      { $pull: { followers: req.body.userId } },
      { new: true }
    )
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    result.hashed_password = undefined;
    result.salt = undefined;
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

/**
 * get User collection in the database to find the users
 * that are not in the current user's following list.
 */
const findNewPeople = async (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  try {
    let users = await User.find({ _id: { $nin: following } }).select("name");
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
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
  addUserFollowingList,
  addUserFollowedByList,
  removeUserFollowingList,
  removeUserFollowedByList,
  findNewPeople,
};
