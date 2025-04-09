import * as React from 'react'
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
import { EventBus } from '../game/EventBus'
import apiClient from '../config/api'
import { saveUserToDatabase, updateUserField } from '../utils/dbSync'
import { useUserSync } from '../hooks/useUserSync'

export interface Coupon {
   id: string
   code: string
   discount: string
   expiry?: string
   image?: string
   isUsed: boolean
   storeName: string
}

export interface Character {
   id: string
   name: string
   image: string
   rarity: 'common' | 'rare' | 'epic' | 'legendary'
   discount: string
   isUsing: boolean
   storeName: string
}

export interface StoreCurrency {
   name: string
   point: number
   color: string
}

interface GameState {
   // UI state
   activeTab: string
   setActiveTab: (tab: string) => void

   // Character data
   characters: Character[]
   setCharacters: (characters: Character[]) => void

   // Coupon data
   coupons: Coupon[]
   setCoupons: (coupons: Coupon[]) => void

   // Store data
   stores: StoreCurrency[]
   setStores: (stores: StoreCurrency[]) => void
   selectedStore: StoreCurrency | null
   setSelectedStore: (store: StoreCurrency | null) => void

   // Stamina
   stamina: {
      current: number
      max: number
   }
   setStamina: (stamina: { current: number; max: number }) => void

   // Summon
   drawCount: number
   setDrawCount: (count: number) => void
   remainingDraws: number
   setRemainingDraws: (count: number) => void

   // Score
   score: number
   databaseScore: number
   totalScore: number
   setScore: (score: number) => void
   setDatabaseScore: (score: number) => void

   // User information
   userId: string | null
   setUserId: (id: string | null) => void
   pictureUrl: string | null
   setPictureUrl: (url: string | null) => void
   displayName: string
   setDisplayName: (name: string) => void
   statusMessage: string | null
   setStatusMessage: (message: string | null) => void

   // Debug function
   testSaveUserData: () => boolean
}

// Create context with default values
const defaultContextValue: GameState = {
   activeTab: 'game',
   setActiveTab: () => {},
   characters: [],
   setCharacters: () => {},
   coupons: [],
   setCoupons: () => {},
   stores: [],
   setStores: () => {},
   selectedStore: null,
   setSelectedStore: () => {},
   stamina: { current: 20, max: 20 },
   setStamina: () => {},
   drawCount: 0,
   setDrawCount: () => {},
   remainingDraws: 0,
   setRemainingDraws: () => {},
   userId: null,
   setUserId: () => {},
   score: 0,
   databaseScore: 0,
   totalScore: 0,
   setScore: () => {},
   setDatabaseScore: () => {},
   pictureUrl: null,
   setPictureUrl: () => {},
   displayName: '',
   setDisplayName: () => {},
   statusMessage: null,
   setStatusMessage: () => {},
   testSaveUserData: () => false
}

// Export the context so it can be used by the useGameState hook
export const GameStateContext = createContext<GameState>(defaultContextValue)

