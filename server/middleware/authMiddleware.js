/**
 * Middleware to validate Line user ID and tokens
 * Production-ready implementation that verifies LINE tokens
 */
const axios = require('axios');

const validateLineUser = async (req, res, next) => {
    try {
        // Get access token from Authorization header
        const authHeader = req.headers.authorization;
        
        // Get userId from URL params or request body
        const userId = req.params.userId || req.body.userId;
        
        // Check if userId is provided
        if (!userId) {
            return res.status(401).json({ message: "User ID is required" });
        }
        
        // Production environment: Verify token with LINE API
        if (process.env.NODE_ENV === 'production') {
            // If no auth header provided
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: "Authorization token is required" });
            }
            
            const token = authHeader.split(' ')[1];
            
            try {
                // Verify token with LINE API
                const response = await axios.get('https://api.line.me/v2/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                // Check if the userId from token matches the requested userId
                if (response.data.userId !== userId) {
                    return res.status(403).json({ message: "User ID does not match token" });
                }
                
                // Add verified user data to request
                req.lineUser = response.data;
            } catch (error) {
                console.error("LINE API verification error:", error.message);
                return res.status(401).json({ message: "Invalid LINE token" });
            }
        } else {
            // Development environment: Just pass through with minimal validation
            console.log("Development mode: Skipping LINE token verification");
        }
        
        // Add the userId to the request object for use in controllers
        req.userId = userId;
        
        // Continue to the next middleware or controller
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        res.status(401).json({ message: "Authentication failed" });
    }
};

module.exports = {
    validateLineUser,
};
