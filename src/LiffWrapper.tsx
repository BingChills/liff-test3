import { useEffect, useState } from "react";
import { LiffProvider } from "./context/LiffContext";
import type { Liff } from "@line/liff";
import type { User, UserInformation } from "./context/LiffContext";

declare global {
    interface Window {
        liff: Liff;
    }
}

interface LiffWrapperProps {
    children: React.ReactNode;
}

// Function to save user profile data to the database
const saveUserProfileToDatabase = async (userId: string, displayName?: string, profilePicture?: string) => {
    try {
        // Check if a player document already exists with this userId
        const response = await fetch(`/api/players/${userId}`);
        
        if (response.ok) {
            // Player exists, update with LINE profile data
            const updateResponse = await fetch(`/api/players/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    displayName: displayName || 'LINE User',
                    profilePicture: profilePicture || null
                })
            });
            
            if (updateResponse.ok) {
                console.log('Updated player profile with LINE data');
            } else {
                console.error('Failed to update player profile');
            }
        } else {
            // Player doesn't exist yet, create a new document
            console.log('Player document not found, will be created when gameState saves');
        }
    } catch (error) {
        console.error('Error saving profile data to database:', error);
    }
};

const LiffWrapper: React.FC<LiffWrapperProps> = ({ children }) => {
    const [liffObject, setLiffObject] = useState<Liff | null>(null);
    const [liffError, setLiffError] = useState<string | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [lineUserId, setLineUserId] = useState<string | null>(null);

    useEffect(() => {
        const initializeLiff = async () => {
            try {
                const liffId = process.env.NEXT_PUBLIC_LIFF_ID || "2006705425-2we7d4d6";

                if (!liffId) {
                    console.warn("⚠️ Please set your LIFF ID in .env.local file (NEXT_PUBLIC_LIFF_ID)");
                }

                // Import LIFF SDK
                const liff = (await import("@line/liff")).default;
                
                // Initialize LIFF app according to docs
                await liff.init({ liffId })
                    .then(() => {
                        console.log("LIFF initialized successfully");
                        setLiffObject(liff);
                        
                        // Check if user is logged in
                        if (liff.isLoggedIn()) {
                            // Get ID token for verification
                            const token = liff.getIDToken();
                            setIdToken(token);
                            
                            // Get user profile - this is the correct way according to LINE docs
                            liff.getProfile()
                                .then((profile) => {
                                    console.log("User profile obtained", profile);
                                    setProfilePicture(profile.pictureUrl || null);
                                    setUserName(profile.displayName || null);
                                    setLineUserId(profile.userId);
                                    
                                    // Store userId in sessionStorage for other components
                                    sessionStorage.setItem('LINE_USER_ID', profile.userId);
                                    
                                    // Store user profile data in database
                                    saveUserProfileToDatabase(profile.userId, profile.displayName, profile.pictureUrl);
                                })
                                .catch((err) => {
                                    console.error("Error getting profile:", err);
                                });
                        } else {
                            console.log("User not logged in");
                        }
                    })
                    .catch((err) => {
                        console.error("LIFF initialization failed:", err);
                        setLiffError(err.message || "LIFF initialization failed");
                    });
            } catch (error) {
                console.error("Error in LIFF setup:", error);
                setLiffError(error instanceof Error ? error.message : "Unknown error");
            }
        };

        initializeLiff();
    }, []);

    return (
        <LiffProvider
            value={{
                liff: liffObject,
                liffError,
                liffIDToken: idToken,
                profilePicture,
                userName,
                lineUserId,  // Expose the LINE user ID through context
            }}
        >
            {children}
        </LiffProvider>
    );
};

export default LiffWrapper;

