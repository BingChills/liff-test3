import React, { useState } from 'react';
import { Trophy, Medal, Calendar, Filter } from 'lucide-react';
import { useGameState } from '../state/gameState';
import PageHeader from './PageHeader';

type LeaderboardPeriod = 'daily' | 'weekly' | 'allTime';

const LeaderboardPage = () => {
  const { score } = useGameState();
  const [activePeriod, setActivePeriod] = useState<LeaderboardPeriod>('weekly');
  const [showFilters, setShowFilters] = useState(false);

  // Mock leaderboard data (in a real app, this would come from an API)
  const [leaderboardData] = useState({
    daily: [
      { id: 1, name: 'Player456', score: 15800, avatar: 'https://picsum.photos/200/200?random=1' },
      { id: 2, name: 'GameWizard', score: 12600, avatar: 'https://picsum.photos/200/200?random=2' },
      { id: 3, name: 'ProGamer99', score: 10200, avatar: 'https://picsum.photos/200/200?random=3' },
      { id: 4, name: 'CoolKid22', score: 8900, avatar: 'https://picsum.photos/200/200?random=4' },
      { id: 5, name: 'MasterChef', score: 7500, avatar: 'https://picsum.photos/200/200?random=5' },
      { id: 6, name: 'RocketMan', score: 6300, avatar: 'https://picsum.photos/200/200?random=6' },
      { id: 7, name: 'PixelQueen', score: 5100, avatar: 'https://picsum.photos/200/200?random=7' },
      { id: 8, name: 'StarRider', score: 4800, avatar: 'https://picsum.photos/200/200?random=8' },
      { id: 9, name: 'NinjaGamer', score: 3600, avatar: 'https://picsum.photos/200/200?random=9' },
      { id: 10, name: 'CyberKnight', score: 2900, avatar: 'https://picsum.photos/200/200?random=10' },
      // User's position (just mock data)
      { id: 42, name: 'You', score: score, isYou: true, avatar: 'https://picsum.photos/200/200?random=42' }
    ],
    weekly: [
      { id: 1, name: 'MegaGamer', score: 87900, avatar: 'https://picsum.photos/200/200?random=11' },
      { id: 2, name: 'LegendHunter', score: 76500, avatar: 'https://picsum.photos/200/200?random=12' },
      { id: 3, name: 'PixelMaster', score: 65200, avatar: 'https://picsum.photos/200/200?random=13' },
      { id: 4, name: 'DragonSlayer', score: 58900, avatar: 'https://picsum.photos/200/200?random=14' },
      { id: 5, name: 'ShadowWolf', score: 47300, avatar: 'https://picsum.photos/200/200?random=15' },
      { id: 6, name: 'StormRider', score: 42100, avatar: 'https://picsum.photos/200/200?random=16' },
      { id: 7, name: 'PhantomGhost', score: 36800, avatar: 'https://picsum.photos/200/200?random=17' },
      { id: 8, name: 'CosmicWarrior', score: 31500, avatar: 'https://picsum.photos/200/200?random=18' },
      { id: 9, name: 'TechWizard', score: 26900, avatar: 'https://picsum.photos/200/200?random=19' },
      { id: 10, name: 'GalaxyExplorer', score: 22400, avatar: 'https://picsum.photos/200/200?random=20' },
      // User's position
      { id: 24, name: 'You', score: score, isYou: true, avatar: 'https://picsum.photos/200/200?random=42' }
    ],
    allTime: [
      { id: 1, name: 'UltimateGamer', score: 342500, avatar: 'https://picsum.photos/200/200?random=21' },
      { id: 2, name: 'EpicPlayer', score: 298700, avatar: 'https://picsum.photos/200/200?random=22' },
      { id: 3, name: 'LegendaryKnight', score: 256300, avatar: 'https://picsum.photos/200/200?random=23' },
      { id: 4, name: 'MythicHero', score: 215900, avatar: 'https://picsum.photos/200/200?random=24' },
      { id: 5, name: 'ImmortalChampion', score: 187200, avatar: 'https://picsum.photos/200/200?random=25' },
      { id: 6, name: 'CosmicOverlord', score: 165800, avatar: 'https://picsum.photos/200/200?random=26' },
      { id: 7, name: 'EternalWarrior', score: 143600, avatar: 'https://picsum.photos/200/200?random=27' },
      { id: 8, name: 'DivineMaster', score: 124900, avatar: 'https://picsum.photos/200/200?random=28' },
      { id: 9, name: 'CelestialKing', score: 108500, avatar: 'https://picsum.photos/200/200?random=29' },
      { id: 10, name: 'OmegaPlayer', score: 96200, avatar: 'https://picsum.photos/200/200?random=30' },
      // User's position
      { id: 156, name: 'You', score: score, isYou: true, avatar: 'https://picsum.photos/200/200?random=42' }
    ]
  });

  const activeLeaderboard = leaderboardData[activePeriod];
  const userRank = activeLeaderboard.find(player => player.isYou)?.id || 0;

  // Get medal color based on rank
  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500'; // Gold
    if (rank === 2) return 'text-gray-400'; // Silver
    if (rank === 3) return 'text-amber-700'; // Bronze
    return 'text-gray-500'; // Default
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-300 pt-[150px] pb-24">
      {/* Header with user profile and resources */}
      <PageHeader 
        title="Leaderboard" 
        subtitle="See how you rank against other players" 
        icon={<Trophy className="w-8 h-8 text-blue-600" />} 
      />
      
      {/* Your rank summary */}
      <div className="px-4 mt-4">
        <div className="bg-white/90 rounded-xl shadow-lg p-5 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-700">Your Rank</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-blue-600">#{userRank}</span>
                <span className="text-sm text-gray-500">of all players</span>
              </div>
            </div>
            <div className="bg-blue-100 rounded-full p-4">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Time filter */}
      <div className="px-4 mb-5">
        <div className="bg-white/90 rounded-xl shadow-lg p-3 flex justify-between">
          <button 
            className={`flex-1 py-2 rounded-lg transition ${
              activePeriod === 'daily' ? 'bg-blue-100 text-blue-600 font-bold' : 'text-gray-500'
            }`}
            onClick={() => setActivePeriod('daily')}
          >
            Daily
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg transition ${
              activePeriod === 'weekly' ? 'bg-blue-100 text-blue-600 font-bold' : 'text-gray-500'
            }`}
            onClick={() => setActivePeriod('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg transition ${
              activePeriod === 'allTime' ? 'bg-blue-100 text-blue-600 font-bold' : 'text-gray-500'
            }`}
            onClick={() => setActivePeriod('allTime')}
          >
            All Time
          </button>
        </div>
      </div>
      
      {/* Leaderboard */}
      <div className="px-4 pb-20">
        <div className="bg-white/90 rounded-xl shadow-lg overflow-hidden">
          {/* Top 3 players */}
          <div className="flex p-4 items-end bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            {/* 2nd place */}
            <div className="flex-1 text-center pt-6">
              <div className="w-16 h-16 rounded-full bg-white/20 mx-auto mb-2 overflow-hidden">
                <img 
                  src={activeLeaderboard[1]?.avatar} 
                  alt={activeLeaderboard[1]?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white/20 rounded-xl py-2 px-3">
                <div className="mb-1 flex justify-center">
                  <Medal className="w-4 h-4 text-gray-300" />
                </div>
                <p className="font-bold truncate text-sm">{activeLeaderboard[1]?.name}</p>
                <p className="text-xs opacity-80">{activeLeaderboard[1]?.score.toLocaleString()}</p>
              </div>
            </div>
            
            {/* 1st place */}
            <div className="flex-1 text-center -mb-2">
              <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mb-2 overflow-hidden border-2 border-yellow-300 shadow-lg">
                <img 
                  src={activeLeaderboard[0]?.avatar} 
                  alt={activeLeaderboard[0]?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-yellow-500 rounded-xl py-3 px-3">
                <div className="mb-1 flex justify-center">
                  <Trophy className="w-5 h-5 text-yellow-200" />
                </div>
                <p className="font-bold truncate">{activeLeaderboard[0]?.name}</p>
                <p className="text-sm opacity-80">{activeLeaderboard[0]?.score.toLocaleString()}</p>
              </div>
            </div>
            
            {/* 3rd place */}
            <div className="flex-1 text-center pt-8">
              <div className="w-14 h-14 rounded-full bg-white/20 mx-auto mb-2 overflow-hidden">
                <img 
                  src={activeLeaderboard[2]?.avatar} 
                  alt={activeLeaderboard[2]?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white/20 rounded-xl py-2 px-3">
                <div className="mb-1 flex justify-center">
                  <Medal className="w-4 h-4 text-amber-700" />
                </div>
                <p className="font-bold truncate text-sm">{activeLeaderboard[2]?.name}</p>
                <p className="text-xs opacity-80">{activeLeaderboard[2]?.score.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          {/* Rest of the leaderboard */}
          <div className="divide-y divide-gray-100">
            {activeLeaderboard.slice(3).map(player => (
              <div 
                key={player.id}
                className={`flex items-center p-4 ${player.isYou ? 'bg-blue-50' : ''}`}
              >
                <div className="w-8 text-center font-bold text-gray-700">
                  {player.id}
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden mx-4">
                  <img 
                    src={player.avatar} 
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className={`font-bold ${player.isYou ? 'text-blue-600' : 'text-gray-800'}`}>
                    {player.name} {player.isYou && '(You)'}
                  </p>
                </div>
                <div className="font-bold text-gray-700">
                  {player.score.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
