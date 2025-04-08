// src/hooks/useUserSync.ts
import { useEffect, useState } from 'react'
import { useLiff } from '../context/LiffContext'
import { UserProfile, PlayerType } from '../context/LiffContext' // Import the UserProfile type

// EMERGENCY MODE: LOCAL-ONLY version with no API calls
export const useUserSync = () => {
   const { liff, userProfile } = useLiff()
   const [user, setUser] = useState<PlayerType | null>(null)
   
   // Add logging when first loaded
   useEffect(() => {
      console.log('🔄 EMERGENCY MODE: useUserSync initialized - LOCAL ONLY')
      console.log('🪪 User profile from LIFF:', userProfile)
   }, [userProfile])

   // Main synchronization effect - LOCALSTORAGE ONLY
   useEffect(() => {
      const syncUserData = async () => {
         // Only proceed if we have user profile data
         if (!userProfile || !liff) {
            console.log('⏳ Waiting for LIFF profile data...')
            return
         }
         
         console.log(`🧠 Syncing local data for user: ${userProfile.userId}`)

         try {
            // Check if we have this user's data in localStorage
            const savedData = localStorage.getItem('gameData')
            
            if (savedData) {
               try {
                  const savedUser = JSON.parse(savedData)
                  
                  // If we have data for this user, use it
                  if (savedUser.userId === userProfile.userId) {
                     console.log('✅ Found existing user data in localStorage')
                     setUser(savedUser)
                     return
                  }
               } catch (e) {
                  console.error('Failed to parse localStorage data', e)
               }
            }
            
            // Create new profile if we don't have one
            console.log('🆕 Creating new local user profile')
            const defaultStore = { name: 'Default Store', point: 0, color: 'blue' }
            const newProfile = {
               userId: userProfile.userId,
               displayName: userProfile.displayName || 'LIFF User',
               pictureUrl: userProfile.pictureUrl || '',
               statusMessage: userProfile.statusMessage || '',
               score: 0,
               point: 0,
               characters: [],
               coupons: [],
               stores: [defaultStore],
               stamina: { current: 20, max: 20 },
               selectedStore: defaultStore,  // Use store object instead of string
               drawCount: 0,
               remainingDraws: 3
            }
            
            setUser(newProfile as unknown as PlayerType)  // Cast to unknown first
            localStorage.setItem('gameData', JSON.stringify(newProfile))
            console.log('💾 New user profile saved to localStorage')
         } catch (error) {
            console.error('Local sync error:', error)
         }
      }

      syncUserData()
   }, [userProfile, liff])

   return { user, setUser }
}
