import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import jwt from "jsonwebtoken";

const Home: NextPage<{ liff: Liff | null; liffError: string | null; liffIDToken: string | null }> = ({
  liff,
  liffError,
  liffIDToken
}) => {
  let decodedToken: any = null;
  if (liffIDToken) {
    decodedToken = jwt.decode(liffIDToken);
  }
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

        {liffIDToken && (
          <>
            <p>LIFF ID Token: {liffIDToken}</p>
            <p>decodedToken: {JSON.stringify(decodedToken)}</p>
          </>
        )}

        {liffError && (
          <>
            <p>LIFF init failed.</p>
            <p>
              <code>{liffError}</code>
            </p>
          </>
        )}
        
        <a
          href="https://developers.line.biz/ja/docs/liff/"
          target="_blank"
          rel="noreferrer"
        >
          LIFF Documentation
        </a>
      </main>
    </div>
  );
};

export default Home;
