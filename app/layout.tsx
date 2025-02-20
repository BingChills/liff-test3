"use client";
import "../styles/globals.css";
import { ReactNode, useState, useEffect } from "react";
import { type Liff } from "@line/liff";
import { LiffProvider } from "./context/LiffContext";
import { UserInformation } from "@/types/types";
import liff from "@line/liff";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [liffIDToken, setLiffIDToken] = useState<string | null>(null);
  const [liffDecodedIDToken, setLiffDecodedIDToken] = useState<UserInformation | null>(null);
  const [user, setUser] = useState<any>(null);

  // LIFF initialization
  useEffect(() => {
    console.log("LIFF init...");
    liff
      .init({
        liffId: "2006705425-ELaRLpLn",
      })
      .then(() => {
        console.log("LIFF init succeeded.");
        const decodedIDToken = liff.getDecodedIDToken();
        console.log("Decoded ID Token:", decodedIDToken);
        setLiffDecodedIDToken(decodedIDToken as UserInformation);
      })
      .then(() => {
        if (!liff.isLoggedIn()) {
          console.log("User not logged in, redirecting to login...");
          liff.login();
        } else {
          console.log("User is logged in.");
          setLiffObject(liff);
          setLiffIDToken(liff.getIDToken());
        }
      })
      .catch((error: Error) => {
        console.log("LIFF init failed.", error);
        setLiffError(error.toString());
      });
  }, []);

  // Function to find or create a user in your database
  const findOrCreateUser = async (sub: string, name: string, picture: string) => {
    try {
      console.log("Finding user...");
      // Find user
      const findResponse = await fetch("/api/findUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sub }),
      });
      const findResult = await findResponse.json();
      console.log("Find user result:", findResult);

      if (findResult.newUser) {
        console.log("User not found, creating new user...");
        // Create user if not found
        const createResponse = await fetch("/api/createUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sub, name, picture }),
        });
        const createResult = await createResponse.json();
        console.log("Create user result:", createResult);
        return createResult;
      } else {
        console.log("User found:", findResult);
        return findResult;
      }
    } catch (error) {
      console.error("Error finding or creating user:", error);
    }
  };

  // Function to update user points
  const updateUserPoints = async (userId: string, points: number) => {
    try {
      console.log(`Updating user points for userId: ${userId}, points: ${points}`);
      const response = await fetch("/api/updateUserPoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, points }),
      });
      const result = await response.json();
      console.log("Update user points result:", result);
      return result;
    } catch (error) {
      console.error("Error updating user points:", error);
    }
  };

  // Once the LIFF decoded ID token is available, use its data to find or create the user.
  useEffect(() => {
    if (liffDecodedIDToken) {
      const { sub, name, picture } = liffDecodedIDToken;
      console.log("Decoded ID Token available, finding or creating user...");
      findOrCreateUser(sub, name, picture).then((dbUser) => {
        console.log("User found/created:", dbUser);
        setUser(dbUser);

        // Extract query parameter and update points
        const urlParams = new URLSearchParams(window.location.search);
        const points = parseInt(urlParams.get("points") || "0", 10);
        if (points > 0) {
          console.log(`Points query parameter found: ${points}, updating user points...`);
          updateUserPoints(dbUser.u_id, points).then((updatedUser) => {
            console.log("User points updated:", updatedUser);
            setUser(updatedUser);
          });
        }
      });
    }
  }, [liffDecodedIDToken]);

  const liffContextValue = {
    liff: liffObject,
    liffError,
    liffIDToken,
    liffDecodedIDToken,
    user,
    setUser,
  };

  return (
    <html lang="en">
      <body>
        <LiffProvider value={liffContextValue}>
          {children}
        </LiffProvider>
      </body>
    </html>
  );
}
