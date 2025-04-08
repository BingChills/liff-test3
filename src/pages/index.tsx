import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

const AppWithoutSSR = dynamic(() => import('@/App'), { ssr: false });

export default function Home() {
    // This useEffect helps ensure LIFF integration works properly
    useEffect(() => {
        // Check if we're in a production environment and not using HTTPS
        if (typeof window !== 'undefined' && 
            window.location.hostname !== 'localhost' && 
            window.location.protocol === 'http:') {
            // Force HTTPS for security and LIFF compatibility
            window.location.href = window.location.href.replace('http:', 'https:');
        }
    }, []);

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
