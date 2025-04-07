import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import React from 'react';
import { EventBus } from '../game/EventBus';
import apiClient from '../config/api';

// Define types for our game state
export interface Coupon {
    id: string;
    code: string;
    discount: string;
    expiry?: string;
    image?: string;
    isUsed: boolean;
    storeName: string; // Store this coupon belongs to
}

export interface Character {
    id: string;
    name: string;
    image: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    discount: string;
    isUsing: boolean;
    storeName: string; // Store this character belongs to
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
    updateScore: (newScore: number) => void; // Dedicated function to update score and save to database

    // User information
    userId: string | null;
    setUserId: (id: string | null) => void;

    // Data management
    saveGameState: () => Promise<void>;
    loadGameState: () => Promise<void>;
    
    // Loading state
    isLoading: boolean;
}

// Functions to interact with API
const fetchPlayerData = async (userId: string) => {
    try {
        const response = await apiClient.get(`/api/players/${userId}`);
        return response.data;
    } catch (error) {
        if ((error as any)?.response?.status === 404) {
            // Player not found, create a new player
            const createResponse = await apiClient.post('/api/players', { userId });
            return createResponse.data;
        }
        console.error('Error fetching player data:', error);
        return null;
    }
};

const savePlayerData = async (userId: string, data: any) => {
    try {
        const response = await apiClient.put(`/api/players/${userId}`, data);
        return response.data;
    } catch (error) {
        if ((error as any)?.response?.status === 404) {
            // Player not found, create a new player with the data
            const createResponse = await apiClient.post('/api/players', {
                userId,
                ...data,
            });
            return createResponse.data;
        }
        console.error('Error saving player data:', error);
        return null;
    }
};

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
        color: 'blue',
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
    saveGameState: async () => {},
    loadGameState: async () => {},
    score: 0,
    setScore: () => {},
    updateScore: () => {},
    isLoading: false,
};

const GameStateContext = createContext<GameState>(defaultContextValue);

// Throttle timer for score updates - outside component to persist between renders
let throttleTimer: NodeJS.Timeout | null = null;

