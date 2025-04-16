import React, { useState, useEffect } from 'react';
import { Store, Gem, ChevronDown, Percent, Box, Ticket } from 'lucide-react';
import { useGameState, Character, StoreCurrency } from '../state/gameState';
import PageHeader from './PageHeader';

// Define rarity type for consistency
type CharacterRarity = 'common' | 'rare' | 'epic' | 'legendary';

// Define rarity rates
const RARITY_RATES: Record<CharacterRarity, number> = {
    legendary: 0.05,
    epic: 0.10,
    rare: 0.15,
    common: 0.70,
};

// Character pool for summoning
const CHARACTER_POOL = [
    {
        id: "1",
        name: "Skyfluff",
        image: "https://i.ibb.co/JwVPKc3t/u9994361495-httpss-mj-run13-Mfb-Ot-QXr-I-httpss-mj-runqq-Shh-Q7w1-Vw-77deb4f6-3d84-45d1-add6-6091387.png",
        rarity: "common" as CharacterRarity,
        dropRate: 70.0,
        amount: 20,
        description: "A winged, fluffy fox-like creature with a rainbow tail."
    },
    {
        id: "2",
        name: "Snugglebear",
        image: "https://i.ibb.co/jk9sNPyg/u9994361495-httpss-mj-run13-Mfb-Ot-QXr-I-httpss-mj-runqq-Shh-Q7w1-Vw-105f6dab-d6d9-47d1-8a76-19c220c.png",
        rarity: "common" as CharacterRarity,
        dropRate: 70.0,
        amount: 50,
        description: "A cozy bear wearing a warm scarf."
    },
    {
        id: "3",
        name: "Solowl",
        image: "https://i.ibb.co/Tx0sDqNB/u9994361495-httpss-mj-run13-Mfb-Ot-QXr-I-httpss-mj-runqq-Shh-Q7w1-Vw-62afc714-dd40-478f-9b1c-4b0949f.png",
        rarity: "common" as CharacterRarity,
        dropRate: 70.0,
        amount: 100,
        description: "A glowing, golden owl with mystical patterns on its wings."
    },
    {
        id: "4",
        name: "Shadowcrow",
        image: "https://i.ibb.co/wh5jTWms/u9994361495-httpss-mj-run13-Mfb-Ot-QXr-I-httpss-mj-runqq-Shh-Q7w1-Vw-0b6c54ca-4bf7-4e15-8c86-2251c23.png",
        rarity: "common" as CharacterRarity,
        dropRate: 70.0,
        amount: 200,
        description: "A mysterious, dark crow with glowing blue energy."
    },
    {
        id: "5",
        name: "Snowpup",
        image: "https://i.ibb.co/Zz13Xhck/u9994361495-httpss-mj-run13-Mfb-Ot-QXr-I-httpss-mj-runqq-Shh-Q7w1-Vw-066071be-391b-448d-b1bb-d543c8f.png",
        rarity: "common" as CharacterRarity,
        dropRate: 70.0,
        amount: 50,
        description: "A soft, white puppy with sparkly blue eyes."
    },
    {
        id: "6",
        name: "Aquapuff",
        image: "https://i.ibb.co/vxnshZYC/u9994361495-httpss-mj-run13-Mfb-Ot-QXr-I-httpss-mj-runqq-Shh-Q7w1-Vw-0158338b-3fd6-4619-b9df-adec2e1.png",
        rarity: "rare" as CharacterRarity,
        dropRate: 15.0,
        amount: 20,
        description: "A shimmering fish-like creature with flowing fins."
    },
    {
        id: "7",
        name: "Bloomtail",
        image: "https://i.ibb.co/v6NFjj8y/u9994361495-httpss-mj-run13-Mfb-Ot-QXr-I-httpss-mj-runqq-Shh-Q7w1-Vw-ed4dba3d-c0e2-4d3c-8cef-458ad0d.png",
        rarity: "rare" as CharacterRarity,
        dropRate: 15.0,
        amount: 100,
        description: "A leafy, nature-inspired critter with flowers and vines."
    },
    {
        id: "8",
        name: "Blazion",
        image: "https://i.ibb.co/kfYNXs2/u9994361495-httpss-mj-runcx-JKl-V3-Wk-Jk-httpss-mj-runl-Pa-Feh-Bvg-QY-05546006-0625-4234-9599-a05c0e.png",
        rarity: "rare" as CharacterRarity,
        dropRate: 15.0,
        amount: 50,
        description: "A majestic lion with a fiery mane."
    },
    {
        id: "9",
        name: "Starnyx",
        image: "https://i.ibb.co/VYj2RTzt/u9994361495-httpss-mj-runqq-Shh-Q7w1-Vw-httpss-mj-runl-Pa-Feh-Bvg-QY-64a9ab0e-c88c-4c45-a2a4-eaef36e.png",
        rarity: "epic" as CharacterRarity,
        dropRate: 10.0,
        amount: 200,
        description: "A sleek, galaxy-themed cat with cosmic sparkles."
    },
    {
        id: "10",
        name: "Prickletoes",
        image: "https://i.ibb.co/bMscQm8d/u9994361495-httpss-mj-runqq-Shh-Q7w1-Vw-httpss-mj-runl-Pa-Feh-Bvg-QY-4495ea61-d18f-4a3b-ba16-e5dbb5f.png",
        rarity: "epic" as CharacterRarity,
        dropRate: 10.0,
        amount: 20,
        description: "An adorable hedgehog bundled in a scarf."
    },
    {
        id: "11",
        name: "Lunafluff",
        image: "https://i.ibb.co/WpsypscR/u9994361495-httpss-mj-runqq-Shh-Q7w1-Vw-httpss-mj-runl-Pa-Feh-Bvg-QY-26693c8e-33bb-4f1d-b81b-c9c4778.png",
        rarity: "legendary" as CharacterRarity,
        dropRate: 5.0,
        amount: 20,
        description: "the gentle glow of the moon"
    }
];

