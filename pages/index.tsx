import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

interface UserProfile {
  userId: string;
  name: string;
  email: string;
}

const Home: NextPage<{ liff: Liff | null; liffError: string | null; liffIDToken: string | null }> = ({
  liff,
  liffError,
  liffIDToken
}) => {

  // Post liffIDToken to server to verify
  // Get decoded token (user profile) from server

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (liffIDToken) {
        try {
          const response = await axios.post('/api/auth', { idToken: liffIDToken });
          setUserProfile(response.data);
        } catch {
          setError('Failed to verify token');
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

        {error && <p>{error}</p>}
        {userProfile && (
          <div>
            <p>User ID: {userProfile.userId}</p>
            <p>Name: {userProfile.name}</p>
            <p>Email: {userProfile.email}</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default Home;
