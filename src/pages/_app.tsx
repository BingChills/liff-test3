import "@/styles/globals.css";
import type { AppProps } from "next/app";

// The main Next.js component.
export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

