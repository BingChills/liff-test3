"use client";
import React, { useState } from 'react';
import { Coins, User, Trophy, Gift, Crown, Star, Medal, Gem, ChevronDown, Timer } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  avatar: string;
  coins: number;
  characters: string[];
  isCurrentUser?: boolean;
}

interface PrizeInfo {
  title: string;
  rewards: string[];
  medal: string;
  color: string;
  icon: string;
}

interface StoreCurrency {
  name: string;
  gems: number;
  color: string;
}

const PRIZES: Record<number, PrizeInfo> = {
  1: {
    title: "1st Place Champion",
    medal: "🥇",
    color: "from-yellow-400 to-yellow-500",
    icon: "👑",
    rewards: [
      "Exclusive Legendary Character",
      "10,000 Gems",
      "Special Profile Frame",
      "Champion's Trophy"
    ]
  },
  2: {
    title: "2nd Place Master",
    medal: "🥈",
    color: "from-slate-300 to-slate-400",
    icon: "⭐",
    rewards: [
      "Epic Character of Choice",
      "5,000 Gems",
      "Master's Badge",
      "Rare Profile Banner"
    ]
  },
  3: {
    title: "3rd Place Elite",
    medal: "🥉",
    color: "from-amber-600 to-amber-700",
    icon: "🏅",
    rewards: [
      "Rare Character of Choice",
      "2,500 Gems",
      "Elite Title",
      "Special Emotes Pack"
    ]
  }
};

const generateLeaderboardData = (): LeaderboardEntry[] => {
  const topEntries = [
    {
      rank: 1,
      avatar: "https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=150&q=80",
      coins: 10.9,
      characters: [
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=50&q=80",
        "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=50&q=80",
        "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=50&q=80"
      ]
    },
    {
      rank: 2,
      avatar: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=150&q=80",
      coins: 8.5,
      characters: [
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=50&q=80",
        "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=50&q=80",
        "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=50&q=80"
      ]
    },
    {
      rank: 3,
      avatar: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=150&q=80",
      coins: 6.9,
      characters: [
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=50&q=80",
        "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=50&q=80",
        "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=50&q=80"
      ]
    }
  ];

  const additionalEntries = Array.from({ length: 97 }, (_, i) => ({
    rank: i + 4,
    avatar: "https://images.unsplash.com/photo-1546190255-451a91afc548?auto=format&fit=crop&w=150&q=80",
    coins: Number((5 - i * 0.05).toFixed(1)),
    characters: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=50&q=80",
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=50&q=80",
      "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=50&q=80"
    ]
  }));

  const currentUserRank = 28;
  additionalEntries[currentUserRank - 4] = {
    rank: currentUserRank,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    coins: 2.8,
    characters: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=50&q=80",
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=50&q=80",
      "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=50&q=80"
    ],
  };

  return [...topEntries, ...additionalEntries];
};

const leaderboardData = generateLeaderboardData();
const currentUserEntry = leaderboardData.find(entry => entry.isCurrentUser);

