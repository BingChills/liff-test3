import React, { useState } from "react";
import { Cat, Gem } from "lucide-react";
import { useGameState } from "../state/gameState";
import PageHeader from "./PageHeader";
import Image from "next/image";

const CharactersPage = () => {
    const {
        characters,
        stores,
        selectedStore,
        setSelectedStore,
        setCharacters,
    } = useGameState();
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter characters based on store
    const filteredCharacters = selectedStore
        ? characters.filter((char) => char.storeName === selectedStore.name)
        : characters;

    // Split characters into using and inventory
    const usingCharacters = filteredCharacters.filter((char) => char.isUsing);
    const inventoryCharacters = filteredCharacters.filter(
        (char) => !char.isUsing
    );

    const toggleCharacterUse = (id: string) => {
        const usingCount = characters.filter((char) => char.isUsing).length;

        const newCharacters = characters.map((char) => {
            if (char.id === id) {
                if (!char.isUsing && usingCount >= 3) {
                    return char;
                }
                return { ...char, isUsing: !char.isUsing };
            }
            return char;
        });

        // Update the game state
        setCharacters(newCharacters);
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
                return "bg-blue-400";
        }
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case "common":
                return "bg-gray-100";
            case "rare":
                return "bg-blue-100";
            case "epic":
                return "bg-purple-100";
            case "legendary":
                return "bg-yellow-100";
            default:
                return "bg-gray-100";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-300 pb-24">
            {/* Header with user profile and resources */}
            <PageHeader />

            {/* Page Title with Icon */}
            <div className="mt-2 px-4 flex items-center gap-3">
                <div className="w-14 h-14 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center">
                    <Cat className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-800 drop-shadow-sm">
                        Characters
                    </h1>
                    <p className="text-gray-700 text-sm mt-1">
                        {selectedCompany
                            ? `${selectedCompany} Collection`
                            : "All Characters"}
                    </p>
                </div>
            </div>

            {/* Company Filter Tabs */}
            <div className="mt-4 px-4 flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                <button
                    onClick={() => setSelectedCompany(null)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                        selectedCompany === null
                            ? "bg-white text-gray-800"
                            : "bg-white/40 text-gray-400"
                    }`}
                >
                    All Characters
                </button>
                {stores.map((store) => (
                    <button
                        key={store.name}
                        onClick={() => setSelectedCompany(store.name)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                            selectedCompany === store.name
                                ? "bg-white text-gray-800"
                                : "bg-white/40 text-gray-400"
                        }`}
                    >
                        {store.name}
                    </button>
                ))}
            </div>

            {/* Using Section */}
            <div className="px-3 mt-4 mb-4">
                <div className="w-full bg-white/90 rounded-xl p-2.5 mb-3 shadow-lg">
                    <span className="text-lg font-bold">
                        Using ({usingCharacters.length}/3)
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {usingCharacters.map((char) => (
                        <div
                            key={char.id}
                            className={`${getRarityColor(
                                char.rarity
                            )} rounded-xl p-2 shadow-lg relative cartoon-border`}
                        >
                            <div
                                className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${getStoreColor(
                                    stores.find(
                                        (s) => s.name === char.storeName
                                    )?.color || "emerald"
                                )} flex items-center justify-center`}
                            >
                                <Gem className="w-3.5 h-3.5 text-white" />
                            </div>
                            <Image
                                src={char.image}
                                alt={char.name}
                                width={100}
                                height={100}
                                className="w-full aspect-square object-cover rounded-lg mb-1.5"
                            />
                            <div className="text-center">
                                <h3 className="font-bold text-xs mb-0.5">
                                    {char.name}
                                </h3>
                                <p className="text-[10px] font-medium">
                                    {char.discount}
                                </p>
                            </div>
                            <button
                                onClick={() => toggleCharacterUse(char.id)}
                                className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-lg"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    {usingCharacters.length === 0 && (
                        <div className="col-span-3 bg-white/50 rounded-xl p-4 text-center">
                            <p className="text-gray-500 text-sm">
                                No characters selected
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Inventory Section */}
            <div className="px-3">
                <div className="w-full bg-white/90 rounded-xl p-2.5 mb-3 shadow-lg">
                    <span className="text-lg font-bold">
                        Backpack ({inventoryCharacters.length})
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {inventoryCharacters.map((char) => (
                        <div
                            key={char.id}
                            className={`${getRarityColor(
                                char.rarity
                            )} rounded-xl p-2 shadow-lg relative cartoon-border`}
                        >
                            <div
                                className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${getStoreColor(
                                    stores.find(
                                        (s) => s.name === char.storeName
                                    )?.color || "emerald"
                                )} flex items-center justify-center`}
                            >
                                <Gem className="w-3.5 h-3.5 text-white" />
                            </div>
                            <Image
                                src={char.image}
                                alt={char.name}
                                width={100}
                                height={100}
                                className="w-full aspect-square object-cover rounded-lg mb-1.5"
                            />
                            <div className="text-center">
                                <h3 className="font-bold text-xs mb-0.5">
                                    {char.name}
                                </h3>
                                <p className="text-[10px] font-medium">
                                    {char.discount}
                                </p>
                            </div>
                            <button
                                onClick={() => toggleCharacterUse(char.id)}
                                disabled={usingCharacters.length >= 3}
                                className={`absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 ${
                                    usingCharacters.length >= 3
                                        ? "bg-gray-400"
                                        : "bg-green-500"
                                } text-white text-[10px] px-2 py-0.5 rounded-full shadow-lg`}
                            >
                                {usingCharacters.length >= 3 ? "Full" : "Use"}
                            </button>
                        </div>
                    ))}
                    {inventoryCharacters.length === 0 && (
                        <div className="col-span-3 bg-white/50 rounded-xl p-4 text-center">
                            <p className="text-gray-500 text-sm">
                                No characters in backpack
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CharactersPage;
