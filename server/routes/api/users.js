const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.ATLAS_URI;

const User = require("../../models/userModel");

router.post("/api/users", async (req, res) => {
  const db = await mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });

  const newUser = new User({
    user: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      leagueRank: req.body.leagueRank,
      email: req.body.email,
      password: req.body.password,
      password_confirm: req.body.password_confirm,
    },
  });

  const isUserInDB = await User.exists({ "user.email": req.body.email });
  console.log("test result yes?: ", isUserInDB);

  if (req.body.firstName === null) {
    return res.json({
      errorMessage: "First name required.",
    });
  }

  if (req.body.lastName === null) {
    return res.json({
      errorMessage: "Last name required.",
    });
  }

  if (req.body.leagueRank === null) {
    return res.json({
      errorMessage: "Rank required",
    });
  }

  if (!req.body.email.includes("@")) {
    return res.json({
      errorMessage: "Invalid email",
    });
  }

  if (isUserInDB && req.body.email !== null) {
    return res.status(404).json({
      status: 404,
      errorMessage: "Email Taken",
    });
  }

  if (req.body.password === null || req.body.password.length < 6) {
    return res.json({
      errorMessage: "Invalid password, must include at least 6 characters",
    });
  }

  if (req.body.password !== req.body.password_confirm) {
    return res.json({
      errorMessage: "Password don't match",
    });
  }
  const validUser =
    req.body.firstName !== null &&
    req.body.lastName !== null &&
    req.body.leagueRank !== null &&
    req.body.email.includes("@") &&
    !isUserInDB &&
    req.body.password !== null &&
    req.body.password === req.body.password_confirm;

  if (validUser) {
    newUser
      .save()
      .then(() => {
        res.json({ success: true });
      })
      .catch((error) => console.log(error));
  }
});

module.exports = router;