export function LeaderboardPage() {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [selectedRank, setSelectedRank] = useState<number | null>(null);
  const [showStoreSelector, setShowStoreSelector] = React.useState(false);
  const [stores] = React.useState<StoreCurrency[]>([
    { name: 'Parabola', gems: 1600, color: 'emerald' },
    { name: 'KFC', gems: 850, color: 'red' },
    { name: 'Pizza Company', gems: 1200, color: 'blue' },
    { name: 'Pizza Hut', gems: 950, color: 'orange' }
  ]);
  const [selectedStore, setSelectedStore] = React.useState(stores[0]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollTop);
  };

  const showPrizes = (rank: number) => {
    if (rank <= 3) {
      setSelectedRank(rank);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-blue-300 to-blue-400 flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-30">
        <div className="flex flex-col bg-gradient-to-b from-blue-200 to-blue-200/95 pb-4">
          <div className="flex items-center justify-between p-4">
            <div className="w-14 h-14 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>

            <div className="flex items-center gap-2">
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

          <div className="text-center px-4">
            <h1 className="text-3xl font-black text-white drop-shadow-lg flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-400" />
              Leaderboard
            </h1>
            <p className="text-white/80 text-sm mt-1">Compete for amazing rewards!</p>
          </div>
        </div>
      </div>

      <div 
        className="flex-1 px-4 space-y-2.5 overflow-y-auto overscroll-contain pb-32 pt-36"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {leaderboardData.map((entry) => {
          const getBgColor = (rank: number, isCurrentUser?: boolean) => {
            if (isCurrentUser) return 'bg-gradient-to-r from-blue-500 to-blue-600';
            switch (rank) {
              case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
              case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400';
              case 3: return 'bg-gradient-to-r from-amber-600 to-amber-700';
              default: return 'bg-gradient-to-r from-gray-500/90 to-gray-600/90';
            }
          };

          const getRankIcon = (rank: number) => {
            switch (rank) {
              case 1: return <Crown className="w-5 h-5 text-yellow-300 drop-shadow-glow animate-pulse" />;
              case 2: return <Star className="w-5 h-5 text-gray-200 drop-shadow-glow animate-pulse" />;
              case 3: return <Medal className="w-5 h-5 text-amber-500 drop-shadow-glow animate-pulse" />;
              default: return null;
            }
          };

          const isNearCurrentUser = Math.abs(entry.rank - (currentUserEntry?.rank || 0)) <= 2;

          return (
            <div
              key={entry.rank}
              onClick={() => showPrizes(entry.rank)}
              className={`${getBgColor(entry.rank, entry.isCurrentUser)} 
                rounded-2xl p-4 shadow-lg flex items-center gap-4
                ${entry.isCurrentUser ? 'animate-pulse ring-2 ring-white' : ''}
                ${isNearCurrentUser ? 'scale-[1.02] z-10' : 'scale-100'}
                ${entry.rank <= 3 ? 'cursor-pointer transform hover:scale-[1.02] active:scale-95' : ''}
                transition-all duration-200 backdrop-blur-sm relative`}
            >
              {entry.rank <= 3 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform">
                  <Gift className="w-5 h-5 text-purple-500" />
                </div>
              )}
              <div className="w-10 h-full flex items-center justify-center relative">
                <span className="text-2xl font-black text-white drop-shadow-md">{entry.rank}</span>
                {getRankIcon(entry.rank)}
              </div>

              <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-white/30">
                <img
                  src={entry.avatar}
                  alt={`Rank ${entry.rank}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-bold text-white">{entry.coins}m</span>
              </div>

              <div className="flex-1 flex justify-end gap-2">
                {entry.characters.map((character, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30 transform hover:scale-110 transition-transform"
                  >
                    <img
                      src={character}
                      alt={`Character ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedRank && PRIZES[selectedRank] && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedRank(null)}
        >
          <div 
            className={`bg-gradient-to-br ${PRIZES[selectedRank].color} w-[85%] rounded-3xl p-8 shadow-2xl transform transition-all`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl shadow-inner">
                {PRIZES[selectedRank].icon}
              </div>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight">
                  {PRIZES[selectedRank].title}
                </h3>
                <div className="flex items-center gap-2 text-white/90 mt-1">
                  <Trophy className="w-5 h-5" />
                  <span className="text-lg">Rank {selectedRank}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {PRIZES[selectedRank].rewards.map((reward, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 bg-white/20 backdrop-blur-sm p-4 rounded-2xl transform hover:scale-[1.02] transition-transform"
                >
                  <Gift className="w-6 h-6 text-white" />
                  <span className="text-lg font-medium text-white">{reward}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setSelectedRank(null)}
              className="mt-8 w-full bg-white/20 backdrop-blur-sm text-white py-4 rounded-xl text-lg font-bold hover:bg-white/30 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {currentUserEntry && (
        <div className="fixed bottom-20 left-0 right-0 px-4 z-20">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 shadow-xl flex items-center gap-4 ring-2 ring-white/30 backdrop-blur-sm">
            <div className="w-10 h-full flex items-center justify-center">
              <span className="text-2xl font-black text-white drop-shadow-md">{currentUserEntry.rank}</span>
            </div>
            <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-white/30">
              <img
                src={currentUserEntry.avatar}
                alt="Your Rank"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold text-white">{currentUserEntry.coins}m</span>
            </div>
            <div className="flex-1 flex justify-end gap-2">
              {currentUserEntry.characters.map((character, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30 transform hover:scale-110 transition-transform"
                >
                  <img
                    src={character}
                    alt={`Character ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}