// Hook for LIFF initialization and data handling
import { useState, useEffect } from 'react'
import type { Liff } from '@line/liff'
import { UserInformation } from '../context/LiffContext'

// Type for user profile data from LIFF SDK
export type UserProfile = {
   userId: string
   displayName: string
   pictureUrl?: string
   statusMessage?: string
}

// State returned by our LIFF initialization hook
export type LiffState = {
   liff: Liff | null
   error: string | null
   profile: UserProfile | null
   idToken: string | null
}

export const useLiffInit = (): LiffState => {
   const [liffObject, setLiffObject] = useState<Liff | null>(null)
   const [liffError, setLiffError] = useState<string | null>(null)
   const [profile, setProfile] = useState<UserProfile | null>(null)
   const [idToken, setIdToken] = useState<string | null>(null)

   useEffect(() => {
      // Initialize LIFF and gather user data
      const initLiff = async () => {
         try {
            // Import LIFF (avoid window is not defined error)
            const liffModule = await import('@line/liff')
            const liff = liffModule.default

            // Enhanced LIFF initialization with more options
            await liff.init({
               liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
               withLoginOnExternalBrowser: true // Allow login on external browser
            })

            // Force https for security
            if (
               typeof window !== 'undefined' &&
               window.location.protocol === 'http:' &&
               !window.location.hostname.includes('localhost')
            ) {
               window.location.href = window.location.href.replace('http:', 'https:')
               return
            }

            console.log('LIFF init succeeded.')
            setLiffObject(liff)

            // Gather user data after successful initialization
            await getUserData(liff)
         } catch (error) {
            console.error('LIFF initialization failed:', error)
            setLiffError(error instanceof Error ? error.toString() : String(error))
         }
      }

      // Get user data from initialized LIFF
      const getUserData = async (liff: Liff) => {
         // Get and store ID token
         try {
            const token = liff.getIDToken()
            if (token) {
               setIdToken(token)
            }
         } catch (error) {
            console.error('Error getting ID token:', error)
         }

         // Get and store user profile
         try {
            const userProfile = await liff.getProfile()
            setProfile(userProfile)
         } catch (error) {
            console.error('Error getting user profile:', error)
         }
      }

      initLiff()
   }, [])

   return {
      liff: liffObject,
      error: liffError,
      profile,
      idToken
   }
}

