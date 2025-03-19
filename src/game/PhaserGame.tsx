import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Phaser from 'phaser';
import { Game } from './scenes/Game';
import { useGameState } from '../state/gameState';
import { EventBus } from './EventBus';

// Define the interface for ref access
export interface IRefPhaserGame {
  game: Phaser.Game | null;
  getCurrentScene: () => Phaser.Scene | null;
}

type PhaserGameProps = {
  // Any props can go here
};

export const PhaserGame = forwardRef<IRefPhaserGame, PhaserGameProps>((props, ref) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeTab } = useGameState();
  const [initError, setInitError] = useState<string | null>(null);
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    game: gameRef.current,
    getCurrentScene: () => {
      if (!gameRef.current) return null;
      try {
        return gameRef.current.scene.getScene('Game');
      } catch (err) {
        console.error('Error getting game scene:', err);
        return null;
      }
    }
  }));

  // Initialize the Phaser game
  useEffect(() => {
    // Make sure we're in browser environment
    if (typeof window === 'undefined') {
      console.log('Skipping Phaser initialization - not in browser environment');
      return;
    }

    if (containerRef.current && !gameRef.current) {
      try {
        // Configure the game
        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          parent: containerRef.current,
          backgroundColor: "#7DAE82",
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 360,
            height: 640,
          },
          physics: {
            default: "arcade",
            arcade: {
              gravity: { x: 0, y: 0 },
              debug: false,
            },
          },
          scene: [Game],
        };

        console.log('Creating Phaser game instance...');
        // Create the game instance
        gameRef.current = new Phaser.Game(config);
        
        // Let React know when the game scene is ready
        EventBus.on('current-scene-ready', (scene: Phaser.Scene) => {
          console.log('Game scene is ready:', scene);
        });
      } catch (error) {
        console.error('Error initializing Phaser game:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown error initializing game');
      }
    }

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        try {
          gameRef.current.destroy(true);
          gameRef.current = null;
        } catch (error) {
          console.error('Error destroying Phaser game:', error);
        }
      }
      EventBus.removeAllListeners();
    };
  }, []);

  // Handle tab changes
  useEffect(() => {
    if (!gameRef.current || typeof window === 'undefined') return;
    
    try {
      // Pause/resume game based on active tab
      if (activeTab !== 'game') {
        // Pause the game when not on the game tab
        if (gameRef.current.scene.isActive('Game')) {
          gameRef.current.scene.pause('Game');
          console.log('Game paused');
        }
      } else {
        // Resume the game when on the game tab
        if (gameRef.current.scene.isPaused('Game')) {
          gameRef.current.scene.resume('Game');
          console.log('Game resumed');
        }
      }
      
      // Force resize to ensure proper scaling when switching back to game tab
      if (activeTab === 'game') {
        window.dispatchEvent(new Event('resize'));
      }
    } catch (error) {
      console.error('Error handling tab change:', error);
    }
  }, [activeTab]);

  return (
    <div 
      ref={containerRef} 
      className="phaser-container"
      style={{ 
        width: '100%', 
        height: '100%',
        visibility: activeTab === 'game' ? 'visible' : 'hidden' 
      }}
    >
      {initError && (
        <div className="game-error-message" style={{
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,0,0,0.1)',
          padding: '20px',
          borderRadius: '8px',
          color: 'red',
          maxWidth: '80%',
          textAlign: 'center'
        }}>
          <p>Unable to initialize game: {initError}</p>
          <p>Try refreshing the page</p>
        </div>
      )}
    </div>
  );
});

// Set display name for debugging
PhaserGame.displayName = 'PhaserGame';
