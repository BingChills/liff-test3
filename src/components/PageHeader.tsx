import React, { useState, useEffect } from "react";
import { User, Coins, Timer, Gem, ChevronDown } from "lucide-react";
import { useGameState, StoreCurrency } from "../state/gameState";
import { useLiff } from "../context/LiffContext";
import Image from "next/image";

interface PageHeaderProps {
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon }) => {
    const { stores, selectedStore, setSelectedStore, stamina, score } =
        useGameState();
    const { liff, liffDecodedIDToken } = useLiff();
    const [showStoreSelector, setShowStoreSelector] = useState(false);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    // Fetch the user profile directly from LIFF when available
    useEffect(() => {
        const fetchProfile = async () => {
            // Approach 1: Try direct LIFF profile fetch (preferred method)
            if (liff && liff.isLoggedIn()) {
                try {
                    const profile = await liff.getProfile();
                    if (profile.pictureUrl) {
                        setProfilePicture(profile.pictureUrl);
                    }
                } catch (error) {
                    console.error("Error fetching LIFF profile:", error);
                    // Fallback to decoded ID token if available
                    if (liffDecodedIDToken?.picture) {
                        setProfilePicture(liffDecodedIDToken.picture);
                    }
                }
            } 
            // Approach 2: Use decoded token if LIFF is unavailable or user not logged in
            else if (liffDecodedIDToken?.picture) {
                setProfilePicture(liffDecodedIDToken.picture);
            }
        };

        fetchProfile();
    }, [liff, liffDecodedIDToken]);

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

    const handleStoreSelect = (store: StoreCurrency) => {
        setSelectedStore(store);
        setShowStoreSelector(false);
    };

    return (
        <div className="px-4 py-3">
            {/* Resources bar - only the profile and resources */}
            <div className="flex items-center justify-between">
                {/* User profile icon */}
                <div className="w-12 h-12 rounded-2xl shadow-md flex items-center justify-center overflow-hidden">
                    {profilePicture ? (
                        <Image
                            src={profilePicture}
                            alt="Profile"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                    )}
                </div>

                {/* Right side: Resources */}
                <div className="flex items-center gap-2">
                    {/* point/Points */}
                    <div className="relative">
                        <button
                            onClick={() =>
                                setShowStoreSelector(!showStoreSelector)
                            }
                            className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full"
                        >
                            <div
                                className={`w-4 h-4 rounded-full ${getStoreColor(
                                    selectedStore.color
                                )} flex items-center justify-center`}
                            >
                                <Gem className="w-2.5 h-2.5 text-white" />
                            </div>
                            <span className="text-sm font-bold text-white">
                                {selectedStore.point}
                            </span>
                            <ChevronDown className="w-3 h-3 text-white/80" />
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
                                            <div
                                                className={`w-4 h-4 rounded-full ${getStoreColor(
                                                    store.color
                                                )} flex items-center justify-center`}
                                            >
                                                <Gem className="w-2.5 h-2.5 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">
                                                {store.name}
                                            </span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">
                                            {store.point}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Coins/Score */}
                    <div className="flex items-center gap-1 bg-gray-800 px-3 py-1.5 rounded-full">
                        <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                            <Coins className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-sm font-bold text-white">
                            {score}
                        </span>
                    </div>

                    {/* Energy/Stamina */}
                    <div className="flex items-center gap-1 bg-gray-800 px-3 py-1.5 rounded-full">
                        <div className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center">
                            <Timer className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-sm font-bold text-white">
                            {stamina.current}/{stamina.max}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;

