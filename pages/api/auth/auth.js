import qs from "qs";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
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
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const decodedToken = response.data;

      if (!decodedToken) {
        return res.status(400).send("Invalid token");
      }

      res.status(200).json(decodedToken);
    } catch (error) {
      console.error(
        "Error verifying token:",
        error.response ? error.response.data : error.message
      );
      res.status(400).send("Invalid token");
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
