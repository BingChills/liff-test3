const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const axios = require("axios");

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
      {
        id_token: idToken,
        client_id: "2006705425", // Channel ID from console
      }
    );

    const decodedToken = response.data;

    if (!decodedToken) {
      return res.status(400).send("Invalid token");
    }

    res.status(200).send(decodedToken);
  } catch (error) {
    res.status(400).send("Invalid token");
  }
});
