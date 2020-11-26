const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.ATLAS_URI;

const User = require("../../models/userModel");

router
  .post("/api/users", async (req, res) => {
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
      return res.status(404).json({
        status: 404,
        errorMessage: "First name required.",
      });
    }

    if (req.body.lastName === null) {
      return res.status(404).json({
        status: 404,
        errorMessage: "Last name required.",
      });
    }

    if (req.body.leagueRank === null) {
      return res.status(404).json({
        status: 404,
        errorMessage: "Rank required",
      });
    }

    if (!req.body.email.includes("@")) {
      return res.status(404).json({
        status: 404,
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
      return res.status(404).json({
        status: 404,
        errorMessage: "Invalid password, must include at least 6 characters",
      });
    }

    if (req.body.password !== req.body.password_confirm) {
      return res.status(404).json({
        status: 404,
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
          res.status(200).json({
            status: 200,
            success: true,
            user: newUser,
          });
        })
        .catch((error) => console.log("save error", error));
    }
  })
  .catch((error) => console.log("post error", error));

module.exports = router;
