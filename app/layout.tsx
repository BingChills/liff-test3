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


  useEffect(() => {
        console.log("LIFF init...");
        liff
          .init({
            liffId: "2006705425-ELaRLpLn",
          })
          .then(() => {
            console.log("LIFF init succeeded.");
            const decodedIDToken = liff.getDecodedIDToken();
            setLiffDecodedIDToken(decodedIDToken as UserInformation);
          })
          .then(() => {
            if (!liff.isLoggedIn()) {
              liff.login();
            } else {
              setLiffObject(liff);
              setLiffIDToken(liff.getIDToken());
            }
          })
          .catch((error: Error) => {
            console.log("LIFF init failed.", error);
            setLiffError(error.toString());
          });
  }, []);

  const liffContextValue = {
    liff: liffObject,
    liffError,
    liffIDToken,
    liffDecodedIDToken,
  };

  return (
    <html lang="en">
      <body>
        <LiffProvider value={liffContextValue}>{children}</LiffProvider>
      </body>
    </html>
  );
}
