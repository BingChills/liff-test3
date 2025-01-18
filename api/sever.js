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
        id_token:
          "eyJraWQiOiJjY2Q1OGMyZjI2NDZmNDVmZTBiNGJiYjAyMzdkNjJmMGRkN2JiMTY2OWQ0MGMxMjFiODQ4OGYxMGJmMzYzOTAwIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2FjY2Vzcy5saW5lLm1lIiwic3ViIjoiVTA1OTkwYWY1MTU5N2YwNmVmNDI5M2NjMjc4NGEwYzk3IiwiYXVkIjoiMjAwNjcwNTQyNSIsImV4cCI6MTczNzE4NjY4MywiaWF0IjoxNzM3MTgzMDgzLCJhbXIiOlsibGluZXNzbyJdLCJuYW1lIjoiVCIsInBpY3R1cmUiOiJodHRwczovL3Byb2ZpbGUubGluZS1zY2RuLm5ldC8waHpGUnpOSURxSldsdkF6WFdkSjFhUGxOR0t3UVlMU01oRnpKaVdrOEJjbHRDTldvNkFHRTRDQjREY2xrVk56YzJVR1k1VzA0TGYxc1IifQ.de4-vBYUC6lInNTDVxbp9ByUd8NzWJCJNPZyGdxcTcARmhvtT60Ms_bR3DOH0Jl8OAftkWewDyQseKrwTAgA3g",
        client_id: "2006705425", // Channel ID from console
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
