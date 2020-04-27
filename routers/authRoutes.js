const User = require("../db/models/User");

const validator = require("validator");
const express = require("express");
const jwt = require("jsonwebtoken");

const [encryptPass, secret_key] = require("./encryptPass");

const router = new express.Router();

router.post("/signup", async (req, res) => {
  /* User sign up endpoint */

  const { email, password, name } = req.body;

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
    });

    const token = jwt.sign({ userId: user._id }, secret_key);

    user.token = token;

    await user.save();

    res.send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
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
        res.cookie("blackbook", token, {
          maxAge: 900000,
          httpOnly: true, // check with front end // // check with front end //// check with front end //// check with front end //// check with front end //
        });
        res.send({ token });
      }

      res.send({ token: user.token });
    } else {
      return res.status(422).send({ error: "Invalid password or email" });
    }
  } catch (e) {
    res.status(404).send("An error occured");
  }
});

module.exports = router;
