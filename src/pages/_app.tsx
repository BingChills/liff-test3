import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useLiffInit } from '../hooks/useLiffInit'
import { useUserSync } from '../hooks/useUserSync'
import { LiffProvider } from '../context/LiffContext'

// Using React.memo to prevent unnecessary rerenders of this component
import React from 'react'

const UserSyncManager = React.memo(() => {
   // The hook will only be initialized once due to React.memo
   useUserSync()
   return null
})

// Add display name for ESLint
UserSyncManager.displayName = 'UserSyncManager'

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
