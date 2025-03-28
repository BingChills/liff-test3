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

const LiffWrapper: React.FC<LiffWrapperProps> = ({ children }) => {
    const [liffObject, setLiffObject] = useState<Liff | null>(null);
    const [liffError, setLiffError] = useState<string | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);
    const [decodedToken, setDecodedToken] = useState<UserInformation | null>(null);
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

                // Get user profile directly if logged in - following LINE docs
                if (liff.isLoggedIn()) {
                    try {
                        // Get ID token and set it
                        const token = liff.getIDToken();
                        setIdToken(token);
                        
                        // Get profile directly without token verification
                        // This follows the recommended approach from LINE's documentation
                        const profile = await liff.getProfile();
                        
                        // Store profile data at the app level to avoid reloading
                        setProfilePicture(profile.pictureUrl || null);
                        setUserName(profile.displayName || null);
                        
                        // Create a simplified user info object
                        const userInfo: UserInformation = {
                            iss: "",
                            sub: profile.userId,
                            aud: "",
                            exp: 0,
                            iat: 0,
                            amr: [],
                            name: profile.displayName,
                            picture: profile.pictureUrl || ""
                        };
                        
                        setDecodedToken(userInfo);
                        console.log("Profile loaded successfully:", profile.displayName);
                    } catch (error) {
                        console.error("Error getting profile:", error);
                    }
                } else {
                    console.log("User is not logged in");
                    // If running locally, you might want to consider logging in
                    // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
                    //   liff.login();
                    // }
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

