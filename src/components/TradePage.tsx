import React, { useState } from 'react';
import { Store, Search, Filter, ArrowUpDown, RefreshCw, User } from 'lucide-react';
import { useGameState, Character } from '../state/gameState';
import PageHeader from './PageHeader';

const TradePage = () => {
  const { characters } = useGameState();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [rarityFilter, setRarityFilter] = useState('all');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);

  // Mock available trades (in a real app, this would come from an API)
  const [availableTrades] = useState([
    {
      id: 'trade1',
      user: 'Player123',
      character: {
        id: 'char1',
        name: 'Golden Chef',
        image: 'https://picsum.photos/200/300?random=1',
        rarity: 'legendary',
        discount: '50% off at FoodEmporium',
        isUsing: false,
        company: 'FoodEmporium'
      },
      wants: 'epic or legendary characters from TechHaven'
    },
    {
      id: 'trade2',
      user: 'GameWizard',
      character: {
        id: 'char2',
        name: 'Discount Dave',
        image: 'https://picsum.photos/200/300?random=2',
        rarity: 'epic',
        discount: '35% off at TechHaven',
        isUsing: false,
        company: 'TechHaven'
      },
      wants: 'any legendary character'
    },
    {
      id: 'trade3',
      user: 'ShopQueen',
      character: {
        id: 'char3',
        name: 'Sale Sarah',
        image: 'https://picsum.photos/200/300?random=3',
        rarity: 'rare',
        discount: '25% off at ClothingCorner',
        isUsing: false,
        company: 'ClothingCorner'
      },
      wants: 'any epic character'
    },
    {
      id: 'trade4',
      user: 'BargainHunter',
      character: {
        id: 'char4',
        name: 'Coupon Carlos',
        image: 'https://picsum.photos/200/300?random=4',
        rarity: 'common',
        discount: '15% off at CoffeeStop',
        isUsing: false,
        company: 'CoffeeStop'
      },
      wants: 'any rare character from FoodEmporium'
    }
  ]);

  // Filter trades based on search and rarity
  const filteredTrades = availableTrades.filter(trade => {
    // Search filter
    if (searchQuery && !trade.character.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !trade.user.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Rarity filter
    if (rarityFilter !== 'all' && trade.character.rarity !== rarityFilter) {
      return false;
    }
    
    return true;
  });

  // Character selection for trading
  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  // Trade selection
  const handleTradeSelect = (trade: any) => {
    setSelectedTrade(trade);
  };

  // Cancel selection
  const handleCancelSelect = () => {
    setSelectedCharacter(null);
    setSelectedTrade(null);
  };

  // Get color based on rarity
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500 bg-yellow-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'rare': return 'text-blue-500 bg-blue-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getRarityBgColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-500';
      case 'epic': return 'bg-purple-600';
      case 'rare': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-300 pb-24">
      {/* Header with user profile and resources */}
      <PageHeader 
        title="Trade Characters" 
        subtitle="Exchange characters with other players" 
        icon={<ArrowUpDown className="w-8 h-8 text-blue-600" />} 
      />

      {/* Search and Filters */}
      <div className="mt-4 px-4 flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search trades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        
        <button 
          className="h-12 px-4 rounded-xl flex items-center gap-2 shadow-lg transition-colors bg-white/90 text-gray-600 hover:bg-white"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filter</span>
        </button>
      </div>
      
      {showFilters && (
        <div className="mt-4 px-4">
          <div className="bg-white/90 rounded-xl p-4 shadow-lg">
            <h3 className="font-bold text-gray-800 mb-3">Filter by Rarity</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                  rarityFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setRarityFilter('all')}
              >
                All Rarities
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                  rarityFilter === 'common' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setRarityFilter('common')}
              >
                Common
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                  rarityFilter === 'rare' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setRarityFilter('rare')}
              >
                Rare
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                  rarityFilter === 'epic' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setRarityFilter('epic')}
              >
                Epic
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                  rarityFilter === 'legendary' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setRarityFilter('legendary')}
              >
                Legendary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 mt-4 pb-20">
        {selectedTrade ? (
          // Trade Detail View
          <div className="bg-white/90 rounded-xl shadow-lg overflow-hidden">
            <div className={`p-5 text-white ${getRarityBgColor(selectedTrade.character.rarity)}`}>
              <button 
                onClick={handleCancelSelect}
                className="text-white/80 hover:text-white mb-4 flex items-center"
              >
                ← Back to trades
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-1">{selectedTrade.character.name}</h2>
                <p className="text-sm opacity-90">
                  Offered by {selectedTrade.user}
                </p>
              </div>
            </div>
            
            <div className="p-5">
              <div className="text-center mb-6">
                <div className="bg-gray-100 p-5 rounded-lg mx-auto w-48 h-48 flex items-center justify-center mb-4 border-2 border-gray-200 shadow-inner">
                  {selectedTrade.character.image ? (
                    <img 
                      src={selectedTrade.character.image} 
                      alt={selectedTrade.character.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <User size={64} className="text-gray-400" />
                  )}
                </div>
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getRarityColor(selectedTrade.character.rarity)}`}>
                    {selectedTrade.character.rarity.charAt(0).toUpperCase() + selectedTrade.character.rarity.slice(1)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">{selectedTrade.character.company}</span>
                </div>
                <p className="text-gray-700 font-medium">"{selectedTrade.character.discount}"</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-5">
                <h3 className="font-bold text-gray-700 mb-2">Trade Requirements</h3>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedTrade.wants}</p>
              </div>
              
              {selectedCharacter ? (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-bold text-gray-700 mb-3">Your Offer</h3>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getRarityColor(selectedCharacter.rarity)}`}>
                      {selectedCharacter.image ? (
                        <img 
                          src={selectedCharacter.image} 
                          alt={selectedCharacter.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{selectedCharacter.name}</p>
                      <p className="text-xs text-gray-500">
                        {selectedCharacter.rarity.charAt(0).toUpperCase() + selectedCharacter.rarity.slice(1)} • {selectedCharacter.company}
                      </p>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setSelectedCharacter(null)}
                    >
                      Change
                    </button>
                  </div>
                  
                  <button 
                    className="w-full py-3 mt-5 rounded-xl bg-blue-500 text-white font-bold shadow-md hover:bg-blue-600 transition"
                  >
                    Submit Trade Offer
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="font-bold text-gray-700 mb-3">Select a character to offer</h3>
                  <div className="max-h-[300px] overflow-y-auto bg-gray-50 rounded-lg divide-y divide-gray-100">
                    {characters.map(character => (
                      <div 
                        key={character.id}
                        className="p-3 flex items-center hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleCharacterSelect(character)}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getRarityColor(character.rarity)}`}>
                          {character.image ? (
                            <img 
                              src={character.image} 
                              alt={character.name}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800">{character.name}</p>
                          <p className="text-xs text-gray-500">
                            {character.rarity.charAt(0).toUpperCase() + character.rarity.slice(1)} • {character.company}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Trade List View
          <>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="font-bold text-gray-700">Available Trades</h2>
              <button className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>
            
            {filteredTrades.length === 0 ? (
              <div className="bg-white/90 rounded-xl p-8 text-center shadow-lg">
                <ArrowUpDown className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                <p className="text-lg font-semibold text-gray-700">No trades found</p>
                <p className="text-gray-500 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredTrades.map(trade => (
                  <div 
                    key={trade.id}
                    className="bg-white/90 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => handleTradeSelect(trade)}
                  >
                    <div className={`p-3 text-white ${getRarityBgColor(trade.character.rarity)}`}>
                      <div className="flex justify-between">
                        <span className="font-medium">{trade.user}</span>
                        <span className="text-xs bg-white/30 rounded-full px-2 py-0.5">
                          {trade.character.rarity.charAt(0).toUpperCase() + trade.character.rarity.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex items-center">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mr-4 border border-gray-200">
                        {trade.character.image ? (
                          <img 
                            src={trade.character.image} 
                            alt={trade.character.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <User size={32} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">{trade.character.name}</h3>
                        <p className="text-sm text-gray-500">{trade.character.company}</p>
                        <p className="text-xs text-gray-400 mt-1">Wants: {trade.wants}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TradePage;
