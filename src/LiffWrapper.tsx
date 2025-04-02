import { useEffect, useState } from "react";
import { LiffProvider } from "./context/LiffContext";
import type { Liff } from "@line/liff";
import type { User, UserInformation } from "./context/LiffContext";
import { useGameState } from "./state/gameState";

declare global {
    interface Window {
        liff: Liff;
    }
}

interface LiffWrapperProps {
    children: React.ReactNode;
}

const LiffWrapper: React.FC<LiffWrapperProps> = ({ children }) => {
    const [liffObject, setLiffObject] = useState<Liff | null>(null);
    const [liffError, setLiffError] = useState<string | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);
    const [decodedToken, setDecodedToken] = useState<UserInformation | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    
    // Access game state to set user ID when LIFF initializes
    // This is important to connect the LINE auth flow with your game database
    const { setUserId } = useGameState ? useGameState() : { setUserId: () => {} };

    useEffect(() => {
        const initializeLiff = async () => {
            try {
                const liffId =
                    process.env.NEXT_PUBLIC_LIFF_ID || "2006705425-2we7d4d6";

                if (!liffId) {
                    console.warn(
                        "⚠️ Please set your LIFF ID in .env.local file (NEXT_PUBLIC_LIFF_ID)"
                    );
                    console.warn(
                        "⚠️ Using placeholder LIFF ID for now, profile picture may not work"
                    );
                }

                const liff = (await import("@line/liff")).default;
                await liff.init({ liffId });
                setLiffObject(liff);

                // Perform complete initialization and get user profile
                if (liff.isLoggedIn()) {
                    try {
                        // Get ID token 
                        const token = liff.getIDToken();
                        setIdToken(token);
                        
                        // Get user profile directly from LIFF
                        liff.getProfile()
                            .then((profile) => {
                                console.log("LIFF profile loaded:", profile);
                                setProfilePicture(profile.pictureUrl || null);
                                setUserName(profile.displayName || null);
                                
                                // Important: Set the LINE userId in game state
                                // This triggers the database operations
                                if (setUserId) {
                                    console.log("Setting userId in game state:", profile.userId);
                                    setUserId(profile.userId);
                                }
                            })
                            .catch((err) => {
                                console.error("Error getting LIFF profile:", err);
                            });
                            
                        console.log("LIFF initialized and logged in");
                    } catch (error) {
                        console.error("Error during LIFF initialization:", error);
                    }
                } else {
                    console.log("User is not logged in, cannot get profile");
                }
            } catch (error) {
                console.error("Error initializing LIFF:", error);
                setLiffError(
                    error instanceof Error ? error.message : "Unknown error"
                );
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
                liffDecodedIDToken: decodedToken,
                user,
                profilePicture,
                userName,
                setUser,
            }}
        >
            {children}
        </LiffProvider>
    );
};

export default LiffWrapper;

