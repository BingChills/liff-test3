import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import React from 'react';
import { EventBus } from '../game/EventBus';

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
  gems: number;
  color: string;
}

interface GameState {
  // UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Game resources
  coins: number;
  setCoins: (coins: number) => void;
  
  // Character data
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
  
  // Coupon data
  coupons: Coupon[];
  setCoupons: (coupons: Coupon[]) => void;
  
  // Store data
  stores: StoreCurrency[];
  selectedStore: StoreCurrency;
  setSelectedStore: (store: StoreCurrency) => void;
  
  // Stamina
  stamina: { current: number; max: number };
  setStamina: (stamina: { current: number; max: number }) => void;
  
  // Summoning state
  drawCount: number;
  setDrawCount: (count: number) => void;
  remainingDraws: number;
  setRemainingDraws: (count: number) => void;
  
  // Leaderboard data
  score: number;
  setScore: (score: number) => void;
}

// Create context with default values
const GameStateContext = createContext<GameState>({
  activeTab: 'coupon',
  setActiveTab: () => {},
  coins: 0,
  setCoins: () => {},
  characters: [],
  setCharacters: () => {},
  coupons: [],
  setCoupons: () => {},
  stores: [],
  selectedStore: { name: '', gems: 0, color: '' },
  setSelectedStore: () => {},
  stamina: { current: 0, max: 0 },
  setStamina: () => {},
  drawCount: 0,
  setDrawCount: () => {},
  remainingDraws: 0,
  setRemainingDraws: () => {},
  score: 0,
  setScore: () => {}
});

// Provider component to wrap our app
export const GameStateProvider = (props: { children: ReactNode }) => {
  // Initialize state
  const [activeTab, setActiveTab] = useState('coupon');
  const [coins, setCoins] = useState(2800000);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([
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
  const [stores, setStores] = useState<StoreCurrency[]>([
    { name: 'Parabola', gems: 1600, color: 'emerald' },
    { name: 'KFC', gems: 850, color: 'red' },
    { name: 'Pizza Company', gems: 1200, color: 'blue' },
    { name: 'Pizza Hut', gems: 950, color: 'orange' }
  ]);
  const [selectedStore, setSelectedStore] = useState<StoreCurrency>(stores[0]);
  const [stamina, setStamina] = useState({ current: 18, max: 20 });
  const [drawCount, setDrawCount] = useState(0);
  const [remainingDraws, setRemainingDraws] = useState(0);
  const [score, setScore] = useState(0);

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

    // Handle coin collection event from the game
    const handleCoinsCollected = (amount: number) => {
      setCoins(prev => prev + amount);
    };

    EventBus.on('couponCollected', handleCouponCollected);
    EventBus.on('scoreUpdated', handleScoreUpdated);
    EventBus.on('coinsCollected', handleCoinsCollected);

    return () => {
      // Clean up event listeners
      EventBus.removeListener('couponCollected', handleCouponCollected);
      EventBus.removeListener('scoreUpdated', handleScoreUpdated);
      EventBus.removeListener('coinsCollected', handleCoinsCollected);
    };
  }, []);

  // Define the value object to be provided to consumers
  const value: GameState = {
    activeTab,
    setActiveTab,
    coins,
    setCoins,
    characters,
    setCharacters,
    coupons,
    setCoupons,
    stores,
    selectedStore,
    setSelectedStore,
    stamina,
    setStamina,
    drawCount,
    setDrawCount,
    remainingDraws,
    setRemainingDraws,
    score,
    setScore
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
