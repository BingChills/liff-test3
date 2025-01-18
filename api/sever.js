const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const axios = require("axios");
const qs = require("qs");

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
const uri =
  "mongodb+srv://linkz:linkz2024@linkz.79c2i.mongodb.net/?retryWrites=true&w=majority&appName=Linkz";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a User model
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    userId: String,
    name: String,
    email: String,
  })
);

// Route to handle ID token
app.post("/api/auth", async (req, res) => {
  const { idToken } = req.body;

  try {
    const response = await axios.post(
      "https://api.line.me/oauth2/v2.1/verify",
      qs.stringify({
        id_token: idToken,
        client_id: "2006705425", // Channel ID from console
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const decodedToken = response.data;

    if (!decodedToken) {
      return res.status(400).send("Invalid token");
    }

    const { sub: userId, name, email } = decodedToken;

    // Find or create user
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({ userId, name, email });
      await user.save();
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("Invalid token");
  }
});
