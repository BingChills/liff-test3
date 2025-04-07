require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const playerRoutes = require("./routes/playerRoutes");
const debugRoutes = require("./routes/debugRoutes");

// Initialize Express app
const app = express();

// Connect to MongoDB with enhanced error handling
console.log('🔌 Attempting to connect to MongoDB...');
try {
    connectDB().then(connection => {
        if (connection) {
            console.log('✅ MongoDB connected successfully!');
            global.mongoConnected = true;
        } else {
            console.error('❌ Failed to establish MongoDB connection');
            global.mongoConnected = false;
        }
    }).catch(err => {
        console.error('❌ MongoDB connection error:', err);
        global.mongoConnected = false;
    });
} catch (error) {
    console.error('❌ Unexpected error during MongoDB connection:', error);
    global.mongoConnected = false;
}

// Simple CORS configuration - less restrictive for Vercel deployment where frontend and backend are together
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
   console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
   next();
});

// JSON and URL encoded parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/players", playerRoutes);
app.use("/api/debug", debugRoutes);

// Enhanced base route for API health check with MongoDB status
app.get("/api", (req, res) => {
    res.json({ 
        message: "API is running",
        mongoConnected: global.mongoConnected === true,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
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
