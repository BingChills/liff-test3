import { useEffect, useState, useRef } from 'react'
import { useLiff } from '../context/LiffContext'
import { PlayerType } from '../context/LiffContext'
import apiClient from '../config/api'
import { useGameState } from '../state/gameState'

export const useUserSync = () => {
   const { liff, userProfile } = useLiff()
   const [user, setUser] = useState<PlayerType | null>(null)
   const syncedRef = useRef(false)
   const { setCoupons, setUserId } = useGameState()

   useEffect(() => {
      const syncUserData = async () => {
         if (syncedRef.current) return

         console.log('🔄 syncUserData called - Checking conditions')

         if (!userProfile || !liff) {
            console.log('❌ Cannot sync - userProfile or LIFF not available', {
               hasUserProfile: !!userProfile,
               hasLiff: !!liff
            })
            return
         }

         try {
            console.log('🌐 Attempting API call to fetch user:', userProfile.userId)
            try {
               const response = await apiClient.get(`/api/players/${userProfile.userId}`)
               console.log('🌐 API Response:', response.status)
               if (response.data) {
                  console.log('✅ Found existing user data in database')
                  const userData = response.data as PlayerType
                  setUser(userData)
                  
                  // Sync with game state
                  if (userData.userId) {
                     setUserId(userData.userId)
                  }
                  if (userData.coupons && userData.coupons.length > 0) {
                     console.log('🎫 Syncing coupons with game state:', userData.coupons)
                     setCoupons(userData.coupons)
                  }
                  
                  syncedRef.current = true
                  return
               } else {
                  console.log('⚠️ API returned success but no data')
               }
            } catch (error) {
               console.log('⚠️ API Error:', error)
               console.log('🔄 Player not found in database, creating new profile')
            }

            const newProfile = {
               userId: userProfile.userId,
               displayName: userProfile.displayName || 'LIFF User',
               pictureUrl: userProfile.pictureUrl || '',
               statusMessage: userProfile.statusMessage || '',
               score: 0,
               stores: [],
               stamina: { current: 20, max: 20 },
               characters: [],
               coupons: [
                  {
                     id: 'test-yumyum-001',
                     code: 'YumYum-20OFF',
                     discount: '20%',
                     expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                     image: 'https://placehold.co/200x200/orange/white?text=YumYum',
                     isUsed: false,
                     storeName: 'YumYum'
                  }
               ]
            }

            const createResponse = await apiClient.post('/api/players', newProfile)
            const userData = createResponse.data as PlayerType
            setUser(userData)
            
            // Sync with game state
            if (userData.userId) {
               setUserId(userData.userId)
            }
            if (userData.coupons && userData.coupons.length > 0) {
               console.log('🎫 Syncing coupons with game state:', userData.coupons)
               setCoupons(userData.coupons)
            }
            
            syncedRef.current = true
            console.log('New user profile saved to database')
         } catch (error) {
            console.error('Database sync error:', error)
         }
      }

      console.log('🔄 Checking if sync is needed...')
      syncUserData()
   }, [userProfile, liff, setCoupons, setUserId])

   const updateUser = async (updatedUser: PlayerType) => {
      setUser(updatedUser)
      try {
         console.log('🔄 Updating user in database:', updatedUser.userId)
         const response = await apiClient.put(`/api/players/${updatedUser.userId}`, updatedUser)
         console.log('✅ User updated successfully:', response.status)
         
         // Sync with game state
         if (updatedUser.coupons && updatedUser.coupons.length > 0) {
            console.log('🎫 Syncing updated coupons with game state:', updatedUser.coupons)
            setCoupons(updatedUser.coupons)
         }
      } catch (error) {
         console.error('❌ Error updating user in database:', error)
      }
   }

   return { user, setUser: updateUser }
}
