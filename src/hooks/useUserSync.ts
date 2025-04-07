// src/hooks/useUserSync.ts
import { useEffect, useState } from 'react'
import { useLiff } from '../context/LiffContext'
import { UserProfile, PlayerType } from '../context/LiffContext' // Import the UserProfile type
import apiClient from '../config/api'

// Simplified hook for syncing user data - optimized for demo purposes
export const useUserSync = () => {
   const { liff, userProfile } = useLiff()
   const [user, setUser] = useState<PlayerType | null>(null)
   
   // Debug counters
   const [attempts, setAttempts] = useState(0)
   
   // Add logging when first loaded
   useEffect(() => {
      console.log('🔄 useUserSync hook initialized')
      console.log('🪪 User profile from LIFF:', userProfile)
   }, [userProfile])

   // Store user data in localStorage as a fallback
   useEffect(() => {
      // Try to load from localStorage if exists
      const savedUser = localStorage.getItem('playerData')
      if (savedUser && !user) {
         try {
            const parsedUser = JSON.parse(savedUser)
            console.log('💾 Loaded player data from localStorage')
            setUser(parsedUser)
         } catch (e) {
            console.error('Failed to parse localStorage data')
         }
      }
   }, [user])

   // Main synchronization effect
   useEffect(() => {
      const syncUserData = async () => {
         // Only proceed if we have user profile data
         if (!userProfile || !liff) {
            console.log('⏳ Waiting for LIFF profile data...')
            return
         }
         
         setAttempts(prev => prev + 1)
         console.log(`🧠 Starting user sync process for: ${userProfile.userId} (Attempt ${attempts})`)

         try {
            // SIMPLEST APPROACH: Always try to create the user first (simpler for demo)
            console.log('👤 Creating/updating user in database...')
            
            // Simple userData object
            const userData = {
               userId: userProfile.userId,
               displayName: userProfile.displayName || 'LIFF User',
               pictureUrl: userProfile.pictureUrl || '',
               statusMessage: userProfile.statusMessage || ''
            }
            
            console.log('📦 Sending data to API:', userData)

            // Try all methods sequentially - POST, PUT, then GET as fallback
            try {
               // Try POST first (create)
               const createResponse = await apiClient.post('/api/players', userData)
               console.log('✅ Player created/updated:', createResponse.data)
               setUser(createResponse.data)
               
               // Save to localStorage as fallback
               localStorage.setItem('playerData', JSON.stringify(createResponse.data))
               return
            } catch (createError) {
               console.log('⚠️ POST failed, trying PUT...', createError)
               
               try {
                  // Try PUT (update) if POST fails
                  const putResponse = await apiClient.put(`/api/players/${userProfile.userId}`, userData)
                  console.log('✅ PUT succeeded:', putResponse.data)
                  setUser(putResponse.data)
                  
                  // Save to localStorage as fallback
                  localStorage.setItem('playerData', JSON.stringify(putResponse.data))
                  return
               } catch (putError) {
                  console.log('⚠️ PUT failed, trying GET...', putError)
                  
                  try {
                     // Last resort - try to at least GET existing data
                     const getResponse = await apiClient.get(`/api/players/${userProfile.userId}`)
                     console.log('✅ GET succeeded:', getResponse.data)
                     setUser(getResponse.data)
                     
                     // Save to localStorage as fallback
                     localStorage.setItem('playerData', JSON.stringify(getResponse.data))
                     return
                  } catch (getError) {
                     console.error('❌ All API methods failed:', getError)
                     
                     // Create a local fallback user if all else fails
                     const fallbackUser = {
                        ...userData,
                        score: 0,
                        stores: [
                           { name: "Food", point: 0, color: "#FF5722" },
                           { name: "Shopping", point: 0, color: "#E91E63" },
                           { name: "Entertainment", point: 0, color: "#9C27B0" },
                        ],
                        stamina: { current: 20, max: 20 },
                        characters: [],
                        coupons: [],
                        selectedStore: "Food",
                        _id: `local-${Date.now()}`,
                        createdAt: new Date().toISOString()
                     }
                     console.log('⚠️ Using local fallback user:', fallbackUser)
                     setUser(fallbackUser as unknown as PlayerType) // Cast to unknown first to satisfy TypeScript
                     localStorage.setItem('playerData', JSON.stringify(fallbackUser))
                  }
               }
            }
         } catch (error) {
            console.error('❌ Failed to sync user data:', error)
            
            // If we have a previously saved user in localStorage, use that
            const savedUser = localStorage.getItem('playerData')
            if (savedUser) {
               try {
                  const parsedUser = JSON.parse(savedUser)
                  console.log('💾 Using cached player data from localStorage')
                  setUser(parsedUser)
               } catch (e) {
                  console.error('Failed to parse localStorage data')
               }
            }
         }
      }

      // Only sync when we have user profile data
      if (userProfile && userProfile.userId) {
         console.log('🔄 Syncing user data for:', userProfile.userId)
         syncUserData()
         
         // Simple retry mechanism for demo purposes
         const intervalId = setInterval(() => {
            if (attempts < 3) {
               console.log('🔄 Retrying user sync...')
               syncUserData()
            } else {
               clearInterval(intervalId)
            }
         }, 5000)
         
         return () => clearInterval(intervalId)
      }
   }, [userProfile, liff, attempts]) // Re-run when user profile changes

   return { user }
}

