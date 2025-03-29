import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import PageHeader from "./PageHeader";
import Image from "next/image";

type CharacterRarity = "common" | "rare" | "epic" | "legendary";

type SortOption = "newest" | "oldest" | "rarity-asc" | "rarity-desc";

interface StoreCurrency {
    name: string;
    gems: number;
    color: string;
}

interface TradeCharacter {
    name: string;
    image: string;
    discount: string;
    rarity: CharacterRarity;
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
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>("newest");

    const [stores] = useState<StoreCurrency[]>([
        { name: "Parabola", gems: 1600, color: "emerald" },
        { name: "KFC", gems: 850, color: "red" },
        { name: "Pizza Company", gems: 1200, color: "blue" },
        { name: "Pizza Hut", gems: 950, color: "orange" },
    ]);
    const [selectedStore, setSelectedStore] = useState(stores[0]);

    const [tradeOffers] = useState<TradeOffer[]>([
        {
            id: "1",
            have: {
                name: "Phoenix Bird",
                image: "https://images.unsplash.com/photo-1557401620-67270b61ea81?auto=format&fit=crop&w=200&q=80",
                discount: "50% Off Any Order",
                rarity: "legendary",
            },
            want: {
                name: "Dragon Spirit",
                image: "https://images.unsplash.com/photo-1577493340887-b7bfff550145?auto=format&fit=crop&w=200&q=80",
                discount: "Buy 1 Get 2 Free",
                rarity: "legendary",
            },
        },
        {
            id: "2",
            have: {
                name: "Spirit Tiger",
                image: "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&w=200&q=80",
                discount: "Buy 2 Get 1 Free",
                rarity: "epic",
            },
            want: {
                name: "Crystal Fox",
                image: "https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=200&q=80",
                discount: "40% Weekend Discount",
                rarity: "epic",
            },
        },
        {
            id: "3",
            have: {
                name: "Mystic Wolf",
                image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=200&q=80",
                discount: "30% Off Everything",
                rarity: "epic",
            },
            want: {
                name: "Ancient Guardian",
                image: "https://images.unsplash.com/photo-1533582437341-eac7c1f8229c?auto=format&fit=crop&w=200&q=80",
                discount: "70% Special Discount",
                rarity: "legendary",
            },
        },
        {
            id: "4",
            have: {
                name: "Golden Retriever",
                image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&q=80",
                discount: "15% Discount",
                rarity: "rare",
            },
            want: {
                name: "Arctic Fox",
                image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=200&q=80",
                discount: "20% Off",
                rarity: "rare",
            },
        },
        {
            id: "5",
            have: {
                name: "Mysterious Cat",
                image: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=200&q=80",
                discount: "Buy 1 Get 1 Free",
                rarity: "rare",
            },
            want: {
                name: "Spirit Tiger",
                image: "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&w=200&q=80",
                discount: "Buy 2 Get 1 Free",
                rarity: "epic",
            },
        },
        {
            id: "6",
            have: {
                name: "Red Panda",
                image: "https://images.unsplash.com/photo-1590692464430-96ff0b53f82f?auto=format&fit=crop&w=200&q=80",
                discount: "Free Appetizer",
                rarity: "rare",
            },
            want: {
                name: "Crystal Fox",
                image: "https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=200&q=80",
                discount: "40% Weekend Discount",
                rarity: "epic",
            },
        },
        {
            id: "7",
            have: {
                name: "Friendly Hamster",
                image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=200&q=80",
                discount: "10% Discount",
                rarity: "common",
            },
            want: {
                name: "Mysterious Cat",
                image: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=200&q=80",
                discount: "Buy 1 Get 1 Free",
                rarity: "rare",
            },
        },
        {
            id: "8",
            have: {
                name: "Sleepy Cat",
                image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=200&q=80",
                discount: "5% Off",
                rarity: "common",
            },
            want: {
                name: "Golden Retriever",
                image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&q=80",
                discount: "15% Discount",
                rarity: "rare",
            },
        },
        {
            id: "9",
            have: {
                name: "Playful Puppy",
                image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80",
                discount: "Free Drink",
                rarity: "common",
            },
            want: {
                name: "Arctic Fox",
                image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=200&q=80",
                discount: "20% Off",
                rarity: "rare",
            },
        },
        {
            id: "10",
            have: {
                name: "Dragon Spirit",
                image: "https://images.unsplash.com/photo-1577493340887-b7bfff550145?auto=format&fit=crop&w=200&q=80",
                discount: "Buy 1 Get 2 Free",
                rarity: "legendary",
            },
            want: {
                name: "Phoenix Bird",
                image: "https://images.unsplash.com/photo-1557401620-67270b61ea81?auto=format&fit=crop&w=200&q=80",
                discount: "50% Off Any Order",
                rarity: "legendary",
            },
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
                case "rarity-asc":
                    return (
                        RARITY_ORDER[a.have.rarity] -
                        RARITY_ORDER[b.have.rarity]
                    );
                case "rarity-desc":
                    return (
                        RARITY_ORDER[b.have.rarity] -
                        RARITY_ORDER[a.have.rarity]
                    );
                case "oldest":
                    return Number(a.id) - Number(b.id);
                case "newest":
                default:
                    return Number(b.id) - Number(a.id);
            }
        });

