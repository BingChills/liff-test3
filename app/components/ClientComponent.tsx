'use client';
import { useEffect } from "react";

const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
export default function ClientComponent() {

useEffect(() => {
    const initLiff = async () => {
      const liff = (await import('@line/liff')).default;
      try {
        await liff.init({ liffId: liffId as string });
      } catch (error) {
        if (error instanceof Error) {
          console.error('liff init error', error.message);
        } else {
          console.error('liff init error', error);
        }
      }
      if (!liff.isLoggedIn()) {
        liff.login();
      }
    };
    initLiff();
  }, []);

  return null;
}