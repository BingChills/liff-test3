import React, { useState } from 'react';
import { User, Filter, ChevronRight, Search } from 'lucide-react';
import { useGameState, Character } from '../state/gameState';
import PageHeader from './PageHeader';

type ViewMode = 'all' | 'using' | 'backpack';

const CharactersPage = () => {
  const { characters, stores, selectedStore, setSelectedStore } = useGameState();
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter characters based on current filters
  const filteredCharacters = characters.filter(character => {
    // Store filter
    if (selectedStore && character.company !== selectedStore.name) return false;
    
    // Status filter
    if (viewMode === 'using' && !character.isUsing) return false;
    if (viewMode === 'backpack' && character.isUsing) return false;
    
    // Search filter
    if (searchQuery && !character.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Group characters by company
  const charactersByCompany = filteredCharacters.reduce((groups, character) => {
    const company = character.company;
    if (!groups[company]) {
      groups[company] = [];
    }
    groups[company].push(character);
    return groups;
  }, {} as Record<string, Character[]>);

  // Handle character selection
  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
  };

  // Close character detail view
  const handleCloseDetail = () => {
    setSelectedCharacter(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-300 pb-24">
      {/* Header with user profile and resources */}
      <PageHeader 
        title="My Characters" 
        subtitle="Collect them all!" 
        icon={<User className="w-8 h-8 text-blue-600" />} 
      />
      
      {/* Search and filters */}
      <div className="mt-4 px-4 flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search characters..."
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
            <h3 className="font-bold text-gray-800 mb-3">Filter by Status</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                  viewMode === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setViewMode('all')}
              >
                All Characters
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                  viewMode === 'using' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setViewMode('using')}
              >
                Using
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                  viewMode === 'backpack' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setViewMode('backpack')}
              >
                Backpack
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Character list */}
      {selectedCharacter ? (
        // Character detail view
        <div className="mt-4 px-4 pb-20">
          <button 
            className="mb-5 text-blue-700 font-semibold flex items-center text-lg"
            onClick={handleCloseDetail}
          >
            ← Back to characters
          </button>
          
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className={`p-7 text-white text-center ${
              selectedCharacter.rarity === 'legendary' ? 'bg-yellow-500' :
              selectedCharacter.rarity === 'epic' ? 'bg-purple-600' :
              selectedCharacter.rarity === 'rare' ? 'bg-blue-500' : 'bg-gray-500'
            }`}>
              <h2 className="text-2xl font-bold mb-2 drop-shadow-sm">{selectedCharacter.name}</h2>
              <p className="text-base font-medium">
                {selectedCharacter.rarity.charAt(0).toUpperCase() + selectedCharacter.rarity.slice(1)} · {selectedCharacter.company}
              </p>
            </div>
            
            <div className="p-7">
              <div className="text-center mb-7">
                <div className="bg-gray-100 p-5 rounded-lg mx-auto w-56 h-56 flex items-center justify-center mb-4 border-2 border-gray-200 shadow-inner">
                  {selectedCharacter.image ? (
                    <img 
                      src={selectedCharacter.image} 
                      alt={selectedCharacter.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <User size={80} className="text-gray-400" />
                  )}
                </div>
                <p className="text-gray-700 text-base font-medium">"{selectedCharacter.discount}"</p>
              </div>
              
              <div className="border-t-2 border-gray-200 pt-5">
                <button 
                  className={`w-full py-3 rounded-xl font-bold text-white shadow-md ${
                    selectedCharacter.isUsing 
                      ? 'bg-gray-400' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  disabled={selectedCharacter.isUsing}
                >
                  {selectedCharacter.isUsing ? 'Currently Using' : 'Use Character'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Character list view
        <div className="mt-4 px-4 pb-20">
          {filteredCharacters.length === 0 ? (
            <div className="text-center py-12 text-gray-700 bg-white rounded-xl shadow-md p-8">
              <User size={56} className="mx-auto mb-5 text-gray-400" />
              <p className="text-xl font-semibold">No characters found</p>
              <p className="mt-2 text-gray-600">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {Object.entries(charactersByCompany).map(([company, characters]) => (
                <div key={company} className="bg-white/90 rounded-xl shadow-md overflow-hidden">
                  <div className="bg-blue-600 py-3 px-4">
                    <h3 className="font-bold text-white">{company}</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {characters.map(character => (
                      <div 
                        key={character.id}
                        className="p-4 flex items-center hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleCharacterClick(character)}
                      >
                        <div className={`w-12 h-12 rounded-full mr-4 flex items-center justify-center ${
                          character.rarity === 'legendary' ? 'bg-yellow-100' :
                          character.rarity === 'epic' ? 'bg-purple-100' :
                          character.rarity === 'rare' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          {character.image ? (
                            <img 
                              src={character.image} 
                              alt={character.name}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <User className={`${
                              character.rarity === 'legendary' ? 'text-yellow-500' :
                              character.rarity === 'epic' ? 'text-purple-600' :
                              character.rarity === 'rare' ? 'text-blue-500' : 'text-gray-500'
                            }`} size={24} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{character.name}</h4>
                          <p className="text-sm text-gray-600">{character.discount}</p>
                        </div>
                        <div className="flex items-center">
                          {character.isUsing && (
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full mr-2">
                              Using
                            </span>
                          )}
                          <ChevronRight size={20} className="text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CharactersPage;