        return result;
    }, [tradeOffers, searchQuery, selectedRarities, sortBy]);

    const getRarityStyle = (rarity: string) => {
        switch (rarity) {
            case "common":
                return "from-gray-100 to-gray-200 text-gray-700 ring-gray-300";
            case "rare":
                return "from-blue-100 to-blue-200 text-blue-700 ring-blue-300";
            case "epic":
                return "from-purple-100 to-purple-200 text-purple-700 ring-purple-300";
            case "legendary":
                return "from-yellow-100 to-yellow-200 text-yellow-700 ring-yellow-300";
            default:
                return "from-gray-100 to-gray-200 text-gray-700 ring-gray-300";
        }
    };

    const getStoreColor = (color: string) => {
        switch (color) {
            case "emerald":
                return "bg-emerald-400";
            case "red":
                return "bg-red-500";
            case "blue":
                return "bg-blue-500";
            case "orange":
                return "bg-orange-500";
            default:
                return "bg-emerald-400";
        }
    };

    const handleStoreSelect = (store: StoreCurrency) => {
        setSelectedStore(store);
        setShowStoreSelector(false);
    };

    const toggleRarity = (rarity: string) => {
        setSelectedRarities((prev) =>
            prev.includes(rarity)
                ? prev.filter((r) => r !== rarity)
                : [...prev, rarity]
        );
    };

    const clearFilters = () => {
        setSelectedRarities([]);
        setSortBy("newest");
        setSearchQuery("");
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
                    <p className="text-gray-700 text-sm mt-1">
                        Exchange your characters!
                    </p>
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
                            onClick={() => setSearchQuery("")}
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
                            ? "bg-blue-500 text-white"
                            : "bg-white/90 text-gray-600 hover:bg-white"
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
                        <h3 className="text-lg font-bold text-gray-800">
                            Filters
                        </h3>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-blue-600 font-medium hover:text-blue-700"
                        >
                            Clear all
                        </button>
                    </div>

                    {/* Rarity Filters */}
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">
                            Rarity
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {["common", "rare", "epic", "legendary"].map(
                                (rarity) => (
                                    <button
                                        key={rarity}
                                        onClick={() => toggleRarity(rarity)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                                            selectedRarities.includes(rarity)
                                                ? rarity === "legendary"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : rarity === "epic"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : rarity === "rare"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-gray-100 text-gray-700"
                                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        }`}
                                    >
                                        {rarity}
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">
                            Sort by
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { value: "newest", label: "Newest First" },
                                { value: "oldest", label: "Oldest First" },
                                {
                                    value: "rarity-asc",
                                    label: "Rarity: Low to High",
                                },
                                {
                                    value: "rarity-desc",
                                    label: "Rarity: High to Low",
                                },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() =>
                                        setSortBy(option.value as SortOption)
                                    }
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        sortBy === option.value
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                            No trades found
                        </h3>
                        <p className="text-gray-600">
                            Try adjusting your search or filters to find what
                            you're looking for.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    filteredOffers.map((offer) => (
                        <div
                            key={offer.id}
                            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="p-4">
                                {/* Trade Card Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-blue-500 to-blue-600" />
                                        <h3 className="text-lg font-bold text-gray-700">
                                            Trade Offer
                                        </h3>
                                    </div>
                                    <div className="bg-blue-100 rounded-full px-3 py-1 flex items-center gap-1.5">
                                        <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-semibold text-blue-600">
                                            Exchange
                                        </span>
                                    </div>
                                </div>

                                {/* Character Cards */}
                                <div className="flex flex-col gap-4">
                                    {/* Have Card */}
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div
                                                className={`w-16 h-16 rounded-xl overflow-hidden ring-2 bg-gradient-to-br ${getRarityStyle(
                                                    offer.have.rarity
                                                )}`}
                                            >
                                                <Image
                                                    src={offer.have.image}
                                                    alt={offer.have.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-800">
                                                        {offer.have.name}
                                                    </span>
                                                    <div
                                                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                            offer.have
                                                                .rarity ===
                                                            "legendary"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : offer.have
                                                                      .rarity ===
                                                                  "epic"
                                                                ? "bg-purple-100 text-purple-700"
                                                                : offer.have
                                                                      .rarity ===
                                                                  "rare"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-gray-100 text-gray-700"
                                                        }`}
                                                    >
                                                        {offer.have.rarity
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            offer.have.rarity.slice(
                                                                1
                                                            )}
                                                    </div>
                                                </div>
                                                <span
                                                    className={`text-sm font-medium ${
                                                        getRarityStyle(
                                                            offer.have.rarity
                                                        ).split(" ")[2]
                                                    } block mt-1`}
                                                >
                                                    {offer.have.discount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Want Card */}
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div
                                                className={`w-16 h-16 rounded-xl overflow-hidden ring-2 bg-gradient-to-br ${getRarityStyle(
                                                    offer.want.rarity
                                                )}`}
                                            >
                                                <Image
                                                    src={offer.want.image}
                                                    alt={offer.want.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-800">
                                                        {offer.want.name}
                                                    </span>
                                                    <div
                                                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                            offer.want
                                                                .rarity ===
                                                            "legendary"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : offer.want
                                                                      .rarity ===
                                                                  "epic"
                                                                ? "bg-purple-100 text-purple-700"
                                                                : offer.want
                                                                      .rarity ===
                                                                  "rare"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-gray-100 text-gray-700"
                                                        }`}
                                                    >
                                                        {offer.want.rarity
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            offer.want.rarity.slice(
                                                                1
                                                            )}
                                                    </div>
                                                </div>
                                                <span
                                                    className={`text-sm font-medium ${
                                                        getRarityStyle(
                                                            offer.want.rarity
                                                        ).split(" ")[2]
                                                    } block mt-1`}
                                                >
                                                    {offer.want.discount}
                                                </span>
                                            </div>
                                        </div>
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

