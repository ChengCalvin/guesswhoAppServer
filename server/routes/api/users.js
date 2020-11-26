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
  });
  try {
    const isUserInDB = await User.exists({ "user.email": req.body.email });
    console.log("user in DB?: ", isUserInDB);

    if (req.body.firstName === null) {
      console.log("error first name");
      return res.status(400).json({
        status: 400,
        errorMessage: "First name required.",
      });
    }

    if (req.body.lastName === null) {
      console.log("error last name");
      return res.status(400).json({
        status: 400,
        errorMessage: "Last name required.",
      });
    }

    if (req.body.leagueRank === null) {
      console.log("error league rank");
      return res.status(400).json({
        status: 400,
        errorMessage: "Rank required",
      });
    }

    if (!req.body.email.includes("@")) {
      console.log("error email invalid");
      return res.status(400).json({
        status: 400,
        errorMessage: "Invalid email",
      });
    }

    if (isUserInDB && req.body.email !== null) {
      console.log("error email exists");
      return res.status(400).json({
        status: 400,
        errorMessage: "Email Taken",
      });
    }

    if (req.body.password === null || req.body.password.length < 6) {
      console.log("error password < 6");
      return res.status(400).json({
        status: 400,
        errorMessage: "Invalid password, must include at least 6 characters",
      });
    }

    if (req.body.password !== req.body.password_confirm) {
      console.log("error password dont match");
      return res.status(400).json({
        status: 400,
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
      newUser.save().then(() => {
        res.status(200).json({
          status: 200,
          success: true,
          user: newUser,
        });
      });
    }
  } catch (error) {
    res.status(500).json({ status: 500, errorMessage: error.errorMessage });
  }
});

module.exports = router;
