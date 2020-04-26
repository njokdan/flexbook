const express = require("express");
const User = require("../db/models/User");
const jwt = require("jsonwebtoken");

const router = new express.Router();


router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });

    const saveUser = await user.save();

    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");

    res.send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "must provide email and password" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(422).send({ error: "invalid password or email" });
  }

  if (user.password === password) {
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });
  } else {
    return res.status(422).send({ error: "invalid password or email" });
  }
});

module.exports = router;
