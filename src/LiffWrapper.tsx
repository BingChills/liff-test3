import { useEffect, useState, useCallback } from "react";
import { LiffProvider } from "./context/LiffContext";
import type { Liff } from "@line/liff";
import type { User, UserInformation } from "./context/LiffContext";
import { revokeLineToken } from "./utils/liffUtils";
import { createOrFetchUser } from "./utils/userApiService";

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
    const [decodedToken, setDecodedToken] = useState<UserInformation | null>(
        null
    );
    const [user, setUser] = useState<User | null>(null);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

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

                // Just perform basic initialization
                if (liff.isLoggedIn()) {
                    try {
                        // Get ID token and profile
                        const token = liff.getIDToken();
                        setIdToken(token);
                        console.log("LIFF initialized and logged in");
                        
                        // Get user profile
                        const profile = await liff.getProfile();
                        setProfilePicture(profile.pictureUrl || null);
                        setUserName(profile.displayName || null);
                        console.log("Got LINE profile:", profile);
                        
                        // Create or fetch user in database
                        if (profile.userId) {
                            console.log("Creating/fetching user with LINE ID:", profile.userId);
                            const userData = await createOrFetchUser(profile.userId);
                            if (userData) {
                                setUser(userData);
                                console.log("User data loaded:", userData);
                            } else {
                                console.error("Failed to create/fetch user");
                            }
                        } else {
                            console.error("No userId in LINE profile");
                        }
                    } catch (error) {
                        console.error("Error initializing LIFF:", error);
                    }
                } else {
                    console.log("User is not logged in");
                    // Optionally: Redirect to login
                    // liff.login();
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