// Provider component to wrap our app
export const GameStateProvider = (props: { children: ReactNode }) => {
    // Initialize state
    const [activeTab, setActiveTab] = useState('coupon');
    const [point, setPoint] = useState(0);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);

    const [stores, setStores] = useState<StoreCurrency[]>([
        { name: 'Default Store', point: 0, color: 'blue' },
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
    const saveGameState = useCallback(async () => {
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
                score,
            };

            await savePlayerData(userId, gameData);
        } catch (error) {
            console.error('Failed to save game state:', error);
        } finally {
            setIsLoading(false);
        }
    }, [
        userId,
        point,
        characters,
        coupons,
        stores,
        selectedStore,
        stamina,
        drawCount,
        remainingDraws,
        score,
    ]);

    // Function to update just the score in the database
    const updateScoreInDatabase = async (userId: string, newScore: number) => {
        try {
            console.log(`Attempting to update score for user ${userId} to ${newScore}`);
            
            // Using apiClient that points to Railway backend
            const response = await apiClient.patch(`/api/players/${userId}/score`, { value: newScore });
            
            console.log('Score update response:', response.status);
            console.log('Score updated in database:', newScore);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.error('API error updating score:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    url: `/api/players/${userId}/score`,
                });
            } else {
                console.error('Unknown error updating score:', error);
            }
            throw error; // Re-throw to allow caller to handle
        }
    };
    
    // Synchronous save for beforeunload event - enhanced version
    const saveScoreSynchronously = (userId: string, finalScore: number) => {
        try {
            console.log(`💾 Saving final score on page close: ${finalScore} for user ${userId}`);
            
            // First save to localStorage as reliable backup
            localStorage.setItem('playerScore', finalScore.toString());
            localStorage.setItem('playerScoreTimestamp', Date.now().toString());
            localStorage.setItem('playerScoreUserId', userId);
            
            // For the demo, also try using the new sendBeacon API which is more reliable than sync XHR
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify({ value: finalScore })], { type: 'application/json' });
                const success = navigator.sendBeacon(`/api/players/${userId}/score`, blob);
                console.log(`📡 sendBeacon ${success ? 'succeeded' : 'failed'}`);
            }
            
            // Fallback to synchronous XHR as last resort
            try {
                const apiUrl = `/api/players/${userId}/score`;
                const xhr = new XMLHttpRequest();
                xhr.open('PATCH', apiUrl, false); // false = synchronous
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify({ value: finalScore }));
                console.log(`✅ XHR Status: ${xhr.status} - Score saved synchronously`);
            } catch (xhrError) {
                console.error('❌ XHR failed:', xhrError);
                // At this point we've already saved to localStorage, so the score isn't lost
            }
        } catch (error) {
            console.error('❌ Failed to save final score:', error);
        }
    };

    // Function to load game state from MongoDB
    const loadGameState = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        try {
            const playerData = await fetchPlayerData(userId);

            if (playerData) {
                // Set all state from retrieved data
                setPoint(playerData.point || 0);
                setCharacters(playerData.characters || []);
                setCoupons(playerData.coupons || []);
                setStores(
                    playerData.stores || [{ name: 'Default Store', point: 0, color: 'blue' }]
                );
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
    }, [
        userId,
        setPoint,
        setCharacters,
        setCoupons,
        setStores,
        setSelectedStore,
        setStamina,
        setDrawCount,
        setRemainingDraws,
        setScore,
        stores,
    ]);

    // Load player data when userId changes
    useEffect(() => {
        if (userId) {
            loadGameState();
        }
    }, [userId, loadGameState]);

    // Auto-save game state when critical data changes (with debounce)
    useEffect(() => {
        if (!userId) return;

        const timeoutId = setTimeout(() => {
            saveGameState();
        }, 2000); // Debounce for 2 seconds

        return () => clearTimeout(timeoutId);
    }, [point, characters, coupons, stores, selectedStore, stamina, score, userId, saveGameState]);

    // Split event listeners into two groups: those that need userId and those that don't
    
    // Listen for essential game events that should work regardless of authentication
    useEffect(() => {
        // Handle score update event from the game - This should ALWAYS work
        const handleScoreUpdated = (newScore: number) => {
            console.log('Score event received from game:', newScore);
            
            // Always update UI immediately
            setScore(newScore);
            
            // If userId exists, also update the database
            if (userId) {
                console.log(`User ID available (${userId}), updating score in database`);
                
                // Save the score to localStorage as backup before sending to server
                try {
                    localStorage.setItem('lastScore', newScore.toString());
                    localStorage.setItem('lastScoreTimestamp', Date.now().toString());
                    localStorage.setItem('lastScoreUserId', userId);
                } catch (e) {
                    console.error('Error saving score to localStorage:', e);
                }
                
                // Update the score with retry logic
                console.log(`💰 Updating score for ${userId}: ${newScore}`);
                
                // Function to attempt update with retries
                const attemptScoreUpdate = (score: number, retriesLeft = 3) => {
                    apiClient.patch(`/api/players/${userId}/score`, { value: score })
                        .then(response => {
                            console.log('✅ Score update successful:', response.data);
                        })
                        .catch(error => {
                            console.error('❌ Error updating score:', error);
                            if (retriesLeft > 0) {
                                console.log(`🔄 Retrying score update. Attempts left: ${retriesLeft-1}`);
                                setTimeout(() => attemptScoreUpdate(score, retriesLeft - 1), 1000);
                            }
                        });
                };
                
                // Throttle score updates to not overload the server
                // Use a timeout instead of a throttle function since we're in a plain function
                if (throttleTimer) {
                    clearTimeout(throttleTimer);
                }
                throttleTimer = setTimeout(() => {
                    attemptScoreUpdate(newScore);
                }, 300);
            } else {
                console.warn('Score updated but userId not available - database not updated');
            }
        };
        
        // Handle point collection event from the game
        const handlePointCollected = (amount: number) => {
            setPoint((prev) => prev + amount);
        };

        // Always listen for score and point updates regardless of userId status
        EventBus.on('scoreUpdated', handleScoreUpdated);
        EventBus.on('pointCollected', handlePointCollected);

        return () => {
            EventBus.removeListener('scoreUpdated', handleScoreUpdated);
            EventBus.removeListener('pointCollected', handlePointCollected);
        };
    }, [userId]); // Include userId as dependency for the database update
    
    // Listen for user-specific events (needs userId)
    useEffect(() => {
        if (!userId) return;
        
        // Handle coupon collection event from the game
        const handleCouponCollected = (coupon: Coupon) => {
            setCoupons((prev) => [...prev, coupon]);
        };

        EventBus.on('couponCollected', handleCouponCollected);

        return () => {
            EventBus.removeListener('couponCollected', handleCouponCollected);
        };
    }, [userId]);
    
    // Handle beforeunload event to save score when closing app
    useEffect(() => {
        if (!userId) return;
        
        console.log('🔔 Setting up page close handlers for userId:', userId);

        // Handle beforeunload - first event that fires when page is about to close
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            console.log('🚫 Window closing, saving final score...', score);
            saveScoreSynchronously(userId, score);
            // Modern browsers don't respect this anymore for security reasons
            event.returnValue = '';
            return '';
        };
        
        // Handle visibilitychange - fires when user switches tabs or minimizes
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                console.log('👀 Page hidden, saving score...', score);
                saveScoreSynchronously(userId, score);
            }
        };
        
        // Handle pagehide - more reliable than beforeunload in some browsers
        const handlePageHide = () => {
            console.log('🗄️ Page hide, saving score...', score);
            saveScoreSynchronously(userId, score);
        };

        // Register all events for maximum reliability
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pagehide', handlePageHide);

        return () => {
            // Clean up event listeners when component unmounts
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pagehide', handlePageHide);
        };
    }, [userId, score]);
    
    // Listen for game initialization
    useEffect(() => {
        const handleGameInitialized = () => {
            console.log('Game initialized');
        };
        
        EventBus.on('gameInitialized', handleGameInitialized);
        
        return () => {
            EventBus.removeListener('gameInitialized', handleGameInitialized);
        };
    }, []);

    // Define updateScore function with throttling for direct score updates
    const updateScore = useCallback((newScore: number) => {
        // Always update UI immediately
        setScore(newScore);
        
        if (!userId) return;
        
        // Skip if a save is already pending
        if (throttleTimer) return;
        
        // Set throttle timer
        throttleTimer = setTimeout(() => {
            updateScoreInDatabase(userId, newScore)
                .catch(err => console.error('Failed to update score:', err))
                .finally(() => {
                    throttleTimer = null;
                });
        }, 300); // 300ms throttle is a good balance
    }, [userId]);

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
        loadGameState,
        updateScore,
        isLoading,
    };

    // Use React.createElement instead of JSX
    return React.createElement(GameStateContext.Provider, { value }, props.children);
};

// Custom hook to use the game state
export const useGameState = () => useContext(GameStateContext);
