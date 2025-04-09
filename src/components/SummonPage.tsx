import React, { useState, useEffect } from 'react';
import { Store, Gem, ChevronDown, Percent, Box, Ticket } from 'lucide-react';
import { useGameState, Character, StoreCurrency } from '../state/gameState';
import PageHeader from './PageHeader';

// Define rarity type for consistency
type CharacterRarity = 'common' | 'rare' | 'epic' | 'legendary';

// Define rarity rates
const RARITY_RATES: Record<CharacterRarity, number> = {
    legendary: 0.01,
    epic: 0.09,
    rare: 0.2,
    common: 0.7,
};

// We'll use characters from the game state instead of hardcoded data

interface EggAnimationProps {
    isVisible: boolean;
    onAnimationEnd: (characters: Character[]) => void;
    drawCount?: number;
    // No need to add selectedStore here since we're using intersection type in the component
}

const getRarityColor = (rarity: CharacterRarity) => {
    switch (rarity) {
        case 'common':
            return 'bg-gray-100';
        case 'rare':
            return 'bg-blue-100';
        case 'epic':
            return 'bg-purple-100';
        case 'legendary':
            return 'bg-yellow-100';
        default:
            return 'bg-gray-100';
    }
};

const getRarityEggStyle = (rarity: CharacterRarity) => {
    switch (rarity) {
        case 'legendary':
            return {
                egg: 'from-yellow-500 via-yellow-400 to-yellow-600',
                glow: 'from-yellow-400/30 to-transparent',
                rays: 'bg-yellow-400/20',
            };
        case 'epic':
            return {
                egg: 'from-purple-500 via-purple-400 to-purple-600',
                glow: 'from-purple-400/30 to-transparent',
                rays: 'bg-purple-400/20',
            };
        case 'rare':
            return {
                egg: 'from-blue-500 via-blue-400 to-blue-600',
                glow: 'from-blue-400/30 to-transparent',
                rays: 'bg-blue-400/20',
            };
        default:
            return {
                egg: 'from-gray-800 via-gray-700 to-gray-900',
                glow: 'from-white/10 to-transparent',
                rays: 'bg-white/10',
            };
    }
};

const determineRarity = (rand: number): CharacterRarity => {
    if (rand < RARITY_RATES.legendary) return 'legendary';
    if (rand < RARITY_RATES.legendary + RARITY_RATES.epic) return 'epic';
    if (rand < RARITY_RATES.legendary + RARITY_RATES.epic + RARITY_RATES.rare) return 'rare';
    return 'common';
};

