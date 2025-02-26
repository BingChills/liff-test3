"use client";
import React, { useEffect, useState } from 'react';

interface Character {
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  discount: string;
}

interface EggAnimationProps {
  isVisible: boolean;
  onAnimationEnd: () => void;
  drawCount?: number;
}

// Rarity rates configuration
const RARITY_RATES = {
  common: 0.10,    // 10% chance
  rare: 0.70,      // 70% chance
  epic: 0.15,      // 15% chance
  legendary: 0.05  // 5% chance
};

const CHARACTERS: Character[] = [
  // Common Characters
  {
    name: "Friendly Hamster",
    image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=200&q=80",
    rarity: "common",
    discount: "10% Discount"
  },
  {
    name: "Sleepy Cat",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=200&q=80",
    rarity: "common",
    discount: "5% Off"
  },
  {
    name: "Playful Puppy",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80",
    rarity: "common",
    discount: "Free Drink"
  },
  
  // Rare Characters
  {
    name: "Golden Retriever",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&q=80",
    rarity: "rare",
    discount: "15% Discount"
  },
  {
    name: "Mysterious Cat",
    image: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=200&q=80",
    rarity: "rare",
    discount: "Buy 1 Get 1 Free"
  },
  {
    name: "Arctic Fox",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=200&q=80",
    rarity: "rare",
    discount: "20% Off"
  },
  {
    name: "Red Panda",
    image: "https://images.unsplash.com/photo-1590692464430-96ff0b53f82f?auto=format&fit=crop&w=200&q=80",
    rarity: "rare",
    discount: "Free Appetizer"
  },
  
  // Epic Characters
  {
    name: "Mystic Wolf",
    image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=200&q=80",
    rarity: "epic",
    discount: "30% Off Everything"
  },
  {
    name: "Spirit Tiger",
    image: "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&w=200&q=80",
    rarity: "epic",
    discount: "Buy 2 Get 1 Free"
  },
  {
    name: "Crystal Fox",
    image: "https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=200&q=80",
    rarity: "epic",
    discount: "40% Weekend Discount"
  },
  
  // Legendary Characters
  {
    name: "Phoenix Bird",
    image: "https://images.unsplash.com/photo-1557401620-67270b61ea81?auto=format&fit=crop&w=200&q=80",
    rarity: "legendary",
    discount: "50% Off Any Order"
  },
  {
    name: "Dragon Spirit",
    image: "https://images.unsplash.com/photo-1577493340887-b7bfff550145?auto=format&fit=crop&w=200&q=80",
    rarity: "legendary",
    discount: "Buy 1 Get 2 Free"
  },
  {
    name: "Ancient Guardian",
    image: "https://images.unsplash.com/photo-1533582437341-eac7c1f8229c?auto=format&fit=crop&w=200&q=80",
    rarity: "legendary",
    discount: "70% Special Discount"
  }
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'bg-gray-100';
    case 'rare': return 'bg-blue-100';
    case 'epic': return 'bg-purple-100';
    case 'legendary': return 'bg-yellow-100';
    default: return 'bg-gray-100';
  }
};

const getRarityEggStyle = (rarity: string) => {
  switch (rarity) {
    case 'legendary':
      return {
        egg: 'from-yellow-500 via-yellow-400 to-yellow-600',
        glow: 'from-yellow-400/30 to-transparent',
        rays: 'bg-yellow-400/20'
      };
    case 'epic':
      return {
        egg: 'from-purple-500 via-purple-400 to-purple-600',
        glow: 'from-purple-400/30 to-transparent',
        rays: 'bg-purple-400/20'
      };
    case 'rare':
      return {
        egg: 'from-blue-500 via-blue-400 to-blue-600',
        glow: 'from-blue-400/30 to-transparent',
        rays: 'bg-blue-400/20'
      };
    default:
      return {
        egg: 'from-gray-800 via-gray-700 to-gray-900',
        glow: 'from-white/10 to-transparent',
        rays: 'bg-white/10'
      };
  }
};

const determineRarity = (rand: number): Character['rarity'] => {
  if (rand < RARITY_RATES.legendary) return 'legendary';
  if (rand < RARITY_RATES.legendary + RARITY_RATES.epic) return 'epic';
  if (rand < RARITY_RATES.legendary + RARITY_RATES.epic + RARITY_RATES.rare) return 'rare';
  return 'common';
};

