import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("Received request to find user");
    const { sub } = await request.json();
    console.log("Parsed request body:", sub);

    const client = await clientPromise;
    console.log("Connected to MongoDB");

    const db = client.db("LinkzPlatform");
    const collection = db.collection("user_info");

    console.log("Querying database for user:", sub);
    const user = await collection.findOne({ u_id: sub });

    if (user) {
      console.log("User found:", user);
      return NextResponse.json(user);
    } else {
      console.log("User not found, returning newUser flag");
      return NextResponse.json({ newUser: true });
    }
  } catch (error) {
    console.error("Error in findUser route:", error);
    return NextResponse.error();
  }
}