// Provider component to wrap our app
export const GameStateProvider = (props: { children: ReactNode }) => {
   // Initialize state
   const [activeTab, setActiveTab] = useState('coupon')
   const [characters, setCharacters] = useState<Character[]>([])
   const [coupons, setCoupons] = useState<Coupon[]>([])
   const [stores, setStores] = useState<StoreCurrency[]>([{ name: 'Default Store', point: 0, color: 'blue' }])
   const [selectedStore, setSelectedStore] = useState<StoreCurrency | null>(stores[0])
   const [stamina, setStamina] = useState({ current: 20, max: 20 })
   const [drawCount, setDrawCount] = useState(0)
   const [remainingDraws, setRemainingDraws] = useState(0)
   const [score, setScore] = useState(0)
   const [databaseScore, setDatabaseScore] = useState(0)
   const [userId, setUserId] = useState<string | null>(null)
   const [pictureUrl, setPictureUrl] = useState<string | null>(null)
   const [displayName, setDisplayName] = useState<string>('')
   const [statusMessage, setStatusMessage] = useState<string | null>(null)

   // Calculate total score (database + session)
   const totalScore = databaseScore + score

   const { user } = useUserSync()

   const loadGameState = useCallback(async () => {
      if (!user) return

      console.log('🔄 Loading game data for user:', user.displayName)
      setUserId(user?.userId || null)
      setCharacters(user?.characters || [])
      setCoupons(user?.coupons || [])
      setStores(user?.stores || [{ name: 'Default Store', point: 0, color: 'blue' }])
      setSelectedStore(user?.stores[0] || stores[0])
      setStamina(user?.stamina || { current: 20, max: 20 })
      setDatabaseScore(user?.score || 0)
      setPictureUrl(user?.pictureUrl || null)
      setDisplayName(user?.displayName || '')
      setStatusMessage(user?.statusMessage || null)
   }, [stores, user])

   // Load player data when userId changes
   useEffect(() => {
      if (user) {
         loadGameState()
         console.log('✅ User data loaded')
      }
   }, [user, loadGameState])

   // Handle score update event from the game - wrapped in useCallback to prevent recreation on every render
   const handleScoreUpdated = useCallback(
      (newScore: number) => {
         setScore(newScore) // Only update session score
      },
      [setScore]
   )

   // Set up event listeners for session score update
   useEffect(() => {
      EventBus.on('scoreUpdated', handleScoreUpdated)

      return () => {
         EventBus.removeListener('scoreUpdated', handleScoreUpdated)
      }
   }, [handleScoreUpdated])

   // Handle coupon collection event from the game - wrapped in useCallback to prevent recreation on every render
   const handleCouponCollected = useCallback(
      (coupon: Coupon) => {
         const updatedCoupons = [...coupons, coupon]
         setCoupons(updatedCoupons)

         // Save updated coupons to database
         if (userId) {
            updateUserField(userId, 'coupons', updatedCoupons)
         }
      },
      [coupons, setCoupons, userId]
   )

   // Set up event listeners for coupon events
   useEffect(() => {
      EventBus.on('couponCollected', handleCouponCollected)

      return () => {
         EventBus.removeListener('couponCollected', handleCouponCollected)
      }
   }, [handleCouponCollected])

   // Save user data to MongoDB database on page close
   const handlePageClose = useCallback((event: BeforeUnloadEvent) => {
      if (!userId) {
         console.log('❌ Skipping save - no userId')
         return
      }

      try {
         // In browsers where sendBeacon is available, use it to save score on page close
         // This ensures the request completes even as the page is closing
         
         // Use the standard PUT endpoint instead of trying to use PATCH
         const scoreUrl = `/api/players/${userId}`
         // Format data as the server expects for a PUT request
         const scoreData = { score: totalScore }
         const scoreBlob = new Blob([JSON.stringify(scoreData)], { type: 'application/json' })
         
         // Send using beacon
         const success = navigator.sendBeacon(scoreUrl, scoreBlob)
         console.log('💾 Score update via beacon ' + (success ? 'initiated' : 'failed') + ':', totalScore)
      } catch (error) {
         console.error('Error saving data on close:', error)
      }
   }, [totalScore, userId])

   // Set up beforeunload event handler to save state on page close
   useEffect(() => {
      window.addEventListener('beforeunload', handlePageClose)
      return () => {
         window.removeEventListener('beforeunload', handlePageClose)
      }
   }, [handlePageClose])

   //FIXME: delete later
   // DEBUG FUNCTION: Test the save functionality
   const testSaveUserData = useCallback(() => {
      console.log('🧪 Testing score update...')
      if (!userId) {
         console.log('❌ Cannot test save - no userId')
         return false
      }

      try {
         // Use apiClient directly - this is the same method used elsewhere in the app
         // and we know it works
         console.log('Sending score update using apiClient')
         
         // Use PUT instead of PATCH to avoid Vercel limitations
         apiClient
            .put(`/api/players/${userId}`, { score: totalScore })
            .then((response) => {
               console.log('✅ Score update successful:', response.status)
               return response.data
            })
            .then((data) => console.log('Response data:', data))
            .catch((error) => console.error('❌ Score update error:', error.message))

         return true
      } catch (error) {
         console.error('Error during test save:', error)
         return false
      }
   }, [userId, totalScore])

   // Define the value object to be provided to consumers
   const value: GameState = {
      activeTab,
      setActiveTab,
      characters,
      setCharacters,
      coupons,
      setCoupons,
      stores,
      setStores,
      selectedStore,
      setSelectedStore,
      stamina,
      setStamina,
      drawCount,
      setDrawCount,
      remainingDraws,
      setRemainingDraws,
      userId,
      setUserId,
      score,
      databaseScore,
      totalScore,
      setScore,
      setDatabaseScore,
      pictureUrl,
      setPictureUrl,
      displayName,
      setDisplayName,
      statusMessage,
      setStatusMessage,
      testSaveUserData
   }

   // Use React.createElement instead of JSX to avoid TypeScript parsing issues
   return React.createElement(GameStateContext.Provider, { value }, props.children)
}

// Custom hook to use the game state
export const useGameState = () => useContext(GameStateContext)

