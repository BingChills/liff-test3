import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] });

const AppWithoutSSR = dynamic(() => import('@/App'), { ssr: false });

export default function Home() {
    return (
        <>
            <Head>
                <title>Linkz</title>
                <meta name="description" content="Linkz gameplay" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/* TODO: Change ICON */}
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main className={`${styles.main} ${inter.className}`}>
                <AppWithoutSSR />
            </main>
        </>
    );
}