export function EggAnimation({ isVisible, onAnimationEnd, drawCount = 1 }: EggAnimationProps) {
  const [showCharacters, setShowCharacters] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [highestRarity, setHighestRarity] = useState<string>('common');

  useEffect(() => {
    if (isVisible && !showCharacters) {
      // Generate characters based on rarity rates
      const newCharacters = Array.from({ length: drawCount }, () => {
        const rand = Math.random();
        const selectedRarity = determineRarity(rand);
        const possibleCharacters = CHARACTERS.filter(c => c.rarity === selectedRarity);
        return possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)];
      });

      // Find highest rarity for animation
      const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
      const highest = newCharacters.reduce((acc, char) => 
        rarityOrder[char.rarity] > rarityOrder[acc] ? char.rarity : acc
      , 'common' as Character['rarity']);
      
      setHighestRarity(highest);
      setCharacters(newCharacters);
      setCurrentCharacterIndex(0);

      // Show egg cracking animation for 1.5 seconds, then reveal characters
      setTimeout(() => {
        setShowCharacters(true);
      }, 1500);
    }

    return () => {
      setShowCharacters(false);
      setCharacters([]);
      setCurrentCharacterIndex(0);
      setHighestRarity('common');
    };
  }, [isVisible, drawCount]);

  const handleNext = () => {
    if (currentCharacterIndex < characters.length - 1) {
      setCurrentCharacterIndex(prev => prev + 1);
    } else {
      setShowCharacters(false);
      setCharacters([]);
      setCurrentCharacterIndex(0);
      onAnimationEnd();
    }
  };

  if (!isVisible) return null;

  const styles = getRarityEggStyle(highestRarity);
  const currentCharacter = characters[currentCharacterIndex];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={showCharacters ? handleNext : undefined}
    >
      {!showCharacters ? (
        // Egg cracking animation with rarity-based effects
        <div className="relative w-80 h-80">
          {/* Background rays */}
          {highestRarity !== 'common' && (
            <>
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute top-1/2 left-1/2 h-40 w-2 ${styles.rays} rounded-full animate-rays`}
                  style={{
                    '--rotation': `${i * 30}deg`,
                    transform: `rotate(${i * 30}deg) translateY(-50%)`,
                    transformOrigin: '50% 0',
                  } as any}
                />
              ))}
            </>
          )}

          {/* Glow effect */}
          {highestRarity !== 'common' && (
            <div className={`absolute inset-0 rounded-full bg-gradient-radial ${styles.glow} animate-pulse`} />
          )}

          {/* Main egg */}
          <div className="absolute inset-0 animate-float">
            <div className="relative w-48 h-60 mx-auto">
              <div className={`absolute inset-0 bg-gradient-to-br ${styles.egg} rounded-[45%] shadow-xl ${
                highestRarity === 'legendary' ? 'animate-legendary-pulse' :
                highestRarity === 'epic' ? 'animate-epic-pulse' :
                highestRarity === 'rare' ? 'animate-rare-pulse' :
                'animate-pulse'
              }`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`text-6xl font-bold ${
                    highestRarity === 'legendary' ? 'text-yellow-300' :
                    highestRarity === 'epic' ? 'text-purple-300' :
                    highestRarity === 'rare' ? 'text-blue-300' :
                    'text-gray-400'
                  } animate-pulse`}>?</div>
                </div>
              </div>

              {/* Sparkles for legendary and epic */}
              {(highestRarity === 'legendary' || highestRarity === 'epic') && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-4 h-4 rounded-full ${
                        highestRarity === 'legendary' ? 'bg-yellow-300' : 'bg-purple-300'
                      } animate-sparkle`}
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-sm p-4">
          {currentCharacter && (
            <div className="transform animate-scale-up">
              <div className={`rounded-3xl overflow-hidden bg-gradient-to-br ${
                currentCharacter.rarity === 'legendary' ? 'from-yellow-400 to-yellow-500' :
                currentCharacter.rarity === 'epic' ? 'from-purple-400 to-purple-500' :
                currentCharacter.rarity === 'rare' ? 'from-blue-400 to-blue-500' :
                'from-gray-400 to-gray-500'
              } p-4 shadow-2xl ${
                currentCharacter.rarity === 'legendary' ? 'animate-legendary-shine' :
                currentCharacter.rarity === 'epic' ? 'animate-epic-shine' :
                currentCharacter.rarity === 'rare' ? 'animate-rare-shine' : ''
              }`}>
                <div className="bg-white/90 rounded-2xl p-4 space-y-4">
                  <div className="w-full aspect-square rounded-xl overflow-hidden ring-4 ring-white/50">
                    <img
                      src={currentCharacter.image}
                      alt={currentCharacter.name}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform"
                    />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{currentCharacter.name}</h3>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                      currentCharacter.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' :
                      currentCharacter.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                      currentCharacter.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {currentCharacter.rarity.charAt(0).toUpperCase() + currentCharacter.rarity.slice(1)}
                    </div>
                    <p className="text-sm text-gray-600">{currentCharacter.discount}</p>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-white text-sm">
                  {currentCharacterIndex < characters.length - 1 ? 'Tap to reveal next character' : 'Tap to continue'}
                </p>
                <p className="text-white/60 text-xs mt-1">
                  {currentCharacterIndex + 1} of {characters.length}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}