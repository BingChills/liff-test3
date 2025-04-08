// Specific page for handling LIFF URLs
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';

const inter = Inter({ subsets: ['latin'] });

// Import App without SSR to avoid hydration issues
const AppWithoutSSR = dynamic(() => import('@/App'), { ssr: false });

export default function LiffPage() {
  const router = useRouter();

  // This component renders the same content as the home page
  // It's just a separate route to handle LIFF URLs
  return (
    <>
      <Head>
        <title>Linkz</title>
        <meta name="description" content="Linkz gameplay" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <AppWithoutSSR />
      </main>
    </>
  );
}
