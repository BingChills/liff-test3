import * as React from 'react'
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
import { EventBus } from '../game/EventBus'
import apiClient from '../config/api'

// Define types for our game state
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

   // Game resources
   point: number
   setPoint: (point: number) => void

   // Character data
   characters: Character[]
   setCharacters: (characters: Character[]) => void

   // Coupon data
   coupons: Coupon[]
   setCoupons: (coupons: Coupon[]) => void

   // Store data
   stores: StoreCurrency[]
   setStores: (stores: StoreCurrency[]) => void
   selectedStore: StoreCurrency
   setSelectedStore: (store: StoreCurrency) => void

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
   setScore: (score: number) => void
   updateScore: (newScore: number) => void

   // User information
   userId: string | null
   setUserId: (id: string | null) => void

   // Loading state
   isLoading: boolean
}

// Create context with default values
const defaultContextValue: GameState = {
   activeTab: 'game',
   setActiveTab: () => {},
   point: 0,
   setPoint: () => {},
   characters: [],
   setCharacters: () => {},
   coupons: [],
   setCoupons: () => {},
   stores: [],
   setStores: () => {},
   selectedStore: {
      name: 'Default Store',
      point: 0,
      color: 'blue'
   },
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
   setScore: () => {},
   updateScore: () => {},
   isLoading: false
}

// Export the context so it can be used by the useGameState hook
export const GameStateContext = createContext<GameState>(defaultContextValue)

// Provider component to wrap our app
export const GameStateProvider = (props: { children: ReactNode }) => {
   // Initialize state
   const [activeTab, setActiveTab] = useState('coupon')
   const [point, setPoint] = useState(0)
   const [characters, setCharacters] = useState<Character[]>([])
   const [coupons, setCoupons] = useState<Coupon[]>([])
   const [stores, setStores] = useState<StoreCurrency[]>([{ name: 'Default Store', point: 0, color: 'blue' }])
   const [selectedStore, setSelectedStore] = useState<StoreCurrency>(stores[0])
   const [stamina, setStamina] = useState({ current: 20, max: 20 })
   const [drawCount, setDrawCount] = useState(0)
   const [remainingDraws, setRemainingDraws] = useState(0)
   const [score, setScore] = useState(0)
   const [userId, setUserId] = useState<string | null>(null)
   const [isLoading, setIsLoading] = useState(false)

   // EMERGENCY MODE: Load player data from localStorage
   const loadGameState = useCallback(async () => {
      if (!userId) return
      
      setIsLoading(true)
      console.log('🔄 Loading game data for user:', userId)
      
      try {
         // Try to load from localStorage first
         const savedData = localStorage.getItem('gameData')
         
         if (savedData) {
            console.log('✅ Found saved data in localStorage')
            
            try {
               const playerData = JSON.parse(savedData)
               
               // Verify this is the correct user's data
               if (playerData.userId === userId) {
                  // Set all game state from localStorage data
                  setScore(playerData.score || 0)
                  setPoint(playerData.point || 0)
                  setCharacters(playerData.characters || [])
                  setCoupons(playerData.coupons || [])
                  
                  if (playerData.stores && playerData.stores.length > 0) {
                     setStores(playerData.stores)
                     setSelectedStore(playerData.stores[0])
                  }
                  
                  if (playerData.stamina) {
                     setStamina(playerData.stamina)
                  }
                  
                  if (playerData.drawCount !== undefined) {
                     setDrawCount(playerData.drawCount)
                  }
                  
                  if (playerData.remainingDraws !== undefined) {
                     setRemainingDraws(playerData.remainingDraws)
                  }
                  
                  console.log('🎮 Game data loaded successfully from localStorage')
               } else {
                  // Wrong user data - create new profile
                  console.log('⚠️ Found localStorage data but for different user')
                  createNewPlayerData()
               }
            } catch (parseError) {
               console.error('❌ Error parsing localStorage data:', parseError)
               createNewPlayerData()
            }
         } else {
            console.log('⚠️ No saved data found in localStorage')
            createNewPlayerData()
         }
      } catch (error) {
         console.error('❌ Error accessing localStorage:', error)
         createNewPlayerData()
      } finally {
         setIsLoading(false)
      }
   }, [userId])
   
   // Helper function to create new player data
   const createNewPlayerData = () => {
      console.log('🆕 Creating new player data')
      // Use default state values already set in state initialization
   }

   // Load player data when userId changes
   useEffect(() => {
      if (userId) {
         loadGameState()
      }
   }, [userId, loadGameState])

   // Handle score update event from the game
   const handleScoreUpdated = (newScore: number) => {
      setScore(newScore)
   }

   // Handle point collection event from the game
   const handlePointCollected = (amount: number) => {
      setPoint((prev) => prev + amount)
   }

   // Set up event listeners for game events
   useEffect(() => {
      EventBus.on('scoreUpdated', handleScoreUpdated)
      EventBus.on('pointCollected', handlePointCollected)

      return () => {
         EventBus.removeListener('scoreUpdated', handleScoreUpdated)
         EventBus.removeListener('pointCollected', handlePointCollected)
      }
   }, [])

   // Handle coupon collection event from the game
   const handleCouponCollected = (coupon: Coupon) => {
      setCoupons((prev) => [...prev, coupon])
   }

   // Set up event listeners for coupon events
   useEffect(() => {
      EventBus.on('couponCollected', handleCouponCollected)

      return () => {
         EventBus.removeListener('couponCollected', handleCouponCollected)
      }
   }, [])

   // EMERGENCY MODE: Save data to localStorage instead of API for reliability
   const handlePageClose = useCallback((event: BeforeUnloadEvent) => {
      if (!userId) return
      
      const playerData = {
         userId,
         score,
         point,
         characters,
         coupons,
         stores,
         selectedStore,
         stamina,
         drawCount,
         remainingDraws,
         updatedAt: Date.now()
      }
      
      try {
         // Save to localStorage directly - no API calls
         localStorage.setItem('gameData', JSON.stringify(playerData))
         localStorage.setItem('lastSave', Date.now().toString())
         console.log('Player data saved to localStorage on page close')
      } catch (error) {
         console.error('Error saving player data to localStorage:', error)
      }
   }, [userId, score, point, characters, coupons, stores, selectedStore, stamina, drawCount, remainingDraws])

   // Set up beforeunload event handler to save state on page close
   useEffect(() => {
      window.addEventListener('beforeunload', handlePageClose)
      return () => {
         window.removeEventListener('beforeunload', handlePageClose)
      }
   }, [handlePageClose])

   // Simple score update function
   const updateScore = useCallback((newScore: number) => {
      setScore(newScore)
   }, [])

   // Define the value object to be provided to consumers
   const value: GameState = {
      activeTab,
      setActiveTab,
      point,
      setPoint,
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
      setScore,
      updateScore,
      isLoading
   }

   // Use React.createElement instead of JSX to avoid TypeScript parsing issues
   return React.createElement(GameStateContext.Provider, { value }, props.children)
}

// Custom hook to use the game state
export const useGameState = () => useContext(GameStateContext)