// Group characters by rarity for easier selection
const CHARACTERS_BY_RARITY = {
    common: CHARACTER_POOL.filter(char => char.rarity === 'common'),
    rare: CHARACTER_POOL.filter(char => char.rarity === 'rare'),
    epic: CHARACTER_POOL.filter(char => char.rarity === 'epic'),
    legendary: CHARACTER_POOL.filter(char => char.rarity === 'legendary')
};

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
    
    // Ensure a store is selected for summoning
    React.useEffect(() => {
        if (stores.length > 0 && !selectedStore) {
            // Set the first store as selected if none is selected
            setSelectedStore(stores[0]);
        }
    }, [stores, selectedStore, setSelectedStore]);

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
        
        // Check for duplicate characters and only add new ones
        const existingIds = new Set(characters.map(char => char.id));
        const uniqueNewCharacters = newCharacters.filter(char => !existingIds.has(char.id));
        
        // Merge with existing characters
        setCharacters([...characters, ...uniqueNewCharacters]);
        
        // Show a summary of what was drawn
        console.log('Drew characters:', newCharacters.map(c => `${c.name} (${c.rarity})`).join(', '));
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
    const { selectedStore } = useGameState();
    const [showCharacters, setShowCharacters] = useState(false);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
    const [highestRarity, setHighestRarity] = useState<CharacterRarity>('common');
    const [showAllCards, setShowAllCards] = useState(false);

    // This effect generates characters when the animation becomes visible
    useEffect(() => {
        if (isVisible && characters.length === 0) {
            // Generate characters using our CHARACTER_POOL data
            const newCharacters: Character[] = [];
            
            for (let i = 0; i < drawCount; i++) {
                // Generate random number to determine rarity
                const rand = Math.random();
                const rarity = determineRarity(rand);
                
                // Get all characters of that rarity
                const availableCharacters = CHARACTERS_BY_RARITY[rarity];
                
                if (availableCharacters.length > 0) {
                    // Select a random character from that rarity pool
                    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
                    const selectedCharacter = availableCharacters[randomIndex];
                    
                    // Create a new character with the selected store
                    const newChar: Character = {
                        id: selectedCharacter.id,
                        name: selectedCharacter.name,
                        image: selectedCharacter.image,
                        rarity: selectedCharacter.rarity,
                        discount: `${selectedCharacter.amount}%`,
                        isUsing: false,
                        storeName: selectedStore?.name || 'Pet Store' // Use the selected store for the character
                    };
                    
                    newCharacters.push(newChar);
                } else {
                    // Fallback in case we don't have characters of the drawn rarity
                    const newChar: Character = {
                        id: `draw-${Date.now()}-${i}`,
                        name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} Creature`,
                        image: `https://placehold.co/150x150/${getRarityColor(rarity).replace('bg-', '').replace('-100', '')}/white?text=${rarity}`,
                        rarity: rarity,
                        discount: `${(Math.floor(Math.random() * 5) + 1) * 5}%`,
                        isUsing: false,
                        storeName: selectedStore?.name || 'Pet Store'
                    };
                    
                    newCharacters.push(newChar);
                }
            }
            
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
            
            // Show egg animation for 2 seconds, then reveal characters
            setTimeout(() => {
                setShowCharacters(true);
            }, 2000);
        }

        return () => {
            if (!isVisible) {
                // Reset animation state when component hides
                setShowCharacters(false);
                setCharacters([]);
                setCurrentCharacterIndex(0);
                setHighestRarity('common');
                setShowAllCards(false);
            }
        };
    }, [isVisible, drawCount, selectedStore?.name, characters.length]);

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
                                        : characters[0]?.rarity === 'epic'
                                          ? 'animate-epic-pulse'
                                          : characters[0]?.rarity === 'rare'
                                            ? 'animate-rare-pulse'
                                            : 'animate-pulse'
                                }`}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div
                                        className={`text-6xl font-bold ${
                                            characters[0]?.rarity === 'legendary'
                                                ? 'text-yellow-300'
                                                : characters[0]?.rarity === 'epic'
                                                  ? 'text-purple-300'
                                                  : characters[0]?.rarity === 'rare'
                                                    ? 'text-blue-300'
                                                    : 'text-gray-400'
                                        } animate-pulse`}
                                    >
                                        ?
                                    </div>
                                </div>
                            </div>

                            {/* Sparkles for legendary and epic */}
                            {(characters[0]?.rarity === 'legendary' || characters[0]?.rarity === 'epic') && (
                                <>
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`absolute w-4 h-4 rounded-full ${
                                                characters[0]?.rarity === 'legendary'
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
