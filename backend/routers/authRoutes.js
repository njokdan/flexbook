const User = require("../db/models/User");

const validator = require("validator");
const express = require("express");
const jwt = require("jsonwebtoken");
const uid = require("uid");
const moment = require("moment");

const [encryptPass, secret_key] = require("./encryptPass");

const router = new express.Router();

router.get("/tokenBasedProfileCheck", async (req, res) => {
  try {
    if (!req.cookies.blackbook) {
      return res.status(422).send("error");
    }

    let profileFound;

    const userProfile = await User.findOne(
      { token: req.cookies.blackbook },
      "_id, name",
      (err, profile) => {
        if (!profile) {
          profileFound = false;
        } else {
          profileFound = true;
        }
      }
    );

    if (!profileFound) {
      return res.status(422).send("Not found");
    }

    return res.status(200).send("Signed in." + userProfile);

    // return res.status(200).send("nice");
  } catch (e) {
    return res.status(422).send("error");
  }
});

router.post("/signup", async (req, res) => {
  /* User sign up endpoint */

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(422).send({ error: "Missing credentials" });
  }

  if (!validator.isLength(password, { min: 6 })) {
    return res
      .status(422)
      .send({ error: "Password must be 6 characters or more" });
  }

  try {
    const user = new User({
      email: email.toLowerCase(),
      password: await encryptPass(password),
      name,
      userProfile: uid(),
      createdAt: moment().format("dddd, MMMM Do YYYY, H:mm:ss"),
    });

    const token = jwt.sign({ userId: user._id }, secret_key);

    user.token = token;

    await user.save();

    res
      .cookie("blackbook", token, {
        maxAge: Date.now() + 900000,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send("Success");
  } catch (err) {
    return res.status(422).send("User already exists.");
  }
});

router.post("/signin", async (req, res) => {
  /* User sign in endpoint */

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).send({ error: "Must provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(422).send({ error: "Invalid password or email" });
    }

    if ((await encryptPass(password)) === user.password) {
      if (!user.token) {
        const token = jwt.sign({ userId: user._id }, secret_key);
        user.token = token;

        await user.save();
        res
          .cookie("blackbook", token, {
            maxAge: Date.now() + 900000,
            sameSite: true,
            httpOnly: true,
          })
          .status(200)
          .send("Success");
      }

      res
        .cookie("blackbook", user.token, {
          maxAge: Date.now() + 900000,
          sameSite: true,
          httpOnly: true,
        })
        .status(200)
        .send("Success");
    } else {
      return res.status(422).send({ error: "Invalid password or email" });
    }
  } catch (e) {
    res.status(404).send("An error occured");
  }
});

router.get("/signout", (req, res) => {
  res.clearCookie("blackbook").status(200).send("Ok");
});

module.exports = router;
