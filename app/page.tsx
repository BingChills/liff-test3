"use client";
import Head from "next/head";
import { UserInformation, UserFromDB } from "@/types/types";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useLiff } from "./context/LiffContext";
import { useRouter } from "next/navigation";

const Home = () => {
  const { liff, liffError, liffIDToken, liffDecodedIDToken } = useLiff();
  const [userProfile, setUserProfile] = useState<UserInformation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dummyUserFromDB, setDummyUserFromDB] = useState<UserFromDB | null>(null);
  const router = useRouter();

  const dummyUser: UserInformation = {
    iss: "11",
    sub: "test_user_id",
    aud: "33",
    exp: 0,
    iat: 0,
    amr: [],
    name: "test_user_name",
    picture: "https://profile.line-scdn.net/0hzFRzNIDqJWlvAzXWdJ1aPlNGKwQYLSMhFzJiWk8BcltCNWo6AGE4CB4DclkVNzc2UGY5W04Lf1sR"
  };

  // verifyToken function
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

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (dummyUser) {
          const response = await axios.post("/api/createUser", dummyUser);
          const user = response.data;
          setDummyUserFromDB(user);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to fetch user profile");
      }
    };
    getProfile();
  }, []);

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

        {userProfile && (
          <div>
            <h2>User Profile</h2>
            <img src={userProfile.picture} alt={userProfile.name} className="w-24 h-24 rounded-full" />
            <p>Name: {userProfile.name}</p>
            <pre>{JSON.stringify(userProfile, null, 2)}</pre>
          </div>
        )}

        {dummyUserFromDB && (
          <div>
            <h2>Dummy User from DB</h2>
            <img src={dummyUserFromDB.profile_picture} alt={dummyUserFromDB.username} className="w-24 h-24 rounded-full" />
            <p>Name: {dummyUserFromDB.username}</p>
            <pre>{JSON.stringify(dummyUserFromDB, null, 2)}</pre>
          </div>
        )}

        {liffDecodedIDToken && (<div>
          <h2>Decoded ID Token</h2>
          <pre>{JSON.stringify(liffDecodedIDToken, null, 2)}</pre>
        </div>)
    }

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={() => router.push('/main')} className="btn">
          Go to Inventory
        </button>
      </main>
    </div>
  );
};

export default Home;
