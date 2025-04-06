// src/hooks/useUserSync.ts
import { useEffect, useState } from 'react'
import { useLiff } from '../context/LiffContext'
import { UserProfile, PlayerType } from '../context/LiffContext' // Import the UserProfile type
import apiClient from '../config/api'

// NOTE: Maybe can improve this later
export const useUserSync = () => {
   const { liff, userProfile } = useLiff()
   const [user, setUser] = useState<PlayerType | null>(null)

   useEffect(() => {
      const syncUserData = async () => {
         // Only proceed if we have user profile data
         if (!userProfile || !liff) return

         try {
            // First check if the user already exists
            try {
               const getResponse = await apiClient.get(`/api/players/${userProfile.userId}`)
               setUser(getResponse.data)
               return
            } catch (error: any) {
               // If 404 -> continue to create user
               // If other error -> throw
               if (error.response && error.response.status !== 404) {
                  throw error
               }
            }

            // If user wasn't found, create a new one
            const createResponse = await apiClient.post('/api/players', {
               userId: userProfile.userId,
               displayName: userProfile.displayName,
               pictureUrl: userProfile.pictureUrl,
               statusMessage: userProfile.statusMessage
            })

            console.log('New player created:', createResponse.data)
            setUser(createResponse.data)
         } catch (error) {
            console.error('Failed to sync user data:', error)
         }
      }

      if (userProfile) {
         syncUserData()
      }
   }, [userProfile, liff]) // Re-run when user profile changes

   return { user }
}

