// src/hooks/useGameEvents.ts
import { useEffect } from 'react';
import { EventBus } from '../game/EventBus';
import { useUserSync } from './useUserSync';

/**
 * Hook to listen for game events and update React state
 */
export const useGameEvents = () => {
  const { user, setUser } = useUserSync();

  // Listen for score updates from the game
  useEffect(() => {
    // Skip if no user loaded yet
    if (!user) return;

    const handleScoreUpdate = (score: number) => {
      console.log('🎮 Game score updated:', score);
      
      // Only update if score has actually changed
      if (user.score !== score) {
        const updatedUser = { 
          ...user, 
          score 
        };
        
        // Update local state and save to database
        setUser(updatedUser);
      }
    };

    // Subscribe to the score update event
    EventBus.on('scoreUpdated', handleScoreUpdate);

    // Clean up event listener on unmount
    return () => {
      EventBus.off('scoreUpdated', handleScoreUpdate);
    };
  }, [user, setUser]);

  return null;
};
