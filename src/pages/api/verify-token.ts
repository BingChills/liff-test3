import { NextApiRequest, NextApiResponse } from "next";
import { UserInformation } from "@/context/LiffContext";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ message: "Hello World" });
  }
  
  if (req.method === "POST") {
    const postBody = req.body;
    const postData = new URLSearchParams();
    postData.append("id_token", postBody.id_token);
    postData.append("client_id", postBody.client_id);

    try {
      const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: postData.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ 
          error: "Failed to verify token", 
          details: errorText 
        });
      }

      const decodedToken: UserInformation = await response.json();
      return res.status(200).json(decodedToken);
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
