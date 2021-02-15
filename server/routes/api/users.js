const express = require("express");
const router = express.Router();
require("dotenv").config();

const User = require("../../models/userModel");

router.post("/api/users/", async (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    leagueRank: req.body.leagueRank,
    email: req.body.email,
    password: req.body.password,
    password_confirm: req.body.password_confirm,
    gameScore: req.body.gameScore,
  });
  try {
    const isUserInDB = await User.exists({ "user.email": req.body.email });

    if (req.body.firstName === null) {
      return res.status(400).json({
        status: 400,
        errorMessage: "First name required.",
      });
    }

    if (req.body.lastName === null) {
      return res.status(400).json({
        status: 400,
        errorMessage: "Last name required.",
      });
    }

    if (req.body.leagueRank === null) {
      return res.status(400).json({
        status: 400,
        errorMessage: "Rank required",
      });
    }

    if (!req.body.email.includes("@")) {
      return res.status(400).json({
        status: 400,
        errorMessage: "Invalid email",
      });
    }

    if (isUserInDB && req.body.email !== null) {
      return res.status(400).json({
        status: 400,
        errorMessage: "Email Taken",
      });
    }

    if (req.body.password === null || req.body.password.length < 6) {
      return res.status(400).json({
        status: 400,
        errorMessage: "Invalid password, must include at least 6 characters",
      });
    }

    if (req.body.password !== req.body.password_confirm) {
      return res.status(400).json({
        status: 400,
        errorMessage: "Password don't match",
      });
    }

    newUser.save().then(() => {
      res.status(200).json({
        status: 200,
        success: true,
        user: newUser,
      });
    });
  } catch (error) {
    res.status(500).json({ status: 500, errorMessage: error.errorMessage });
  }
});

router.patch("/api/users/:email", (req, _res) => {
  User.findOneAndUpdate(
    { email: req.body.email },
    { $set: { gameScore: req.body.gameScore } },
    { upsert: true },
    (err, results) => {
      if (err) console.log(err);
      else console.log(results);
    }
  );
});

router.get("/users/:email", (req, res) => {
  User.findOne({ email: req.params.email }, (_error, loginUser) => {
    if (loginUser && loginUser.email === req.params.email) {
      res.status(200).json({ loginUser });
    } else {
      res.status(400).json({ errorMessage: "Invalid email or password" });
    }
  });
});

module.exports = router;
