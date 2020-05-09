const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // help connect everything to mongodb

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

let gameSchema = new mongoose.Schema(
  {
    teamA: Array,
    teamB: Array,
    winner: String,
  },
  {
    writeConcern: {
      w: "majority",
      j: true,
      wtimeout: 1000,
    },
  }
);
let Game = mongoose.model("Game", gameSchema, "game");

//query the database,get object
//next step get random data
app.get("/gamedata", (req, res) => {
  Game.find({}, function (err, Game) {
    console.log(err);
  }).then((result) => {
    if (result.length != 0) {
      res.send(result[Math.floor(Math.random() * result.length) + 1]);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
