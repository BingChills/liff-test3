import { useEffect, useState, createContext } from "react";
import { LiffProvider } from "./context/LiffContext";
import type { Liff } from "@line/liff";
import type { User, UserInformation } from "./context/LiffContext";

// Function to perform a full logout and reset permissions
export const resetLiffPermissions = () => {
    try {
        // Clear session storage
        sessionStorage.clear();
        
        // Clear all local storage items related to LIFF
        Object.keys(localStorage).forEach(key => {
            if (key.includes('liff') || key.includes('LINE')) {
                localStorage.removeItem(key);
            }
        });

        // Force reload to completely reset the application state
        window.location.reload();
    } catch (error) {
        console.error('Error resetting permissions:', error);
    }
};

declare global {
    interface Window {
        liff: Liff;
        LINE_USER_ID?: string;  // Add LINE_USER_ID to Window interface
    }
}

interface LiffWrapperProps {
    children: React.ReactNode;
}

const LiffWrapper: React.FC<LiffWrapperProps> = ({ children }) => {
    // Check for reset flag in URL
    useEffect(() => {
        const url = new URL(window.location.href);
        const resetParam = url.searchParams.get('reset');
        
        if (resetParam === 'true') {
            console.log('Reset parameter detected, logging out and clearing data...');
            // Clear URL parameter first
            url.searchParams.delete('reset');
            window.history.replaceState({}, document.title, url.toString());
            
            // Then perform reset
            resetLiffPermissions();
        }
    }, []);
    const [liffObject, setLiffObject] = useState<Liff | null>(null);
    const [liffError, setLiffError] = useState<string | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);
    const [decodedToken, setDecodedToken] = useState<UserInformation | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    
    // Create an event context to allow other components to react to LIFF initialization
    // We can't use gameState directly here to avoid circular dependencies
    const [lineUserId, setLineUserId] = useState<string | null>(null);

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
                                
                                // Store the LINE userId for other components to access
                                console.log("Setting LINE userId in wrapper state:", profile.userId);
                                setLineUserId(profile.userId);
                                
                                // Use sessionStorage instead of window for better persistence
                                // This avoids TypeScript errors and provides better data storage
                                try {
                                    sessionStorage.setItem('LINE_USER_ID', profile.userId);
                                    console.log('Stored LINE_USER_ID in sessionStorage');
                                } catch (err) {
                                    console.error('Failed to store LINE_USER_ID:', err);
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
                lineUserId,  // Expose the LINE user ID through context
                resetPermissions: resetLiffPermissions, // Add reset function to context
            }}
        >
            {children}
        </LiffProvider>
    );
};

export default LiffWrapper;

