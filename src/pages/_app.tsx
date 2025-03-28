import "@/styles/globals.css";
import "../styles/layout.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";

// Import LiffWrapper with dynamic import to avoid SSR issues
const LiffWrapper = dynamic(() => import("@/LiffWrapper"), { ssr: false });

// The main Next.js component wrapped with LiffWrapper
export default function App({ Component, pageProps }: AppProps) {
    return (
        <LiffWrapper>
            <Component {...pageProps} />
        </LiffWrapper>
    );
}