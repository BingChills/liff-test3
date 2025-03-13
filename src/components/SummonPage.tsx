import React, { useState, useEffect } from 'react';
import { Store, Gem, ChevronDown, Percent } from 'lucide-react';
import { useGameState, Character, StoreCurrency } from '../state/gameState';
import PageHeader from './PageHeader';

const SummonPage = () => {
  const { 
    stores, 
    setStores, 
    selectedStore, 
    setSelectedStore, 
    point, 
    setPoint, 
    characters, 
    setCharacters 
  } = useGameState();
  const [showDropRates, setShowDropRates] = useState(false);
  const [showStoreSelector, setShowStoreSelector] = useState(false);
  const [showEggAnimation, setShowEggAnimation] = useState(false);
  const [drawCount, setDrawCount] = useState(0);
  const [remainingDraws, setRemainingDraws] = useState(0);

  const handleSelectStore = (store: typeof selectedStore) => {
    setSelectedStore(store);
    setShowStoreSelector(false);
  };

  const handleSummon = (isTenDraw: boolean) => {
    // Each character costs 100 points regardless of store
    const characterCost = 100;
    const drawCost = characterCost * (isTenDraw ? 10 : 1);
    
    // Check if user has enough points in the selected store
    if (selectedStore.point < drawCost) {
      console.log(`You only have ${selectedStore.point} ${selectedStore.name} points. Need ${drawCost} points.`);
      return;
    }

    // Update the points for the selected store
    const updatedStores = stores.map(store => 
      store.name === selectedStore.name 
        ? { ...store, point: store.point - drawCost } 
        : store
    );
    
    // Update the selected store with reduced points
    const updatedSelectedStore = { ...selectedStore, point: selectedStore.point - drawCost };
    
    // Update global state
    setStores(updatedStores);
    setSelectedStore(updatedSelectedStore);

    // Set up animation
    setShowEggAnimation(true);
    setDrawCount(isTenDraw ? 10 : 1);
    setRemainingDraws(isTenDraw ? 10 : 1);

    // Schedule character reveal
    setTimeout(() => {
      setShowEggAnimation(false);
      generateCharacters(isTenDraw ? 10 : 1);
    }, 3000); // 3 second animation
  };

  const generateCharacters = (count: number) => {
    // Mock character generation
    const rarities = ['common', 'rare', 'epic', 'legendary'] as const;
    const newCharacters: Character[] = [];

    for (let i = 0; i < count; i++) {
      // Random rarity (weighted)
      const random = Math.random();
      let rarity: typeof rarities[number];
      if (random < 0.01) rarity = 'legendary';
      else if (random < 0.1) rarity = 'epic';
      else if (random < 0.3) rarity = 'rare';
      else rarity = 'common';

      newCharacters.push({
        id: `char-${Date.now()}-${i}`,
        name: `${selectedStore.name} Character ${Math.floor(Math.random() * 100)}`,
        image: '',
        rarity,
        discount: `${Math.floor(Math.random() * 30) + 10}% off at ${selectedStore.name}`,
        isUsing: false,
        company: selectedStore.name
      });
    }

    setCharacters([...characters, ...newCharacters]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-300 pb-24">
      {/* Header with user profile and resources */}
      <PageHeader 
        title="Summon Characters" 
        subtitle="Get new characters for your collection" 
        icon={<Store className="w-8 h-8 text-blue-600" />} 
      />
      
      {/* Summon content */}
      <div className="px-4 mt-4 pb-20">
        <div className="bg-white/90 rounded-xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedStore.name} Summon
            </h2>
            <p className="text-gray-600">
              Spend point to get characters from {selectedStore.name}
            </p>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="w-40 h-40 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
              <Gem className="w-20 h-20 text-blue-500" />
            </div>
          </div>
          
          <div className="flex flex-col gap-4 mb-6">
            <button 
              onClick={() => handleSummon(false)}
              disabled={selectedStore.point < 100}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-md ${
                selectedStore.point < 100 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Single Draw (100 points)
            </button>
            <button 
              onClick={() => handleSummon(true)}
              disabled={selectedStore.point < 1000}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-md ${
                selectedStore.point < 1000 ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              10x Draw (1,000 points)
            </button>
          </div>
          
          <button 
            onClick={() => setShowDropRates(!showDropRates)}
            className="flex items-center gap-2 mx-auto text-blue-600 font-medium"
          >
            <Percent size={16} />
            {showDropRates ? 'Hide' : 'Show'} Drop Rates
          </button>
          
          {showDropRates && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-gray-700 mb-2">Character Drop Rates</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Common</span>
                  <span className="font-medium">70%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rare</span>
                  <span className="font-medium">20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Epic</span>
                  <span className="font-medium">9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Legendary</span>
                  <span className="font-medium">1%</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Recent summons would go here */}
      </div>
      
      {/* Egg Animation Overlay */}
      {showEggAnimation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-40 h-40 mx-auto bg-white rounded-full flex items-center justify-center animate-pulse shadow-xl">
              <Gem className="w-20 h-20 text-blue-500" />
            </div>
            <p className="text-white text-2xl font-bold mt-6">Summoning...</p>
            <p className="text-white mt-2">
              {remainingDraws} character{remainingDraws !== 1 ? 's' : ''} remaining
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummonPage;
