import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useLiffInit } from '../hooks/useLiffInit'
import { useUserSync } from '../hooks/useUserSync'
import { LiffProvider } from '../context/LiffContext'

// Simple component that calls useUserSync
// The hook itself now has a global flag to only run once
const UserSyncManager = () => {
   useUserSync()
   return null
}

function MyApp({ Component, pageProps }: AppProps) {
   const { liff, error, profile, idToken } = useLiffInit()

   const contextValue = {
      liff: liff,
      liffError: error,
      liffIDToken: idToken,
      userProfile: profile
   }

   return (
      <LiffProvider value={contextValue}>
         <UserSyncManager />
         <Component {...pageProps} />
      </LiffProvider>
   )
}

export default MyApp
