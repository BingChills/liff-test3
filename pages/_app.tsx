import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { Liff } from "@line/liff";
import { useState, useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [liffIDToken, setLiffIDToken] = useState<string | null>(null);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    // to avoid `window is not defined` error
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        console.log("LIFF init...");
        liff
          .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID!
           })
          .then(() => {
            console.log("LIFF init succeeded.");
          })
          .then(() => {
          if (!liff.isLoggedIn()) {
            liff.login({ redirectUri: process.env.NEXT_PUBLIC_LOCAL_URI! }); // ! Local URI from ngrok
          } else {
            setLiffObject(liff);
            setLiffIDToken(liff.getIDToken());
          }
          })
          .catch((error: Error) => {
            console.log("LIFF init failed.");
            setLiffError(error.toString());
          });
      });
  }, []);




  // Provide `liff` object and `liffError` object
  // to page component as property
  pageProps.liff = liffObject;
  pageProps.liffError = liffError;
  pageProps.liffIDToken = liffIDToken;
  return <Component {...pageProps} />;
}

export default MyApp;
