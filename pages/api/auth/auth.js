import e from "express";
import express from "express";
//import qs from "qs";
//import axios from "axios";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/auth", (req, res) => {
  const { idToken } = req.body;
  res.send(`Hello World: ${idToken}`);
});

app.use((res) => {
  res.status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;

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
