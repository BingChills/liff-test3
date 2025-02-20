import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, points } = await request.json();
    const client = await clientPromise;
    const db = client.db("LinkzPlatform");
    const collection = db.collection("user_info");

    const result = await collection.updateOne(
      { u_id: userId },
      { $inc: { "points.pointA": points } }
    );

    const updatedUser = await collection.findOne({ u_id: userId });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}