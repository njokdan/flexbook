const ProfilePage = require("../db/models/UserProfilePage");
const User = require("../db/models/User");

const moment = require("moment");
const express = require("express");
const uid = require("uid");

const router = new express.Router();

/*
Each User has a unique ._id attribute in the db.
Each User upon creation also creates a unique profile page (identifir for profile page is a random string called "link" in the db)
Any user can create posts on his or other user's wall.
the post has a unique identifir which is a random string called "uniq_id" in the db.
if you are the page owner (stated via the "ownedBy" field in the db, the ownedBy is the unique User._id string in the db)
you can delete any posts on your wall.
if you are the creator of a post not on your wall - you can also delete it, 
but if you are not the owner you can't delete posts not created by you.
each post has a field in the db called "createdBy" which is the User._id unique field in the db.
the program will check if you are the page owner or not and upon that will decide if you are authorized to do certain actions.

To access a specific profile wall you need to specify the unique "link" field in the URL - domain.com/<link>

To access a specific post you need to specify the unique "link" field in the URL AND the unique "uniq_id" field of the post - domain.com/<link>/<uniq_id>
*/

router.post("/:link/postText", async (req, res) => {
  /* 
  endpoint for POSTING on a user profile page, the identifir for the original poster in the db is the token because it's unique for every user.
  the identifier for the original poster in the textPosts array is the _id in mongodb (also because it's unique for each user) 
  */

  if (!req.body.headline || !req.body.text) {
    return res.status(401).send("Headline and Text are required");
  }

  const token = req.headers.authorization.replace("Bearer", "");
  const link = req.params.link;

  // making sure that the post indeed exists in the db before saving

  const check = await ProfilePage.findOne(
    { link: link.toString() },
    (err, profile) => {
      if (!profile) {
        return;
      }
    }
  );

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
            body_text: req.body.text,
            createdAt: moment(),
            createdBy: original_poster._id,
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

router.delete("/:link/:postId", async (req, res) => {
  /* 
  endpoint for DELETING a single post on a user's wall, the identifir for the original poster in the db is the token because it's unique for every user.
  the identifier for the original poster in the textPosts array is the _id in mongodb (also because it's unique for each user) 
  */

  //checking for existance and validity of token
  if (!req.headers.authorization || !req.params.link || !req.params.postId) {
    //(if token exists at all AND if link is inserted in parameters AND if id is inserted in paramters)
    return res.status(404).send("404 Not found");
  }

  const token = req.headers.authorization.replace("Bearer", "");
  const link = req.params.link.toString();
  const postId = req.params.postId.toString();

  // check if token exists in db and fetch the user
  try {
    const requestingUser = await User.findOne({ token }, (err, profile) => {
      //should return only ._id
      if (!profile) {
        return;
      }
    });

    if (!requestingUser) {
      res.status(500).send("didnt find user via token");
      return;
    }

    // If User found, fetch the profilepage via link in paramters

    const profilePage = await ProfilePage.findOne({ link }, (err, profile) => {
      if (!profile) {
        return;
      }
    });

    if (!profilePage) {
      res.status(500).send("didnt find profile page");
      return;
    }

    // Find the post to delete

    const requestedPost = profilePage.textPosts.find((post) => {
      if (post.uniq_id === postId) {
        return post;
      }
    });

    if (!requestedPost) {
      return res.status(500).send("didnt find requested post");
    }

    // If wall (profile page) and the specified post found, check if the user found attached to token is origin poster or wall owner

    if (requestingUser._id.toString() === profilePage.ownedBy) {
      ProfilePage.findOneAndUpdate(
        { link },
        {
          $pull: {
            textPosts: {
              uniq_id: postId,
            },
          },
        }
      )
        .then(() => {
          return res.status(201).json({
            status: "Success",
            message: "Resources Are Created Successfully (as owner)",
          });
        })
        .catch(() => {
          return res.status(500).json({
            status: "Failed",
            message: "Error",
          });
        });
    } else if (
      requestingUser._id.toString() === requestedPost.createdBy &&
      postId === requestedPost.uniq_id
    ) {
      ProfilePage.findOneAndUpdate(
        { link },
        {
          $pull: {
            textPosts: {
              uniq_id: postId,
            },
          },
        }
      )
        .then(() => {
          return res.status(201).json({
            status: "Success",
            message: "Resources Are Created Successfully (as post creator)",
          });
        })
        .catch(() => {
          return res.status(500).json({
            status: "Failed",
            message: "Error",
          });
        });
    } else {
      return res.status(500).send("Forbbiden.");
    }
  } catch (e) {
    res.status(500).send("Error deleting post");
  }
});

module.exports = router;
