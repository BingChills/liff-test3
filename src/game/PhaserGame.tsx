import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
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
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    game: gameRef.current,
    getCurrentScene: () => {
      if (!gameRef.current) return null;
      return gameRef.current.scene.getScene('Game');
    }
  }));

  // Initialize the Phaser game
  useEffect(() => {
    if (containerRef.current && !gameRef.current) {
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

      // Create the game instance
      gameRef.current = new Phaser.Game(config);
      
      // Let React know when the game scene is ready
      EventBus.on('current-scene-ready', (scene: Phaser.Scene) => {
        console.log('Game scene is ready:', scene);
      });
    }

    // Cleanup on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      EventBus.removeAllListeners();
    };
  }, []);

  // Handle tab changes
  useEffect(() => {
    if (!gameRef.current) return;
    
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
    />
  );
});

// Set display name for debugging
PhaserGame.displayName = 'PhaserGame';
