// Profile modal to display player data
import React from 'react';
import { X, User, Trophy, Heart, RefreshCw } from 'lucide-react';
import { useGameState } from '../state/gameState';
import { useLiff } from '../context/LiffContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { stamina, score, characters, coupons } = useGameState();
  const { profilePicture, userName, lineUserId, resetPermissions } = useLiff();
  
  // Function to handle reset button click
  const handleReset = () => {
    if (confirm('This will reset all LINE permissions and require you to log in again. Continue?')) {
      resetPermissions();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      {/* Modal content */}
      <div className="bg-white rounded-2xl w-[90%] max-w-md max-h-[80vh] overflow-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-bold">Player Profile</h2>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Profile content */}
        <div className="p-4">
          {/* User info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-500" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">{userName || 'Player'}</h3>
              <p className="text-xs text-gray-500">ID: {lineUserId?.substring(0, 8)}...</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold">Score</span>
              </div>
              <p className="text-lg font-bold">{score}</p>
            </div>
            
            <div className="bg-gray-100 p-3 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold">Stamina</span>
              </div>
              <p className="text-lg font-bold">{stamina?.current || 0}/{stamina?.max || 20}</p>
            </div>
          </div>

          {/* Collection stats */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">COLLECTION</h4>
            <div className="bg-gray-100 p-3 rounded-xl">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">Characters</p>
                  <p className="font-bold">{characters?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm">Coupons</p>
                  <p className="font-bold">{coupons?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 space-y-3">
          <button 
            onClick={onClose}
            className="w-full py-2 bg-blue-500 text-white font-medium rounded-lg"
          >
            Close
          </button>
          
          {/* Reset Permissions Button */}
          <button 
            onClick={handleReset}
            className="w-full py-2 border border-red-500 text-red-500 font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-red-50"
          >
            <RefreshCw className="w-4 h-4" /> 
            Reset LINE Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
