require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const playerRoutes = require("./routes/playerRoutes");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/players", playerRoutes);

// Base route for API health check
app.get("/api", (req, res) => {
    res.json({ message: "API is running" });
});

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static("public"));
}

// Check if this is being run directly (local dev) or as a module (Vercel)
if (require.main === module) {
    // Set port for local development
    const PORT = process.env.PORT || 5000;
    
    // Start server locally
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
} else {
    // Export for serverless use
    module.exports = app;
}
