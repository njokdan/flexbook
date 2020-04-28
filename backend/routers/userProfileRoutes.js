const User = require("../db/models/User");

const express = require("express");

const router = new express.Router();

router.get("/:profileId", async (req, res) => {
  /* 
    Get user profile, private method. only the user can get its own profile
    returns name and email
    */

  const token = req.headers.authorization.replace("Bearer", "");
  const profileId = req.params.profileId.toString();

  const userProfile = await User.findOne(
    { token: token.toString(), userProfile: profileId },
    "email, name",
    (err, profile) => {
      if (!profile) {
        return;
      }
    }
  );

  if (!userProfile) {
    res.status(404).send("Not found");
    return;
  }

  res.status(200).send(userProfile);
});

router.put("/userprofileupdate/:userProfileId/update", async (req, res) => {
  /* 
    endpoint for updating user profile info such:
    name
*/

  //check token validity

  const token = req.headers.authorization.replace("Bearer", "");

  const requestingUser = await User.findOne(
    { token },
    "_id",
    (err, profile) => {
      if (!profile) {
        return;
      }
    }
  );

  if (!requestingUser) {
    res.status(500).send("Error");
    return;
  }

  //if token is valid, update user profile with given params

  try {
    User.findOneAndUpdate(
      { _id: requestingUser._id },
      {
        $set: {
          name: req.body.name.toString(),
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
    return res.status(500).json({
      status: "Failed",
      message: "Error",
    });
  }
});

module.exports = router;
