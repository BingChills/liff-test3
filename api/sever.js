const express = require("express");
const bodyParser = require("body-parser");
const qs = require("qs");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle ID token
app.post("/api/auth", async (req, res) => {
  const { idToken } = req.body;

  const postData = {
    id_token: idToken,
    client_id: "2006705425", // Channel ID from console
  };

  try {
    const response = await axios.post(
      "https://api.line.me/oauth2/v2.1/verify",
      qs.stringify(postData),
      {
        headers: {
          "Content-Type": "x-www-form-urlencoded",
        },
      }
    );

    const decodedToken = response.data;

    if (!decodedToken) {
      return res.status(400).send("Invalid token");
    }

    res.status(200).send(JSON.stringify(decodedToken));
  } catch (error) {
    res.status(400).send("Invalid token");
  }
});
