const ProfilePage = require("../db/models/UserProfilePage");
const User = require("../db/models/User");

const moment = require("moment");
const express = require("express");
const uid = require("uid");

const router = new express.Router();

router.put("/:link/postText", async (req, res) => {
  /* 
  endpoint for posting on a user profile page, the identifir for the original poster in the db is the token because it's unique for every user.
  the identifier for the original poster in the textPosts array is the _id in mongodb (also because it's unique for each user) 
  */

  if (!req.body.headline || !req.body.text) {
    return res.status(401).send("Headline and Text are required");
  }

  const token = req.headers.authorization.replace("Bearer", "");
  const link = req.params.link;

  let profileExists;

  const check = await ProfilePage.findOne({ link }, (err, profile) => {
    if (!profile) {
      profileExists = false;
      return;
    }
  });

  if (!check) {
    res.status(500).send("not found");
    return;
  }

  try {
    const original_poster = await User.findOne({ token }, "_id", function (
      err,
      user
    ) {
      return user;
    });

    ProfilePage.findOneAndUpdate(
      { link },
      {
        $push: {
          textPosts: {
            headline: req.body.headline,
            text: req.body.text,
            createdAt: moment(),
            createBy: original_poster._id,
            uniq_id: uid(),
          },
        },
      }
    )
      .then(() => {
        return res.status(201).json({
          status: "Success",
          message: "Resources Are Created Successfully",
        });
      })
      .catch(() => {
        return res.status(500).json({
          status: "Failed",
          message: "Error",
        });
      });
  } catch (e) {
    return res.status(400).send("Can't post.");
  }
});

module.exports = router;
