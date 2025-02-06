import React, { useState } from 'react';

interface Character {
  id: string;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  discount: string;
  isUsing: boolean;
}

export function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: '1',
      name: 'Hamster',
      image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=200&q=80',
      rarity: 'common',
      discount: '10% Discount',
      isUsing: true
    },
    {
      id: '2',
      name: 'Elemental Cat',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=200&q=80',
      rarity: 'epic',
      discount: 'Buy 1 Get 1',
      isUsing: true
    },
    {
      id: '3',
      name: 'Evil Dog',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80',
      rarity: 'legendary',
      discount: '25% Discount',
      isUsing: true
    },
    // Inventory characters
    {
      id: '4',
      name: 'Hamster',
      image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=200&q=80',
      rarity: 'common',
      discount: '10% Discount',
      isUsing: false
    },
    {
      id: '5',
      name: 'Hamster',
      image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=200&q=80',
      rarity: 'common',
      discount: '10% Discount',
      isUsing: false
    }
  ]);

  const toggleCharacterUse = (id: string) => {
    const usingCharacters = characters.filter(char => char.isUsing).length;
    
    setCharacters(prev => prev.map(char => {
      if (char.id === id) {
        if (!char.isUsing && usingCharacters >= 3) {
          return char;
        }
        return { ...char, isUsing: !char.isUsing };
      }
      return char;
    }));
  };

  const usingCharacters = characters.filter(char => char.isUsing);
  const inventoryCharacters = characters.filter(char => !char.isUsing);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-blue-100';
      case 'rare': return 'bg-purple-100';
      case 'epic': return 'bg-pink-100';
      case 'legendary': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-300 pt-16 pb-20">
      {/* Using Section */}
      <div className="px-3 mb-4">
        <div className="w-full bg-white/90 rounded-xl p-2.5 mb-3 shadow-lg">
          <span className="text-lg font-bold">Using ({usingCharacters.length}/3)</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {usingCharacters.map(char => (
            <div
              key={char.id}
              className={`${getRarityColor(char.rarity)} rounded-xl p-2 shadow-lg relative cartoon-border`}
            >
              <img
                src={char.image}
                alt={char.name}
                className="w-full aspect-square object-cover rounded-lg mb-1.5"
              />
              <div className="text-center">
                <h3 className="font-bold text-xs mb-0.5">{char.name}</h3>
                <p className="text-[10px] font-medium">{char.discount}</p>
              </div>
              <button
                onClick={() => toggleCharacterUse(char.id)}
                className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-lg"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory Section */}
      <div className="px-3">
        <div className="w-full bg-white/90 rounded-xl p-2.5 mb-3 shadow-lg">
          <span className="text-lg font-bold">Inventory ({inventoryCharacters.length})</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {inventoryCharacters.map(char => (
            <div
              key={char.id}
              className={`${getRarityColor(char.rarity)} rounded-xl p-2 shadow-lg relative cartoon-border`}
            >
              <img
                src={char.image}
                alt={char.name}
                className="w-full aspect-square object-cover rounded-lg mb-1.5"
              />
              <div className="text-center">
                <h3 className="font-bold text-xs mb-0.5">{char.name}</h3>
                <p className="text-[10px] font-medium">{char.discount}</p>
              </div>
              <button
                onClick={() => toggleCharacterUse(char.id)}
                disabled={usingCharacters.length >= 3}
                className={`absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 ${
                  usingCharacters.length >= 3
                    ? 'bg-gray-400'
                    : 'bg-green-500'
                } text-white text-[10px] px-2 py-0.5 rounded-full shadow-lg`}
              >
                {usingCharacters.length >= 3 ? 'Full' : 'Use'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}