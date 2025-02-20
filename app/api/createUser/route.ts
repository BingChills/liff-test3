import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("LinkzPlatform");
    const collection = db.collection("user_info");

    const documents = await collection.find({}).toArray();

    return NextResponse.json(documents);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  try {
    const { sub, name, picture } = await request.json();
    const client = await clientPromise;
    const db = client.db("LinkzPlatform");
    const collection = db.collection("user_info");

    // Insert a new user
    const newUser = {
      u_id: sub,
      username: name,
      profile_picture: picture,
      points: {
        pointA: 100,
        pointB: 200,
        pointC: 300,
      },
      pets_owned: ["pet_id_1", "pet_id_2", "pet_id_3"],
      pets_equipped: ["pet_id_1", "pet_id_2", "pet_id_3"],
    };

    const result = await collection.insertOne(newUser);

    // Query the newly created user
    const user = await collection.findOne({ u_id: sub });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}