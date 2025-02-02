"use client";
import Head from "next/head";
import { UserInformation } from "@/types/types";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useLiff } from "./context/LiffContext";

const Home = () => {
  const { liff, liffError, liffIDToken, liffUserID,liffDecodedIDToken } = useLiff();
  const [userProfile, setUserProfile] = useState<UserInformation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (liffIDToken) {
        try {
          const response = await axios.post("/api/authen", {
            id_token: liffIDToken,
            client_id: "2006705425",
          });
          setUserProfile(response.data);
        } catch (err) {
          const errorMessage = (err as AxiosError).response
            ? (err as AxiosError).response?.data
            : (err as AxiosError).message;
          console.error("API Error:", errorMessage);
          setError("Failed to verify token");
        }
      }
    };
    verifyToken();
  }, [liffIDToken]);

  return (
    <div>
      <Head>
        <title>LIFF App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Profile</h1>

        {liff && <p>LIFF init succeeded.</p>}

        {liffError && (
          <>
            <p>LIFF init failed.</p>
            <p>
              <code>{liffError}</code>
            </p>
          </>
        )}

        {liffIDToken && <p>LIFF ID Token: {liffIDToken}</p>}

        {error && <p>{error}</p>}
        {userProfile && (
          <div>
            <p>Profile:</p>
            <pre>{userProfile.sub}</pre>
          </div>
        )}
        {liffUserID && <p>LIFF User ID: {liffUserID}</p>}
        {liffDecodedIDToken && (
          <div>
            <p>Decoded ID Token:</p>
            <pre>{JSON.stringify(liffDecodedIDToken, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
