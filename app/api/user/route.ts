import { NextResponse } from "next/server";
import mongoose from "mongoose";
//import { UserInformation } from "@/types/types";

// Connect to MongoDB
const uri =
  "mongodb+srv://linkz:linkz2024@linkz.79c2i.mongodb.net/?retryWrites=true&w=majority&appName=Linkz";
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Define a User model
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export async function POST(request: Request) {
  const { userId, name, email } = await request.json();
  console.log("Received data:", { userId, name, email });

  try {
    // Check if user already exists
    let user = await User.findOne({ userId });
    if (user) {
      console.log("User already exists:", user);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create a new user
    user = new User({ userId, name, email });
    await user.save();
    console.log("New user created:", user);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.log("Error inserting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
