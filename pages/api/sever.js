import express from "express";
import bodyParser from "body-parser";
//import qs from "qs";
//import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle ID token
app.post("/api/auth", async (req, res) => {
  const { idToken } = req.body;

  res.status(200).send(idToken);

  // const postData = {
  //   id_token: idToken,
  //   client_id: "2006705425", // Channel ID from console
  // };

  // try {
  //   const response = await axios.post(
  //     "https://api.line.me/oauth2/v2.1/verify",
  //     qs.stringify(postData),
  //     {
  //       headers: {
  //         "Content-Type": "x-www-form-urlencoded",
  //       },
  //     }
  //   );

  //   const decodedToken = response.data;

  //   if (!decodedToken) {
  //     return res.status(400).send("Invalid token");
  //   }

  //   res.status(200).send(JSON.stringify(decodedToken));
  // } catch (error) {
  //   console.error(
  //     "Error verifying token:",
  //     error.response ? error.response.data : error.message
  //   );
  //   res.status(400).send("Invalid token");
  // }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
