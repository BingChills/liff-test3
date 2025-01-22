"use client";
import "../styles/globals.css";
import { ReactNode, useState, useEffect } from "react";
import { liff, type Liff } from "@line/liff";
import { LiffProvider } from "./context/LiffContext";
import { get } from "http";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [liffIDToken, setLiffIDToken] = useState<string | null>(null);
  const [liffUserID, setLiffUserID] = useState<string | null>(null);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    // to avoid `window is not defined` error
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        console.log("LIFF init...");
        liff
          .init({
            liffId: "2006705425-ELaRLpLn",
          })
          .then(() => {
            console.log("LIFF init succeeded.");
          })
          .then(() => {
            if (!liff.isLoggedIn()) {
              liff.login(); // ! Local URI from ngrok
              async function getProfile() {
                const profile = await liff.getProfile();
                setLiffUserID(profile.userId);
              }
              getProfile();
            } else {
              setLiffObject(liff);
              setLiffIDToken(liff.getIDToken());
            }
          })
          .catch((error: Error) => {
            console.log("LIFF init failed.", error);
            setLiffError(error.toString());
          });
      });
  }, []);

  const liffContextValue = {
    liff: liffObject,
    liffError,
    liffIDToken,
    liffUserID,
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <LiffProvider value={liffContextValue}>{children}</LiffProvider>
      </body>
    </html>
  );
}
