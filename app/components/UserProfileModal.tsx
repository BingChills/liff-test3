import React, { useContext } from 'react';
import { useLiff } from "../context/LiffContext";
import { X } from 'lucide-react';

interface UserProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isVisible, onClose }) => {
  const { user } = useLiff();

  if (!isVisible || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-[85%] max-w-sm rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
            <img
              src={user.profile_picture}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{user.username}</h3>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;