// src/hooks/useUserSync.ts
import { useEffect, useState } from 'react'
import { useLiff } from '../context/LiffContext'
import { UserProfile, PlayerType } from '../context/LiffContext' // Import the UserProfile type
import apiClient from '../config/api'

// Enhanced hook for syncing user data with better logging and reliability
export const useUserSync = () => {
   const { liff, userProfile } = useLiff()
   const [user, setUser] = useState<PlayerType | null>(null)
   
   // Add logging when first loaded
   useEffect(() => {
      console.log('🔄 useUserSync hook initialized')
      console.log('🪪 User profile from LIFF:', userProfile)
   }, [userProfile])

   useEffect(() => {
      const syncUserData = async () => {
         // Only proceed if we have user profile data
         if (!userProfile || !liff) {
            console.log('⏳ Waiting for LIFF profile data...')
            return
         }
         
         console.log('🧠 Starting user sync process for:', userProfile.userId)

         try {
            // First check if the user already exists
            console.log('🔍 Checking if user exists in database...')
            try {
               const getResponse = await apiClient.get(`/api/players/${userProfile.userId}`)
               console.log('✅ Found existing user:', getResponse.data)
               setUser(getResponse.data)
               return
            } catch (error: any) {
               // If 404 -> continue to create user
               // If other error -> throw
               if (error.response && error.response.status !== 404) {
                  console.error('❌ Error retrieving user:', error)
                  throw error
               }
               console.log('🆕 User not found, will create new account')
            }

            // If user wasn't found, create a new one
            console.log('👤 Creating new user in database...')
            const userData = {
               userId: userProfile.userId,
               displayName: userProfile.displayName || 'LIFF User',
               pictureUrl: userProfile.pictureUrl || '',
               statusMessage: userProfile.statusMessage || ''
            }
            
            console.log('📦 Sending data to API:', userData)
            
            try {
               const createResponse = await apiClient.post('/api/players', userData)
               console.log('✅ New player created:', createResponse.data)
               setUser(createResponse.data)
            } catch (createError) {
               console.error('❌ Failed to create user:', createError)
               
               // Last resort fallback - try a direct PUT request
               console.log('🔄 Trying fallback PUT request...')
               try {
                  const putResponse = await apiClient.put(`/api/players/${userProfile.userId}`, userData)
                  console.log('✅ Fallback succeeded:', putResponse.data)
                  setUser(putResponse.data)
               } catch (putError) {
                  console.error('❌ All attempts failed:', putError)
               }
            }
         } catch (error) {
            console.error('❌ Failed to sync user data:', error)
         }
      }

      // Only sync when we have user profile data
      if (userProfile && userProfile.userId) {
         console.log('🔄 Syncing user data for:', userProfile.userId)
         syncUserData()
      }
   }, [userProfile, liff]) // Re-run when user profile changes

   return { user }
}

