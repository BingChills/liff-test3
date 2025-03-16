import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import React from 'react';
import { EventBus } from '../game/EventBus';
import axios from 'axios';

// Define types for our game state
export interface Coupon {
  id: string;
  code: string;
  discount: string;
  expiry?: string;
  image?: string;
  isUsed: boolean;
}

export interface Character {
  id: string;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  discount: string;
  isUsing: boolean;
  company: string;
}

export interface StoreCurrency {
  name: string;
  point: number;
  color: string;
}

interface GameState {
  // UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Game resources
  point: number;
  setPoint: (point: number) => void;
  
  // Character data
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
  
  // Coupon data
  coupons: Coupon[];
  setCoupons: (coupons: Coupon[]) => void;
  
  // Store data
  stores: StoreCurrency[];
  setStores: (stores: StoreCurrency[]) => void;
  selectedStore: StoreCurrency;
  setSelectedStore: (store: StoreCurrency) => void;
  
  // Stamina
  stamina: {
    current: number;
    max: number;
  };
  setStamina: (stamina: { current: number; max: number }) => void;
  
  // Summon
  drawCount: number;
  setDrawCount: (count: number) => void;
  remainingDraws: number;
  setRemainingDraws: (count: number) => void;
  
  // Score
  score: number;
  setScore: (score: number) => void;
  
  // User information
  userId: string | null;
  setUserId: (id: string | null) => void;
  
  // Data management
  saveGameState: () => Promise<void>;
  loadGameState: () => Promise<void>;
}

// Functions to interact with API
const fetchPlayerData = async (userId: string) => {
  try {
    const response = await axios.get(`/api/players/${userId}`);
    return response.data;
  } catch (error) {
    if ((error as any)?.response?.status === 404) {
      // Player not found, create a new player
      const createResponse = await axios.post('/api/players', { userId });
      return createResponse.data;
    }
    console.error('Error fetching player data:', error);
    return null;
  }
};

const savePlayerData = async (userId: string, data: any) => {
  try {
    const response = await axios.put(`/api/players/${userId}`, data);
    return response.data;
  } catch (error) {
    if ((error as any)?.response?.status === 404) {
      // Player not found, create a new player with the data
      const createResponse = await axios.post('/api/players', { 
        userId,
        ...data
      });
      return createResponse.data;
    }
    console.error('Error saving player data:', error);
    return null;
  }
};

// Create context with default values
const GameStateContext = createContext<GameState>({
  activeTab: 'coupon',
  setActiveTab: () => {},
  point: 0,
  setPoint: () => {},
  characters: [],
  setCharacters: () => {},
  coupons: [],
  setCoupons: () => {},
  stores: [],
  setStores: () => {},
  selectedStore: { name: '', point: 0, color: '' }, //TODO: Fix this
  setSelectedStore: () => {},
  stamina: { current: 0, max: 0 },
  setStamina: () => {},
  drawCount: 0,
  setDrawCount: () => {},
  remainingDraws: 0,
  setRemainingDraws: () => {},
  score: 0,
  setScore: () => {},
  userId: null,
  setUserId: () => {},
  saveGameState: async () => {},
  loadGameState: async () => {}
});

// Provider component to wrap our app
export const GameStateProvider = (props: { children: ReactNode }) => {
  // Initialize state
  const [activeTab, setActiveTab] = useState('coupon');
  const [point, setPoint] = useState(0);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([
    //NOTE: Examples
    {
      id: 'coupon1',
      code: 'MCDONALDS-50OFF',
      discount: '50% Discount',
      expiry: '2025-04-15',
      isUsed: false
    },
    {
      id: 'coupon2',
      code: 'PIZZAHUT-30OFF',
      discount: '30% Off on Large Pizzas',
      expiry: '2025-04-10',
      isUsed: false
    },
    {
      id: 'coupon3',
      code: 'BURGERKING-40OFF',
      discount: '40% Off on Combo Meals',
      expiry: '2025-04-08',
      isUsed: false
    },
    {
      id: 'coupon4',
      code: 'KFC-FREEWING',
      discount: 'Free Chicken Wings',
      expiry: '2025-04-05',
      isUsed: false
    }
  ]);

  //NOTE: Mock stores
  const [stores, setStores] = useState<StoreCurrency[]>([
    { name: 'Parabola', point: 1600, color: 'emerald' },
    { name: 'KFC', point: 850, color: 'red' },
    { name: 'Pizza Company', point: 1200, color: 'blue' },
    { name: 'Pizza Hut', point: 950, color: 'orange' }
  ]);
  
  const [selectedStore, setSelectedStore] = useState<StoreCurrency>(stores[0]);
  const [stamina, setStamina] = useState({ current: 20, max: 20 });
  const [drawCount, setDrawCount] = useState(0);
  const [remainingDraws, setRemainingDraws] = useState(0);
  const [score, setScore] = useState(0);
  
  // Add userId state
  const [userId, setUserId] = useState<string | null>(null);
  
  // Add loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to save game state to MongoDB
  const saveGameState = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const gameData = {
        point,
        characters,
        coupons,
        stores,
        selectedStore,
        stamina,
        drawCount,
        remainingDraws,
        score
      };
      
      await savePlayerData(userId, gameData);
    } catch (error) {
      console.error('Failed to save game state:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to load game state from MongoDB
  const loadGameState = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const playerData = await fetchPlayerData(userId);
      
      if (playerData) {
        // Set all state from retrieved data
        setPoint(playerData.point || 0);
        setCharacters(playerData.characters || []);
        setCoupons(playerData.coupons || []);
        setStores(playerData.stores || stores);
        setSelectedStore(playerData.selectedStore || stores[0]);
        setStamina(playerData.stamina || { current: 20, max: 20 });
        setDrawCount(playerData.drawCount || 0);
        setRemainingDraws(playerData.remainingDraws || 0);
        setScore(playerData.score || 0);
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load player data when userId changes
  useEffect(() => {
    if (userId) {
      loadGameState();
    }
  }, [userId]);
  
  // Auto-save game state when critical data changes (with debounce)
  useEffect(() => {
    if (!userId) return;
    
    const timeoutId = setTimeout(() => {
      saveGameState();
    }, 2000); // Debounce for 2 seconds
    
    return () => clearTimeout(timeoutId);
  }, [
    point, 
    characters, 
    coupons, 
    stores, 
    selectedStore, 
    stamina, 
    score
  ]);
  
  // Listen for events from the Phaser game
  useEffect(() => {
    // Handle coupon collection event from the game
    const handleCouponCollected = (coupon: Coupon) => {
      setCoupons(prev => [...prev, coupon]);
    };

    // Handle score update event from the game
    const handleScoreUpdated = (newScore: number) => {
      setScore(newScore);
    };

    // Handle point collection event from the game
    const handlePointCollected = (amount: number) => {
      setPoint(prev => prev + amount);
    };

    EventBus.on('couponCollected', handleCouponCollected);
    EventBus.on('scoreUpdated', handleScoreUpdated);
    EventBus.on('pointCollected', handlePointCollected);

    return () => {
      // Clean up event listeners
      EventBus.removeListener('couponCollected', handleCouponCollected);
      EventBus.removeListener('scoreUpdated', handleScoreUpdated);
      EventBus.removeListener('pointCollected', handlePointCollected);
    };
  }, []);

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
    score,
    setScore,
    userId,
    setUserId,
    saveGameState,
    loadGameState
  };

  // Use React.createElement instead of JSX
  return React.createElement(
    GameStateContext.Provider,
    { value },
    props.children
  );
};

// Custom hook to use the game state
export const useGameState = () => useContext(GameStateContext);
