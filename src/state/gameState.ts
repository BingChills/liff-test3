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

   // Simple function to load initial player data
   const loadGameState = useCallback(async () => {
      if (!userId) return
      
      setIsLoading(true)
      
      try {
         const response = await apiClient.get(`/api/players/${userId}`)
         const playerData = response.data
         
         // Set state from API data
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
      } catch (error) {
         console.error('Error loading player data:', error)
         // If player doesn't exist, create a new one
         try {
            if ((error as any)?.response?.status === 404) {
               await apiClient.post('/api/players', { userId })
            }
         } catch (createError) {
            console.error('Error creating player:', createError)
         }
      } finally {
         setIsLoading(false)
      }
   }, [userId])

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

   // SIMPLIFIED: Save data to database ONLY when app is closing
   const handlePageClose = useCallback((event: BeforeUnloadEvent) => {
      if (!userId) return

      // Create a synchronous XMLHttpRequest to save data before close
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', `/api/players/${userId}`, false) // false = synchronous
      xhr.setRequestHeader('Content-Type', 'application/json')
      
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
         remainingDraws
      }
      
      try {
         xhr.send(JSON.stringify(playerData))
         console.log('Player data saved on page close')
      } catch (error) {
         console.error('Error saving player data on close:', error)
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
