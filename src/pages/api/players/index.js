import connectDB from "../../../../server/config/db";
import Player from "../../../../server/models/Player";
import { validateLineUser } from "../../../../server/middleware/authMiddleware";

// Connect to DB on first request
connectDB();

// Middleware wrapper for Next.js API routes
const withMiddleware = (middleware) => {
    return (req, res) => {
        return new Promise((resolve, reject) => {
            middleware(req, res, (result) => {
                if (result instanceof Error) {
                    return reject(result);
                }
                return resolve(result);
            });
        });
    };
};

export default async function handler(req, res) {
    // Only allow POST method for this endpoint
    if (req.method === "POST") {
        try {
            // Apply middleware
            await withMiddleware(validateLineUser)(req, res);

            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }

            // Check if player already exists
            const existingPlayer = await Player.findOne({ u_id: userId });

            if (existingPlayer) {
                return res
                    .status(409)
                    .json({ message: "Player already exists" });
            }

            console.log("Creating new player with userId:", userId);

            // Create new player with u_id (LINE user ID)
            const newPlayer = {
                u_id: userId,  // Use u_id instead of userId to match the model
                score: 0,
                point: 0,
                stores: [{ name: "Default Store", point: 0, color: "blue" }],
                selectedStore: {
                    name: "Default Store",
                    point: 0,
                    color: "blue",
                },
                stamina: { current: 20, max: 20 },
                characters: [],
                coupons: [],
            };

            const player = new Player(newPlayer);
            await player.save();

            console.log("Player created successfully:", player._id);
            res.status(201).json(player);
        } catch (error) {
            console.error(`Error in createPlayer: ${error.message}`);
            console.error(error.stack);
            res.status(500).json({
                message: "Server error",
                error: error.message,
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

