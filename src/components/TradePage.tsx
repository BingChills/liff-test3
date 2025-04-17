import React, { useState, useMemo } from 'react';
import {
    User,
    ChevronDown,
    Gem,
    Coins,
    Timer,
    Search,
    X,
    Filter,
    ArrowUpDown,
    ArrowRightLeft,
    Plus,
} from 'lucide-react';
import PageHeader from './PageHeader';

type CharacterRarity = 'common' | 'rare' | 'epic' | 'legendary';

type SortOption = 'newest' | 'oldest' | 'rarity-asc' | 'rarity-desc';

interface StoreCurrency {
    name: string;
    gems: number;
    color: string;
}

interface TradeCharacter {
    id: string;
    name: string;
    image: string;
    rarity: CharacterRarity;
    couponDropRate: number;
    couponType: string;
    description: string;
}

interface TradeOffer {
    id: string;
    have: TradeCharacter;
    want: TradeCharacter;
}

const RARITY_ORDER: Record<string, number> = {
    common: 0,
    rare: 1,
    epic: 2,
    legendary: 3,
};

export function TradePage() {
    const [showStoreSelector, setShowStoreSelector] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('newest');

    const [stores] = useState<StoreCurrency[]>([
        { name: 'Parabola', gems: 1600, color: 'emerald' },
        { name: 'KFC', gems: 850, color: 'red' },
        { name: 'Pizza Company', gems: 1200, color: 'blue' },
        { name: 'Pizza Hut', gems: 950, color: 'orange' },
    ]);
    const [selectedStore, setSelectedStore] = useState(stores[0]);

    const MOCK_CHARACTERS: TradeCharacter[] = [
        {
            id: '1',
            name: 'Skyfluff',
            image: 'https://i.ibb.co/JwVPKc3t/u9994361495-httpss-mj-run13-Mfb-Ot-QXr-I-httpss-mj-runqq-Shh-Q7w1-Vw-77deb4f6-3d84-45d1-add6-6091387.png',
            rarity: 'common',
            couponDropRate: 2,
            couponType: '5%',
            description: 'A winged, fluffy fox-like creature with a rainbow tail.',
        },
        {
            id: '6',
            name: 'Aquapuff',
            image: 'https://i.ibb.co/vxnshZYC/u9994361495-httpss-mj-run13-Mfb-Ot-QXr-I-httpss-mj-runqq-Shh-Q7w1-Vw-0158338b-3fd6-4619-b9df-adec2e1.png',
            rarity: 'rare',
            couponDropRate: 7,
            couponType: '15%',
            description: 'A shimmering fish-like creature with flowing fins.',
        },
        {
            id: '9',
            name: 'Starnyx',
            image: 'https://i.ibb.co/VYj2RTzt/u9994361495-httpss-mj-runqq-Shh-Q7w1-Vw-httpss-mj-runl-Pa-Feh-Bvg-QY-64a9ab0e-c88c-4c45-a2a4-eaef36e.png',
            rarity: 'epic',
            couponDropRate: 12,
            couponType: '25%',
            description: 'A sleek, galaxy-themed cat with cosmic sparkles.',
        },
        {
            id: '4',
            name: 'Shadowcrow',
            image: 'https://i.ibb.co/wh5jTWms/u9994361495-httpss-mj-run13-Mfb-Ot-QXr-I-httpss-mj-runqq-Shh-Q7w1-Vw-0b6c54ca-4bf7-4e15-8c86-2251c23.png',
            rarity: 'common',
            couponDropRate: 4,
            couponType: '12%',
            description: 'A mysterious, dark crow with glowing blue energy.',
        },
        {
            id: '7',
            name: 'Bloomtail',
            image: 'https://i.ibb.co/v6NFjj8y/u9994361495-httpss-mj-run13-Mfb-Ot-QXr-I-httpss-mj-runqq-Shh-Q7w1-Vw-ed4dba3d-c0e2-4d3c-8cef-458ad0d.png',
            rarity: 'rare',
            couponDropRate: 8,
            couponType: '18%',
            description: 'A leafy, nature-inspired critter with flowers and vines.',
        },
        {
            id: '3',
            name: 'Solowl',
            image: 'https://i.ibb.co/Tx0sDqNB/u9994361495-httpss-mj-run13-Mfb-Ot-QXr-I-httpss-mj-runqq-Shh-Q7w1-Vw-62afc714-dd40-478f-9b1c-4b0949f.png',
            rarity: 'common',
            couponDropRate: 3,
            couponType: '10%',
            description: 'A glowing, golden owl with mystical patterns on its wings.',
        },
    ];

    const LEGENDARY_CHARACTER: TradeCharacter = {
        id: '10',
        name: 'Celestial Dragon',
        image: 'https://i.ibb.co/kfYNXs2/u9994361495-httpss-mj-runcx-JKl-V3-Wk-Jk-httpss-mj-runl-Pa-Feh-Bvg-QY-05546006-0625-4234-9599-a05c0e.png',
        rarity: 'legendary',
        couponDropRate: 20,
        couponType: '40%',
        description: 'A majestic celestial dragon with cosmic powers.',
    };

    const [tradeOffers] = useState<TradeOffer[]>([
        {
            id: '1',
            have: MOCK_CHARACTERS[0], // Skyfluff
            want: MOCK_CHARACTERS[1], // Aquapuff
        },
        {
            id: '2',
            have: MOCK_CHARACTERS[1], // Aquapuff
            want: MOCK_CHARACTERS[2], // Starnyx
        },
        {
            id: '3',
            have: MOCK_CHARACTERS[2], // Starnyx
            want: LEGENDARY_CHARACTER, // Legendary character
        },
        {
            id: '4',
            have: MOCK_CHARACTERS[3], // Shadowcrow
            want: MOCK_CHARACTERS[0], // Skyfluff
        },
        {
            id: '5',
            have: MOCK_CHARACTERS[4], // Bloomtail
            want: MOCK_CHARACTERS[3], // Shadowcrow
        },
        {
            id: '6',
            have: MOCK_CHARACTERS[5], // Solowl
            want: MOCK_CHARACTERS[2], // Starnyx
        },
    ]);

    const filteredOffers = useMemo(() => {
        let result = [...tradeOffers];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (offer) =>
                    offer.have.name.toLowerCase().includes(query) ||
                    offer.want.name.toLowerCase().includes(query)
            );
        }

        // Apply rarity filter
        if (selectedRarities.length > 0) {
            result = result.filter(
                (offer) =>
                    selectedRarities.includes(offer.have.rarity) ||
                    selectedRarities.includes(offer.want.rarity)
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case 'rarity-asc':
                    return RARITY_ORDER[a.have.rarity] - RARITY_ORDER[b.have.rarity];
                case 'rarity-desc':
                    return RARITY_ORDER[b.have.rarity] - RARITY_ORDER[a.have.rarity];
                case 'oldest':
                    return Number(a.id) - Number(b.id);
                case 'newest':
                default:
                    return Number(b.id) - Number(a.id);
            }
        });

        return result;
    }, [tradeOffers, searchQuery, selectedRarities, sortBy]);

    const getRarityStyle = (rarity: CharacterRarity) => {
        switch (rarity) {
            case 'legendary':
                return 'ring-yellow-400 from-yellow-100 to-yellow-200 text-yellow-700';
            case 'epic':
                return 'ring-purple-400 from-purple-100 to-purple-200 text-purple-700';
            case 'rare':
                return 'ring-blue-400 from-blue-100 to-blue-200 text-blue-700';
            default:
                return 'ring-gray-400 from-gray-100 to-gray-200 text-gray-700';
        }
    };

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
                return 'bg-emerald-400';
        }
    };

    const handleStoreSelect = (store: StoreCurrency) => {
        setSelectedStore(store);
        setShowStoreSelector(false);
    };

    const toggleRarity = (rarity: string) => {
        setSelectedRarities((prev) =>
            prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity]
        );
    };

    const clearFilters = () => {
        setSelectedRarities([]);
        setSortBy('newest');
        setSearchQuery('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-300 pb-24">
            {/* Header */}
            <PageHeader />

            {/* Page Title with Icon */}
            <div className="mt-2 px-4 flex items-center gap-3">
                <div className="w-14 h-14 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center">
                    <Coins className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-800 drop-shadow-sm">
                        Trade Center
                    </h1>
                    <p className="text-gray-700 text-sm mt-1">Exchange your characters!</p>
                </div>
            </div>

            {/* Search and Filter Bar */}
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
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`h-12 px-4 rounded-xl flex items-center gap-2 shadow-lg transition-colors ${
                        showFilters || selectedRarities.length > 0
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/90 text-gray-600 hover:bg-white'
                    }`}
                >
                    <Filter className="w-5 h-5" />
                    <span className="text-sm font-medium">Filter</span>
                    {selectedRarities.length > 0 && (
                        <div className="w-5 h-5 rounded-full bg-white text-blue-500 text-xs font-bold flex items-center justify-center">
                            {selectedRarities.length}
                        </div>
                    )}
                </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="mt-4 mx-4 bg-white/95 rounded-xl p-4 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-blue-600 font-medium hover:text-blue-700"
                        >
                            Clear all
                        </button>
                    </div>

                    {/* Rarity Filters */}
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Rarity</h4>
                        <div className="flex flex-wrap gap-2">
                            {['common', 'rare', 'epic', 'legendary'].map((rarity) => (
                                <button
                                    key={rarity}
                                    onClick={() => toggleRarity(rarity)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                                        selectedRarities.includes(rarity)
                                            ? getRarityStyle(rarity as CharacterRarity)
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                    {rarity}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Sort by</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { value: 'newest', label: 'Newest First' },
                                { value: 'oldest', label: 'Oldest First' },
                                {
                                    value: 'rarity-asc',
                                    label: 'Rarity: Low to High',
                                },
                                {
                                    value: 'rarity-desc',
                                    label: 'Rarity: High to Low',
                                },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSortBy(option.value as SortOption)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        sortBy === option.value
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <ArrowUpDown className="w-4 h-4" />
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Trade List */}
            <div className="px-4 pt-4 space-y-4">
                {filteredOffers.length === 0 ? (
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">No trades found</h3>
                        <p className="text-gray-600">
                            Try adjusting your search or filters to find what you're looking for.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    filteredOffers.map((trade) => (
                        <div
                            key={trade.id}
                            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="p-4">
                                {/* Trade Card Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-blue-500 to-blue-600" />
                                        <h3 className="text-lg font-bold text-gray-700">
                                            Trade Offer #{trade.id}
                                        </h3>
                                    </div>
                                    <div className="bg-blue-100 rounded-full px-3 py-1 flex items-center gap-1.5">
                                        <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-semibold text-blue-600">
                                            Character Exchange
                                        </span>
                                    </div>
                                </div>

                                {/* Character Cards */}
                                <div className="flex flex-col gap-4">
                                    {/* Have Card - Your Offer */}
                                    <div className="rounded-xl p-3 border-2 border-blue-500">
                                        <div className="bg-blue-500 text-white rounded-t-lg px-3 py-1.5 -mt-3 -mx-3 mb-3 flex items-center justify-between">
                                            <span className="font-bold text-sm">YOU OFFER</span>
                                            <span className="bg-white text-blue-600 px-2 py-0.5 rounded-lg text-xs font-semibold uppercase">{trade.have.rarity}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div
                                                className={`w-16 h-16 rounded-xl overflow-hidden ring-2 ${getRarityStyle(
                                                    trade.have.rarity
                                                )}`}
                                            >
                                                <img
                                                    src={trade.have.image}
                                                    alt={trade.have.name}
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-bold">{trade.have.name}</h3>
                                                <p className="text-xs text-gray-500 mb-1">Rarity: <span className="font-semibold capitalize">{trade.have.rarity}</span></p>
                                                <p className="text-xs font-medium">
                                                    <span className="text-blue-600 font-bold bg-blue-100 px-1 rounded">
                                                        [{trade.have.couponDropRate}%]
                                                    </span>
                                                    <span> {trade.have.couponType} 🏷️</span>
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">{trade.have.description}</p>
                                    </div>

                                    {/* Want Card - What You Want */}
                                    <div className="rounded-xl p-3 border-2 border-green-500">
                                        <div className="bg-green-500 text-white rounded-t-lg px-3 py-1.5 -mt-3 -mx-3 mb-3 flex items-center justify-between">
                                            <span className="font-bold text-sm">YOU WANT</span>
                                            <span className="bg-white text-green-600 px-2 py-0.5 rounded-lg text-xs font-semibold uppercase">{trade.want.rarity}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div
                                                className={`w-16 h-16 rounded-xl overflow-hidden ring-2 ${getRarityStyle(
                                                    trade.want.rarity
                                                )}`}
                                            >
                                                <img
                                                    src={trade.want.image}
                                                    alt={trade.want.name}
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-bold">{trade.want.name}</h3>
                                                <p className="text-xs text-gray-500 mb-1">Rarity: <span className="font-semibold capitalize">{trade.want.rarity}</span></p>
                                                <p className="text-xs font-medium">
                                                    <span className="text-blue-600 font-bold bg-blue-100 px-1 rounded">
                                                        [{trade.want.couponDropRate}%]
                                                    </span>
                                                    <span> {trade.want.couponType} 🏷️</span>
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">{trade.want.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Request Button */}
                            <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 transition-colors">
                                Request Trade
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Trade Button */}
            <button className="fixed right-6 bottom-24 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-xl flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all z-20">
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
}

// Add default export to support both named and default imports
export default TradePage;
