import React, { useEffect } from 'react';
import { IMAGES } from '../constants/images';

interface EggAnimationProps {
  isVisible: boolean;
  onAnimationEnd: () => void;
}

export function EggAnimation({ isVisible, onAnimationEnd }: EggAnimationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onAnimationEnd();
      }, 2000); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [isVisible, onAnimationEnd]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onAnimationEnd}
    >
      <div className="relative w-64 h-80">
        <div className="absolute inset-0 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-blue-500/20 to-transparent" />
          <img
            src={IMAGES.EGG_ANIMATION}
            alt="Mystery Egg"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute inset-0 animate-crack">
          <div className="absolute top-1/2 left-1/2 w-0.5 h-16 bg-white -translate-x-1/2 -translate-y-1/2 rotate-45 shadow-glow" />
          <div className="absolute top-1/2 left-1/2 w-0.5 h-16 bg-white -translate-x-1/2 -translate-y-1/2 -rotate-45 shadow-glow" />
        </div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 animate-sparkle">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `sparkle ${0.5 + Math.random()}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}