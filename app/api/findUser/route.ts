import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { sub } = await request.json();
    const client = await clientPromise;
    const db = client.db("LinkzPlatform");
    const collection = db.collection("user_info");

    const user = await collection.findOne({ u_id: sub });

    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ newUser: true });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}