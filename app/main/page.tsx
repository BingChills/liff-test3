"use client";
import React, { useState, useEffect } from 'react';
import { Gem, Coins, Timer, Ticket, Cat, Store, Trophy } from 'lucide-react';
import { EggAnimation } from '../components/EggAnimation';
import { CharactersPage } from '../components/CharactersPage';
import { IMAGES } from '../constants/images';
import { useLiff } from "../context/LiffContext";
import axios from "axios";
import { UserInformation, UserFromDB } from "@/types/types";

const Main = () => {
  const { liffDecodedIDToken } = useLiff();
  const [showDropRates, setShowDropRates] = useState(false);
  const [showEggAnimation, setShowEggAnimation] = useState(false);
  const [gems, setGems] = useState(110);
  const [coins, setCoins] = useState(596);
  const [stamina, setStamina] = useState({ current: 18, max: 20 });
  const [activeTab, setActiveTab] = useState('summon');
  const [error, setError] = useState<string | null>(null);
  const [dummyUserFromDB, setDummyUserFromDB] = useState<UserFromDB | null>(null);

  const dummyUser: UserInformation = {
    iss: "11",
    sub: "test_user_id",
    aud: "33",
    exp: 0,
    iat: 0,
    amr: [],
    name: "test_user_name",
    picture: "https://profile.line-scdn.net/0hzFRzNIDqJWlvAzXWdJ1aPlNGKwQYLSMhFzJiWk8BcltCNWo6AGE4CB4DclkVNzc2UGY5W04Lf1sR"
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (dummyUser) {
          const response = await axios.post("/api/createUser", dummyUser);
          const user = response.data;
          setDummyUserFromDB(user);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to fetch user profile");
      }
    };
    getProfile();
  }, []);

  const handleSpendStamina = () => {
    if (stamina.current <= 0) {
      setError("No stamina left!");
      return;
    }
    setStamina((prev) => ({ ...prev, current: prev.current - 1 }));
    setCoins((prev) => prev + 10); // reward with coins
    setError(null); // clear error if any
  };

  const handleSummon = (amount: number, cost: number) => {
    if (gems >= cost) {
      setGems(gems - cost);
      setShowEggAnimation(true);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'characters':
        return <CharactersPage />;
      case 'summon':
        return (
          <>
            {/* Main Content - Egg Display */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 mt-8">
              <div className="w-full max-w-md aspect-square relative">
                <img 
                  src={IMAGES.MYSTERY_EGG}
                  alt="Mystery Egg"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Summon Buttons */}
            <div className="absolute bottom-24 left-0 right-0 px-4 space-y-3 z-10">
              <button
                onClick={() => handleSummon(1, 50)}
                className="summon-button w-full h-12 relative group"
                disabled={gems < 50}
              >
                <div className="absolute inset-0 bg-[#32CD32] rounded-xl shadow-[0_4px_0_#228B22]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="gem-icon w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center">
                      <Gem className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-base font-black text-white tracking-wide">50</span>
                  </div>
                </div>
                <div className="absolute inset-x-0 -bottom-5 text-center">
                  <span className="text-xs font-bold text-white drop-shadow-md">Draw 1 Time</span>
                </div>
              </button>
              
              <button
                onClick={() => handleSummon(10, 500)}
                className="summon-button w-full h-12 relative group"
                disabled={gems < 500}
              >
                <div className="absolute inset-0 bg-[#32CD32] rounded-xl shadow-[0_4px_0_#228B22]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="gem-icon w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center">
                      <Gem className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-base font-black text-white tracking-wide">500</span>
                  </div>
                </div>
                <div className="absolute inset-x-0 -bottom-5 text-center">
                  <span className="text-xs font-bold text-white drop-shadow-md">Draw 10 Times</span>
                </div>
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#87CEEB] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#F4D03F]" />
        <div className="absolute left-4 bottom-32 w-24 h-32">
          <div className="absolute bottom-0 w-full h-full bg-[#228B22] rounded-t-full transform -skew-x-6" />
        </div>
        <div className="absolute right-4 bottom-40 w-20 h-28">
          <div className="absolute bottom-0 w-full h-full bg-[#228B22] rounded-t-full transform skew-x-6" />
        </div>
        <div className="absolute right-8 top-8 w-24 h-24 bg-[#FFF8DC] rounded-full opacity-80" />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 px-4 pt-safe-top">
        <div className="flex items-center justify-between py-2">
          <div className="w-14 h-14 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center">
          {dummyUserFromDB && (
              <div className="mt-8 text-center">
                <h2 className="text-xl font-bold">User Info</h2>
                <img src={dummyUserFromDB.profile_picture} alt={dummyUserFromDB.username} className="w-24 h-24 rounded-full mx-auto" />
                <p className="mt-2">Name: {dummyUserFromDB.username}</p>
                { liffDecodedIDToken && (
                  <p className="mt-2">ID: {liffDecodedIDToken.sub}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1.5 rounded-full">
              <div className="w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center">
                <Gem className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">{gems}</span>
            </div>
            
            <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1.5 rounded-full">
              <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                <Coins className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">{coins}</span>
            </div>
            
            <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1.5 rounded-full">
              <div className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center">
                <Timer className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">{stamina.current}/{stamina.max}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Drop Rates Button - Only show in summon tab */}
      {activeTab === 'summon' && (
        <button 
          onClick={() => setShowDropRates(!showDropRates)}
          className="absolute top-20 left-4 z-10 w-12 h-12 rounded-full"
        >
          <div className="absolute inset-0 bg-blue-500 rounded-full" />
          <div className="absolute inset-0 border-2 border-white rounded-full" />
          <div className="absolute inset-1 bg-blue-400 rounded-full flex flex-col items-center justify-center">
            <span className="text-xl font-black text-white">i</span>
            <span className="text-[8px] font-bold text-white leading-none mt-[-2px]">Drop Rates</span>
          </div>
        </button>
      )}

      {/* Main Content */}
      {renderContent()}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-20">
        <div className="flex justify-between items-center px-6 py-2 pb-safe-bottom">
          <button 
            onClick={() => setActiveTab('coupon')}
            className="nav-icon flex flex-col items-center w-16 py-1"
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'coupon' ? 'text-blue-500' : 'text-gray-400'}`}>
              <Ticket className="w-5 h-5" />
            </div>
            <span className={`text-[10px] ${activeTab === 'coupon' ? 'text-blue-500' : 'text-gray-500'}`}>Coupon</span>
          </button>

          <button 
            onClick={() => setActiveTab('characters')}
            className="nav-icon flex flex-col items-center w-16 py-1"
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'characters' ? 'text-blue-500' : 'text-gray-400'}`}>
              <Cat className="w-5 h-5" />
            </div>
            <span className={`text-[10px] ${activeTab === 'characters' ? 'text-blue-500' : 'text-gray-500'}`}>Characters</span>
          </button>

          <button 
            onClick={() => setActiveTab('summon')}
            className="nav-icon flex flex-col items-center w-16 py-1"
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'summon' ? 'text-purple-500' : 'text-gray-400'}`}>
              <Gem className="w-5 h-5" />
            </div>
            <span className={`text-[10px] ${activeTab === 'summon' ? 'text-purple-500' : 'text-gray-500'}`}>Summon</span>
          </button>

          <button 
            onClick={() => setActiveTab('trade')}
            className="nav-icon flex flex-col items-center w-16 py-1"
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'trade' ? 'text-blue-500' : 'text-gray-400'}`}>
              <Store className="w-5 h-5" />
            </div>
            <span className={`text-[10px] ${activeTab === 'trade' ? 'text-blue-500' : 'text-gray-500'}`}>Trade</span>
          </button>

          <button 
            onClick={() => setActiveTab('leaderboard')}
            className="nav-icon flex flex-col items-center w-16 py-1"
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'leaderboard' ? 'text-blue-500' : 'text-gray-400'}`}>
              <Trophy className="w-5 h-5" />
            </div>
            <span className={`text-[10px] ${activeTab === 'leaderboard' ? 'text-blue-500' : 'text-gray-500'}`}>Leaderboard</span>
          </button>
        </div>
      </div>

      {/* Drop Rates Modal */}
      {showDropRates && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-30">
          <div className="bg-white w-[85%] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-center">Drop Rates</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="text-lg font-semibold">Common</span>
                <span className="text-lg font-bold">60%</span>
              </div>
              <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                <span className="text-lg font-semibold text-blue-600">Rare</span>
                <span className="text-lg font-bold text-blue-700">30%</span>
              </div>
              <div className="flex justify-between items-center bg-purple-50 p-3 rounded-lg">
                <span className="text-lg font-semibold text-purple-600">Epic</span>
                <span className="text-lg font-bold text-purple-700">8%</span>
              </div>
              <div className="flex justify-between items-center bg-yellow-50 p-3 rounded-lg">
                <span className="text-lg font-semibold text-yellow-600">Legendary</span>
                <span className="text-lg font-bold text-yellow-700">2%</span>
              </div>
            </div>
            <button 
              onClick={() => setShowDropRates(false)}
              className="mt-6 w-full bg-gray-100 py-3 rounded-xl text-lg font-semibold text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Egg Animation */}
      <EggAnimation 
        isVisible={showEggAnimation} 
        onAnimationEnd={() => setShowEggAnimation(false)} 
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button 
        onClick={handleSpendStamina}
        className="mt-4 p-2 bg-green-500 text-white rounded"
      >
        Spend 1 Stamina to Gain 10 Coins
      </button>
    </div>
  );
}

export default Main;