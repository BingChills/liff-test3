import { NextResponse } from "next/server";
import { UserInformation } from "@/types/types";

export async function GET() {
  return NextResponse.json({ message: "Hello World" });
}

export async function POST(request: Request) {
  const postBody = await request.json();
  const postData = new URLSearchParams();
  postData.append("id_token", postBody.id_token);
  postData.append("client_id", postBody.client_id);

  const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: postData.toString(),
  });

  const decodedToken: UserInformation = await response.json();

  return NextResponse.json(decodedToken);
}

// const postData = new URLSearchParams();
// postData.append("id_token", id_token);
// postData.append("client_id", client_id);

// const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/x-www-form-urlencoded",
//   },
//   body: postData.toString(),
// });

// if (!response.ok) {
//   throw new Error("Network response was not ok");
// }

// const decodedToken = await response.json();