const SummonPage = () => {
    const { stores, setStores, selectedStore, setSelectedStore, characters, setCharacters } =
        useGameState();
    const [showDropRates, setShowDropRates] = useState(false);
    const [showStoreSelector, setShowStoreSelector] = useState(false);
    const [showEggAnimation, setShowEggAnimation] = useState(false);
    const [drawCount, setDrawCount] = useState(1);
    
    // Add mock points for YumYum store for testing
    React.useEffect(() => {
        // Only add test points if stores exist but have no points
        if (stores.length > 0) {
            // Check if we need to add the YumYum store or update it
            const yumYumIndex = stores.findIndex(store => store.name === 'YumYum');
            
            if (yumYumIndex === -1) {
                // YumYum store doesn't exist, add it
                const newStores = [...stores, {
                    name: 'YumYum',
                    point: 5000, // Give enough points for multiple 10x draws
                    color: 'orange'
                }];
                setStores(newStores);
                // Set YumYum as selected store if no store is selected
                if (!selectedStore) {
                    setSelectedStore(newStores[newStores.length - 1]);
                }
            } else if (stores[yumYumIndex].point < 100) {
                // YumYum exists but has too few points, add more
                const newStores = [...stores];
                newStores[yumYumIndex] = {
                    ...newStores[yumYumIndex],
                    point: 5000
                };
                setStores(newStores);
                // Update the selected store if it's YumYum
                if (selectedStore && selectedStore.name === 'YumYum') {
                    setSelectedStore(newStores[yumYumIndex]);
                }
            }
        }
    }, [stores, setStores, selectedStore, setSelectedStore]);

    const getStoreColor = (color: string) => {
        switch (color) {
            case 'emerald':
                return 'bg-emerald-400';
            case 'red':
                return 'bg-red-500';
            case 'blue':
                return 'bg-blue-500';
            case 'orange':
                return 'bg-orange-500';
            default:
                return 'bg-blue-400';
        }
    };

    const handleSelectStore = (store: StoreCurrency) => {
        setSelectedStore(store);
        setShowStoreSelector(false);
    };

    const handleSummon = (isTenDraw: boolean) => {
        // Each character costs 100 points regardless of store
        const characterCost = 100;
        const count = isTenDraw ? 10 : 1;
        const drawCost = characterCost * count;

        // Check if user has enough points in the selected store
        if (!selectedStore || selectedStore.point < drawCost) {
            console.log(
                `You only have ${selectedStore?.point || 0} ${
                    selectedStore?.name || ''
                } points. Need ${drawCost} points.`
            );
            return;
        }

        // Update the points for the selected store
        const updatedStores = stores.map((store) =>
            store.name === selectedStore.name ? { ...store, point: store.point - drawCost } : store
        );

        // Update the selected store with reduced points
        const updatedSelectedStore = {
            ...selectedStore,
            point: selectedStore.point - drawCost,
        };

        // Update global state
        setStores(updatedStores);
        setSelectedStore(updatedSelectedStore);

        // Set up animation
        setDrawCount(count);
        setShowEggAnimation(true);
    };

    const handleAnimationEnd = (newCharacters: Character[]) => {
        setShowEggAnimation(false);
        // In a real app, you would merge these new characters with the existing characters in state
        setCharacters([...characters, ...newCharacters]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-300 pb-24">
            {/* Header with user profile and resources */}
            <PageHeader />

            {/* Page Title with Icon */}
            <div className="mt-2 px-4 flex items-center gap-3">
                <div className="w-14 h-14 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center">
                    <Store className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-800 drop-shadow-sm">Summon</h1>
                    <p className="text-gray-700 text-sm mt-1">
                        Get new characters for your collection
                    </p>
                </div>
            </div>

            {/* Store Selector */}
            <div className="mt-4 px-4">
                <div
                    className="bg-white/90 rounded-xl p-3 shadow-lg flex justify-between items-center"
                    onClick={() => setShowStoreSelector(!showStoreSelector)}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-10 h-10 rounded-full ${getStoreColor(
                                selectedStore?.color || 'blue'
                            )} flex items-center justify-center`}
                        >
                            <Gem className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold">{selectedStore?.name || 'Select Store'}</h3>
                            <p className="text-sm text-gray-500">
                                {selectedStore
                                    ? `${selectedStore.point} points available`
                                    : 'Choose a store to summon from'}
                            </p>
                        </div>
                    </div>
                    <ChevronDown
                        className={`text-gray-500 transition-transform ${
                            showStoreSelector ? 'rotate-180' : ''
                        }`}
                    />
                </div>

                {/* Store Dropdown */}
                {showStoreSelector && (
                    <div className="mt-2 bg-white/90 rounded-xl overflow-hidden shadow-lg">
                        {stores.map((store) => (
                            <div
                                key={store.name}
                                className="flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0"
                                onClick={() => handleSelectStore(store)}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full ${getStoreColor(
                                        store.color
                                    )} flex items-center justify-center`}
                                >
                                    <Gem className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{store.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {store.point} points available
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Summon content */}
            <div className="px-4 mt-4 pb-20">
                <div className="bg-white/90 rounded-xl p-6 shadow-lg">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {selectedStore?.name || 'Character'} Summon
                        </h2>
                        <p className="text-gray-600">
                            Spend points to get characters{' '}
                            {selectedStore ? `from ${selectedStore.name}` : ''}
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
                            disabled={!selectedStore || selectedStore.point < 100}
                            className={`w-full py-3 rounded-xl font-bold text-white shadow-md ${
                                !selectedStore || selectedStore.point < 100
                                    ? 'bg-gray-400'
                                    : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        >
                            Single Draw (100 points)
                        </button>

                        <button
                            onClick={() => handleSummon(true)}
                            disabled={!selectedStore || selectedStore.point < 1000}
                            className={`w-full py-3 rounded-xl font-bold text-white shadow-md ${
                                !selectedStore || selectedStore.point < 1000
                                    ? 'bg-gray-400'
                                    : 'bg-green-500 hover:bg-green-600'
                            }`}
                        >
                            10x Draw (1,000 points)
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => setShowDropRates(!showDropRates)}
                            className="flex items-center gap-2 mx-auto text-blue-600 font-medium"
                        >
                            <Percent size={16} />
                            {showDropRates ? 'Hide Drop Rates' : 'View Drop Rates'}
                        </button>
                    </div>

                    {showDropRates && (
                        <div className="mt-4 bg-gray-50 rounded-lg p-4">
                            <h3 className="font-bold text-gray-700 mb-2">Character Drop Rates</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Common</span>
                                    <span className="font-medium">70%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-600">Rare</span>
                                    <span className="font-medium">20%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-purple-600">Epic</span>
                                    <span className="font-medium">9%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-yellow-600">Legendary</span>
                                    <span className="font-medium">1%</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent summons would go here */}
            </div>

            {/* Egg Animation */}
            <EggAnimation
                isVisible={showEggAnimation}
                onAnimationEnd={handleAnimationEnd}
                drawCount={drawCount}
            />
        </div>
    );
};

export function EggAnimation({ isVisible, onAnimationEnd, drawCount = 1 }: EggAnimationProps) {
    const { characters: gameCharacters, selectedStore } = useGameState();
    const [showCharacters, setShowCharacters] = useState(false);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
    const [highestRarity, setHighestRarity] = useState<CharacterRarity>('common');
    const [showAllCards, setShowAllCards] = useState(false);

    useEffect(() => {
        if (isVisible && !showCharacters) {
            // Generate characters based on rarity rates
            const newCharacters = Array.from({ length: drawCount }, () => {
                const rand = Math.random();
                const selectedRarity = determineRarity(rand);

                // FIXME: This is a temporary fix
                // Function to generate a character with the selected rarity
                const generateCharacter = (rarity: CharacterRarity): Character => {
                    return {
                        id: `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} Character`,
                        image: `https://placehold.co/400x400/gray/white?text=${rarity
                            .substring(0, 2)
                            .toUpperCase()}`,
                        rarity: rarity,
                        discount: `${Math.round(RARITY_RATES[rarity] * 100)}% discount`,
                        isUsing: false,
                        //FIXME: This is a temporary fix
                        storeName: selectedStore?.name || 'Default Store', // Associate character with selected store
                    };
                };

                // Try to find characters of the selected rarity from game state that belong to the current store
                const availableCharacters = gameCharacters.filter(
                    (c: Character) =>
                        c.rarity === selectedRarity &&
                        c.storeName === (selectedStore?.name || 'Default Store') //FIXME:
                );

                // If we have available characters of this rarity, pick a random one
                if (availableCharacters.length > 0) {
                    return availableCharacters[
                        Math.floor(Math.random() * availableCharacters.length)
                    ];
                }

                // Otherwise generate a new one
                return generateCharacter(selectedRarity);
            });

            // Find highest rarity for animation
            const rarityOrder: Record<CharacterRarity, number> = {
                common: 0,
                rare: 1,
                epic: 2,
                legendary: 3,
            };

            const highest = newCharacters.reduce((acc, char) => {
                return rarityOrder[char.rarity as CharacterRarity] > rarityOrder[acc]
                    ? (char.rarity as CharacterRarity)
                    : acc;
            }, 'common' as CharacterRarity);

            setHighestRarity(highest);
            setCharacters(newCharacters);
            setCurrentCharacterIndex(0);
            setShowAllCards(false);

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
            setShowAllCards(false);
        };
    }, [isVisible, drawCount, gameCharacters, showCharacters, selectedStore?.name]);

    const handleNext = () => {
        if (currentCharacterIndex < characters.length - 1) {
            setCurrentCharacterIndex((prev) => prev + 1);
        } else {
            onAnimationEnd(characters);
        }
    };

    if (!isVisible) return null;

    const styles = getRarityEggStyle(highestRarity);
    const currentCharacter = characters[currentCharacterIndex];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={showCharacters && !showAllCards ? handleNext : undefined}
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
                                    style={
                                        {
                                            '--rotation': `${i * 30}deg`,
                                            transform: `rotate(${i * 30}deg) translateY(-50%)`,
                                            transformOrigin: '50% 0',
                                        } as any
                                    }
                                />
                            ))}
                        </>
                    )}

                    {/* Glow effect */}
                    {highestRarity !== 'common' && (
                        <div
                            className={`absolute inset-0 rounded-full bg-gradient-radial ${styles.glow} animate-pulse`}
                        />
                    )}

                    {/* Main egg */}
                    <div className="absolute inset-0 animate-float">
                        <div className="relative w-48 h-60 mx-auto">
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${
                                    styles.egg
                                } rounded-[45%] shadow-xl ${
                                    highestRarity === 'legendary'
                                        ? 'animate-legendary-pulse'
                                        : highestRarity === 'epic'
                                          ? 'animate-epic-pulse'
                                          : highestRarity === 'rare'
                                            ? 'animate-rare-pulse'
                                            : 'animate-pulse'
                                }`}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div
                                        className={`text-6xl font-bold ${
                                            highestRarity === 'legendary'
                                                ? 'text-yellow-300'
                                                : highestRarity === 'epic'
                                                  ? 'text-purple-300'
                                                  : highestRarity === 'rare'
                                                    ? 'text-blue-300'
                                                    : 'text-gray-400'
                                        } animate-pulse`}
                                    >
                                        ?
                                    </div>
                                </div>
                            </div>

                            {/* Sparkles for legendary and epic */}
                            {(highestRarity === 'legendary' || highestRarity === 'epic') && (
                                <>
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`absolute w-4 h-4 rounded-full ${
                                                highestRarity === 'legendary'
                                                    ? 'bg-yellow-300'
                                                    : 'bg-purple-300'
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
            ) : showAllCards ? (
                // Show all cards grid view
                <div className="w-full max-w-4xl p-4 overflow-y-auto max-h-[90vh]">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {characters.map((char, index) => (
                            <div
                                key={index}
                                className="transform animate-scale-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div
                                    className={`rounded-2xl overflow-hidden bg-gradient-to-br ${
                                        char.rarity === 'legendary'
                                            ? 'from-yellow-400 to-yellow-500'
                                            : char.rarity === 'epic'
                                              ? 'from-purple-400 to-purple-500'
                                              : char.rarity === 'rare'
                                                ? 'from-blue-400 to-blue-500'
                                                : 'from-gray-400 to-gray-500'
                                    } p-3 shadow-2xl ${
                                        char.rarity === 'legendary'
                                            ? 'animate-legendary-shine'
                                            : char.rarity === 'epic'
                                              ? 'animate-epic-shine'
                                              : char.rarity === 'rare'
                                                ? 'animate-rare-shine'
                                                : ''
                                    }`}
                                >
                                    <div className="bg-white/90 rounded-xl p-3 space-y-3">
                                        <div className="w-full aspect-square rounded-lg overflow-hidden ring-4 ring-white/50">
                                            <img
                                                src={char.image}
                                                alt={char.name}
                                                width={200}
                                                height={200}
                                                className="w-full h-full object-cover transform hover:scale-110 transition-transform"
                                            />
                                        </div>

                                        <div className="text-center">
                                            <h3 className="text-sm font-bold text-gray-800 mb-1">
                                                {char.name}
                                            </h3>
                                            <div
                                                className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-1 ${
                                                    char.rarity === 'legendary'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : char.rarity === 'epic'
                                                          ? 'bg-purple-100 text-purple-700'
                                                          : char.rarity === 'rare'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {char.rarity.charAt(0).toUpperCase() +
                                                    char.rarity.slice(1)}
                                            </div>
                                            <p className="text-xs text-gray-600">{char.discount}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <button
                            onClick={() => onAnimationEnd(characters)}
                            className="px-8 py-3 bg-white text-gray-800 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            ) : (
                // Single card view with option to show all
                <div className="w-full max-w-sm p-4">
                    {currentCharacter && (
                        <div className="transform animate-scale-up">
                            <div
                                className={`rounded-3xl overflow-hidden bg-gradient-to-br ${
                                    currentCharacter.rarity === 'legendary'
                                        ? 'from-yellow-400 to-yellow-500'
                                        : currentCharacter.rarity === 'epic'
                                          ? 'from-purple-400 to-purple-500'
                                          : currentCharacter.rarity === 'rare'
                                            ? 'from-blue-400 to-blue-500'
                                            : 'from-gray-400 to-gray-500'
                                } p-4 shadow-2xl ${
                                    currentCharacter.rarity === 'legendary'
                                        ? 'animate-legendary-shine'
                                        : currentCharacter.rarity === 'epic'
                                          ? 'animate-epic-shine'
                                          : currentCharacter.rarity === 'rare'
                                            ? 'animate-rare-shine'
                                            : ''
                                }`}
                            >
                                <div className="bg-white/90 rounded-2xl p-4 space-y-4">
                                    <div className="w-full aspect-square rounded-xl overflow-hidden ring-4 ring-white/50">
                                        <img
                                            src={currentCharacter.image}
                                            alt={currentCharacter.name}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover transform hover:scale-110 transition-transform"
                                        />
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            {currentCharacter.name}
                                        </h3>
                                        <div
                                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                                                currentCharacter.rarity === 'legendary'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : currentCharacter.rarity === 'epic'
                                                      ? 'bg-purple-100 text-purple-700'
                                                      : currentCharacter.rarity === 'rare'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {currentCharacter.rarity.charAt(0).toUpperCase() +
                                                currentCharacter.rarity.slice(1)}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {currentCharacter.discount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                {drawCount > 1 && (
                                    <button
                                        onClick={() => setShowAllCards(true)}
                                        className="px-6 py-2 bg-white text-gray-800 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-colors mb-3"
                                    >
                                        Show All Characters
                                    </button>
                                )}
                                <p className="text-white text-sm">
                                    {currentCharacterIndex < characters.length - 1
                                        ? 'Tap to reveal next character'
                                        : 'Tap to continue'}
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

export default SummonPage;
