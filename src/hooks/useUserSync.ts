import { useEffect, useState, useRef } from 'react'
import { useLiff } from '../context/LiffContext'
import { PlayerType } from '../context/LiffContext'
import apiClient from '../config/api'

// Flag to enable development mode which bypasses API calls
const DEV_MODE = process.env.NODE_ENV === 'development'

// Mock player data for development mode
const mockPlayerData: PlayerType = {
   userId: 'dev-user-123456789',
   displayName: 'Developer User',
   pictureUrl: '',
   statusMessage: 'Developing without LINE login',
   score: 1500,
   stores: [
      { name: 'Parabola', point: 5000, color: 'blue' },
      { name: 'KFZ', point: 5000, color: 'red' },
      { name: 'PizzaHat', point: 5000, color: 'orange' }
   ],
   selectedStore: { name: 'Parabola', point: 5000, color: 'blue' },
   stamina: { current: 20, max: 20 },
   characters: [],
   coupons: [
      {
         id: 'dev-coupon-001',
         code: 'DEV20OFF',
         discount: '20% off',
         expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
         isUsed: false,
         storeName: 'Parabola'
      }
   ]
}

export const useUserSync = () => {
   const { liff, userProfile } = useLiff()
   const [user, setUser] = useState<PlayerType | null>(DEV_MODE ? mockPlayerData : null)
   const syncedRef = useRef(DEV_MODE)

   useEffect(() => {
      // Skip API sync in development mode
      if (DEV_MODE) {
         console.log('🔧 Using mock player data in development mode')
         return
      }

      const syncUserData = async () => {
         if (syncedRef.current) {
            console.log('🔄 Skipping sync - already synced')
            return
         }

         if (!userProfile || !liff) {
            console.log('❌ Cannot sync - userProfile or LIFF not available')
            return
         }

         try {
            console.log('🌐 Attempting API call to fetch user:', userProfile.userId)
            try {
               const response = await apiClient.get(`/api/players/${userProfile.userId}`)
               if (response.data) {
                  console.log('✅ Found existing user data in database')
                  setUser(response.data as PlayerType)
                  syncedRef.current = true
                  return
               } else {
                  console.log('⚠️ API returned success but no data')
               }
            } catch (error) {
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
            setUser(createResponse.data as PlayerType)
            syncedRef.current = true
            console.log('New user profile saved to database')
         } catch (error) {
            console.error('Database sync error:', error)
         }
      }

      // Only perform API sync in production
      if (!DEV_MODE) {
         syncUserData()
      }
   }, [liff, userProfile])

   return { user }
}

