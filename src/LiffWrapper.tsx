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
    const [decodedToken, setDecodedToken] = useState<UserInformation | null>(
        null
    );
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Initialize LIFF
        console.log("Initializing LIFF...");

        const initializeLiff = async () => {
            try {
                const liffId =
                    process.env.NEXT_PUBLIC_LIFF_ID || "2006705425-2we7d4d6";

                if (!process.env.NEXT_PUBLIC_LIFF_ID) {
                    console.warn(
                        "⚠️ Please set your LIFF ID in .env.local file (NEXT_PUBLIC_LIFF_ID)"
                    );
                    console.warn(
                        "⚠️ Using placeholder LIFF ID for now, profile picture may not work"
                    );
                }

                const liff = (await import("@line/liff")).default;
                await liff.init({ liffId });
                console.log("LIFF initialized successfully");

                setLiffObject(liff);

                // Get ID token if user is logged in
                if (liff.isLoggedIn()) {
                    console.log("User is logged in");
                    const token = liff.getIDToken();
                    setIdToken(token);

                    // Verify token on backend to get decoded info
                    if (token) {
                        try {
                            const response = await fetch("/api/verify-token", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ token }),
                            });

                            const data = await response.json();
                            if (data.decoded) {
                                setDecodedToken(data.decoded);
                                console.log("Decoded token:", data.decoded);
                            }
                        } catch (error) {
                            console.error("Error verifying token:", error);
                        }
                    }
                } else {
                    console.log("User is not logged in");
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
                setUser,
            }}
        >
            {children}
        </LiffProvider>
    );
};

export default LiffWrapper;

