"use client";
import React, { useState } from 'react';
import { User, Coins, Timer, Cat, Gem, ChevronDown } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  discount: string;
  isUsing: boolean;
}

interface StoreCurrency {
  name: string;
  gems: number;
  color: string;
}

export function CharactersPage() {
  const [showStoreSelector, setShowStoreSelector] = React.useState(false);
  const [stores] = React.useState<StoreCurrency[]>([
    { name: 'Parabola', gems: 1600, color: 'emerald' },
    { name: 'KFC', gems: 850, color: 'red' },
    { name: 'Pizza Company', gems: 1200, color: 'blue' },
    { name: 'Pizza Hut', gems: 950, color: 'orange' }
  ]);
  const [selectedStore, setSelectedStore] = React.useState(stores[0]);

  const [characters, setCharacters] = useState<Character[]>([
    // Using Characters
    {
      id: '1',
      name: "Phoenix Bird",
      image: "https://images.unsplash.com/photo-1557401620-67270b61ea81?auto=format&fit=crop&w=200&q=80",
      rarity: "legendary",
      discount: "50% Off Any Order",
      isUsing: true
    },
    {
      id: '2',
      name: "Spirit Tiger",
      image: "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&w=200&q=80",
      rarity: "epic",
      discount: "Buy 2 Get 1 Free",
      isUsing: true
    },
    {
      id: '3',
      name: "Golden Retriever",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&q=80",
      rarity: "rare",
      discount: "15% Discount",
      isUsing: true
    },
    // Inventory Characters
    {
      id: '4',
      name: "Dragon Spirit",
      image: "https://images.unsplash.com/photo-1577493340887-b7bfff550145?auto=format&fit=crop&w=200&q=80",
      rarity: "legendary",
      discount: "Buy 1 Get 2 Free",
      isUsing: false
    },
    {
      id: '5',
      name: "Crystal Fox",
      image: "https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=200&q=80",
      rarity: "epic",
      discount: "40% Weekend Discount",
      isUsing: false
    },
    {
      id: '6',
      name: "Mystic Wolf",
      image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=200&q=80",
      rarity: "epic",
      discount: "30% Off Everything",
      isUsing: false
    },
    {
      id: '7',
      name: "Arctic Fox",
      image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=200&q=80",
      rarity: "rare",
      discount: "20% Off",
      isUsing: false
    },
    {
      id: '8',
      name: "Mysterious Cat",
      image: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=200&q=80",
      rarity: "rare",
      discount: "Buy 1 Get 1 Free",
      isUsing: false
    },
    {
      id: '9',
      name: "Friendly Hamster",
      image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=200&q=80",
      rarity: "common",
      discount: "10% Discount",
      isUsing: false
    },
    {
      id: '10',
      name: "Sleepy Cat",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=200&q=80",
      rarity: "common",
      discount: "5% Off",
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

  const getStoreColor = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-400';
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      case 'orange': return 'bg-orange-500';
      default: return 'bg-emerald-400';
    }
  };

  const handleStoreSelect = (store: StoreCurrency) => {
    setSelectedStore(store);
    setShowStoreSelector(false);
  };

  const usingCharacters = characters.filter(char => char.isUsing);
  const inventoryCharacters = characters.filter(char => !char.isUsing);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100';
      case 'rare': return 'bg-blue-100';
      case 'epic': return 'bg-purple-100';
      case 'legendary': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-300 pt-32 pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-blue-200 to-blue-200/95 pt-4 pb-4 px-4 z-30">
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>

          <div className="flex items-center gap-2">
            {/* Store Selector */}
            <div className="relative">
              <button
                onClick={() => setShowStoreSelector(!showStoreSelector)}
                className="flex items-center gap-2 bg-black/60 px-3 py-2 rounded-xl"
              >
                <div className={`w-4 h-4 rounded-full ${getStoreColor(selectedStore.color)} flex items-center justify-center`}>
                  <Gem className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-sm font-bold text-white">{selectedStore.gems}</span>
                <ChevronDown className="w-4 h-4 text-white/80" />
              </button>

              {showStoreSelector && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-xl shadow-xl overflow-hidden z-50">
                  {stores.map((store) => (
                    <button
                      key={store.name}
                      onClick={() => handleStoreSelect(store)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${getStoreColor(store.color)} flex items-center justify-center`}>
                          <Gem className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{store.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{store.gems}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1.5 rounded-full">
              <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                <Coins className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">2.8m</span>
            </div>
            
            <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1.5 rounded-full">
              <div className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center">
                <Timer className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">18/20</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center">
            <Cat className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white drop-shadow-lg">Characters</h1>
            <p className="text-white/80 text-sm mt-1">Manage your collection!</p>
          </div>
        </div>
      </div>

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

/*
https://i.ibb.co/bRJ8L6rL/51-EA0-A65-A258-EE93-C8-D328-FF2-B1-D208645-DB7-AE8.jpg
https://i.ibb.co/Mbvwq6g/149644205-F43-FBF4-E8-C09-EFA7-A19-EC52307-B3945.jpg
https://i.ibb.co/gLqrCFc3/EEC2-D44688-BD00-BBE2-B38-F45-BF5-D67-D39-B4657-F7.jpg
https://i.ibb.co/8DjcHwND/0-C56-A55-CAB9-DC8-B6-C523-F3827-C559-D0229438-E79.jpg
https://i.ibb.co/F42HSdJ4/54-C5-D368-AA7-BC0184-F5-CA7-C12-F2973213-A693169.jpg
*/