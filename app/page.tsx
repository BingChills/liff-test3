"use client";
import React, { useState } from 'react';
import { Gem, Coins, Timer, User, Ticket, Cat, Store, Trophy, Gamepad2, ChevronDown, Percent } from 'lucide-react';
import { CharactersPage } from './components/CharactersPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import UserProfileModal from './components/UserProfileModal';
import { CouponPage } from './components/CouponPage';
import { TradePage } from './components/TradePage';
import { EggAnimation } from './components/EggAnimation';
import { useLiff } from "./context/LiffContext";

interface StoreCurrency {
  name: string;
  gems: number;
  color: string;
}

function App() {
  const [showDropRates, setShowDropRates] = useState(false);
  const [showEggAnimation, setShowEggAnimation] = useState(false);
  const [showStoreSelector, setShowStoreSelector] = useState(false);
  const [drawCount, setDrawCount] = useState(0);
  const [remainingDraws, setRemainingDraws] = useState(0);
  const [coins, setCoins] = useState(2800000);
  const [stamina, setStamina] = useState({ current: 18, max: 20 });
  const [activeTab, setActiveTab] = useState('summon');
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { user } = useLiff();
  
  const [stores] = useState<StoreCurrency[]>([
    { name: 'Parabola', gems: 1600, color: 'emerald' },
    { name: 'KFC', gems: 850, color: 'red' },
    { name: 'Pizza Company', gems: 1200, color: 'blue' },
    { name: 'Pizza Hut', gems: 950, color: 'orange' }
  ]);
  
  const [selectedStore, setSelectedStore] = useState(stores[0]);

  const handleSummon = (amount: number, cost: number) => {
    if (selectedStore.gems >= cost) {
      // Update store gems
      const updatedStores = stores.map(store => 
        store.name === selectedStore.name 
          ? { ...store, gems: store.gems - cost }
          : store
      );
      setSelectedStore(prev => ({ ...prev, gems: prev.gems - cost }));
      
      // Start the drawing process
      setDrawCount(amount);
      setRemainingDraws(amount);
      setShowEggAnimation(true);
    }
  };

  const handleStoreSelect = (store: StoreCurrency) => {
    setSelectedStore(store);
    setShowStoreSelector(false);
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

  const renderContent = () => {
    switch (activeTab) {
      case 'characters':
        return <CharactersPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'coupon':
        return <CouponPage />;
      case 'trade':
        return <TradePage />;
      case 'summon':
        return (
          <div className="flex flex-col min-h-screen">
            {/* Title */}
            <div className="text-center mt-20 mb-4">
              <h1 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                Summon Characters
              </h1>
              <p className="text-white/90 text-lg font-medium">
                Draw powerful characters to join your team!
              </p>
              {remainingDraws > 0 && (
                <div className="mt-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full inline-block">
                  <span className="text-white font-bold">
                    {remainingDraws} draw{remainingDraws > 1 ? 's' : ''} remaining
                  </span>
                </div>
              )}
            </div>

            {/* Drop Rates Button */}
            <button
              onClick={() => setShowDropRates(true)}
              className="absolute top-20 right-4 bg-white/90 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 hover:bg-white transition-colors"
            >
              <Percent className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">Drop Rates</span>
            </button>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-between px-4 pb-24">
              {/* Mystery Egg Display */}
              <div className="relative w-64 h-64 mb-8">
                <div className="absolute inset-0 bg-white/10 rounded-full animate-spin-slow" />
                <div className="absolute inset-2 border-2 border-white/30 rounded-full animate-spin-reverse" />
                <div className="absolute inset-4 border-2 border-white/20 rounded-full animate-pulse" />
                <div className="absolute inset-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full animate-pulse" />
              </div>

              {/* Summon Buttons */}
              <div className="w-full max-w-md space-y-4 mt-auto">
                <button
                  onClick={() => handleSummon(1, 50)}
                  className="summon-button w-full relative group"
                  disabled={selectedStore.gems < 50 || remainingDraws > 0}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-[0_4px_0_#166534]" />
                  <div className="relative px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                        <Gem className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-black text-white">Draw Once</div>
                        <div className="text-sm text-white/80">Get 1 character</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                      <Gem className="w-5 h-5 text-white" />
                      <span className="text-lg font-bold text-white">50</span>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleSummon(10, 500)}
                  className="summon-button w-full relative group"
                  disabled={selectedStore.gems < 500 || remainingDraws > 0}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl shadow-[0_4px_0_#1e40af]" />
                  <div className="relative px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                        <Gem className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-black text-white">Draw 10x</div>
                        <div className="text-sm text-white/80">Draw multiple characters!</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                      <Gem className="w-5 h-5 text-white" />
                      <span className="text-lg font-bold text-white">500</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#87CEEB] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#F4D03F]" />
        <div className="absolute left-4 bottom-32 w-24 h-32">
          <div className="absolute bottom-0 w-full h-full bg-[#228B22] rounded-t-full transform -skew-x-6" />
        </div>
        <div className="absolute right-4 bottom-40 w-20 h-28">
          <div className="absolute bottom-0 w-full h-full bg-[#228B22] rounded-t-full transform skew-x-6" />
        </div>
        <div className="absolute right-8 top-8 w-24 h-24 bg-[#FFF8DC] rounded-full opacity-80" />
      </div>

      {/* Top Bar */}
      <div className="relative z-20 px-4 pt-safe-top">
        <div className="flex items-center justify-between py-2">
            <div 
            className="w-14 h-14 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center cursor-pointer"
            onClick={() => setShowUserProfile(true)}
            >
            <User className="w-8 h-8 text-blue-600" />
            </div>
            <UserProfileModal 
            isVisible={showUserProfile} 
            onClose={() => setShowUserProfile(false)} 
            />

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
              <span className="text-sm font-bold text-white">{(coins / 1000000).toFixed(1)}m</span>
            </div>
            
            <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1.5 rounded-full">
              <div className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center">
                <Timer className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">{stamina.current}/{stamina.max}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {renderContent()}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-20">
        <div className="flex justify-between items-center px-4 py-2 pb-safe-bottom">
          <button 
            onClick={() => setActiveTab('coupon')}
            className="nav-icon flex flex-col items-center w-16 py-1"
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'coupon' ? 'text-blue-500' : 'text-gray-400'}`}>
              <Ticket className="w-5 h-5" />
            </div>
            <span className={`text-[10px] ${activeTab === 'coupon' ? 'text-blue-500' : 'text-gray-500'}`}>Coupon</span>
          </button>

          <button 
            onClick={() => setActiveTab('characters')}
            className="nav-icon flex flex-col items-center w-16 py-1"
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'characters' ? 'text-blue-500' : 'text-gray-400'}`}>
              <Cat className="w-5 h-5" />
            </div>
            <span className={`text-[10px] ${activeTab === 'characters' ? 'text-blue-500' : 'text-gray-500'}`}>Characters</span>
          </button>

          <button 
            onClick={() => setActiveTab('summon')}
            className="nav-icon flex flex-col items-center w-16 py-1"
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'summon' ? 'text-purple-500' : 'text-gray-400'}`}>
              <Gem className="w-5 h-5" />
            </div>
            <span className={`text-[10px] ${activeTab === 'summon' ? 'text-purple-500' : 'text-gray-500'}`}>Summon</span>
          </button>

          <button 
            onClick={() => setActiveTab('game')}
            className="nav-icon flex flex-col items-center w-16 py-1"
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'game' ? 'text-blue-500' : 'text-gray-400'}`}>
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className={`text-[10px] ${activeTab === 'game' ? 'text-blue-500' : 'text-gray-500'}`}>Game</span>
          </button>

          <button 
            onClick={() => setActiveTab('trade')}
            className="nav-icon flex flex-col items-center w-16 py-1"
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'trade' ? 'text-blue-500' : 'text-gray-400'}`}>
              <Store className="w-5 h-5" />
            </div>
            <span className={`text-[10px] ${activeTab === 'trade' ? 'text-blue-500' : 'text-gray-500'}`}>Trade</span>
          </button>

          <button 
            onClick={() => setActiveTab('leaderboard')}
            className="nav-icon flex flex-col items-center w-16 py-1"
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'leaderboard' ? 'text-blue-500' : 'text-gray-400'}`}>
              <Trophy className="w-5 h-5" />
            </div>
            <span className={`text-[10px] ${activeTab === 'leaderboard' ? 'text-blue-500' : 'text-gray-500'}`}>Leaderboard</span>
          </button>
        </div>
      </div>

      {/* Drop Rates Modal */}
      {showDropRates && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-30">
          <div className="bg-white w-[85%] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Drop Rates</h3>
              <Percent className="w-6 h-6 text-blue-600" />
            </div>
            
            <div className="space-y-4">
              {/* Common Rate */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-gray-700">Common</span>
                  <span className="text-lg font-bold text-gray-900">10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>

              {/* Rare Rate */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-blue-700">Rare</span>
                  <span className="text-lg font-bold text-blue-900">70%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

              {/* Epic Rate */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-purple-700">Epic</span>
                  <span className="text-lg font-bold text-purple-900">15%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>

              {/* Legendary Rate */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-yellow-700">Legendary</span>
                  <span className="text-lg font-bold text-yellow-900">5%</span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '5%' }} />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowDropRates(false)}
              className="mt-6 w-full bg-gray-100 py-3 rounded-xl text-lg font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Egg Animation */}
      <EggAnimation 
        isVisible={showEggAnimation} 
        onAnimationEnd={() => {
          setShowEggAnimation(false);
          setRemainingDraws(prev => {
            const next = prev - 1;
            if (next > 0) {
              setTimeout(() => setShowEggAnimation(true), 500);
            }
            return next;
          });
        }}
      />
    </div>
  );
}

export default App;