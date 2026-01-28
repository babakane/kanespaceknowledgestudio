
import React from 'react';
import { ParticipantType } from '../types';

interface CharacterProps {
  type: ParticipantType;
  isActive: boolean;
  name: string;
  location: string;
}

const Character: React.FC<CharacterProps> = ({ type, isActive, name, location }) => {
  const getAvatarUrl = () => {
    switch (type) {
      case ParticipantType.PRESENTER:
        return 'https://picsum.photos/seed/alex/400/400';
      case ParticipantType.GUEST_A:
        return 'https://picsum.photos/seed/sato/400/400';
      case ParticipantType.GUEST_B:
        return 'https://picsum.photos/seed/muller/400/400';
      default:
        return 'https://picsum.photos/seed/unknown/400/400';
    }
  };

  const getPosClass = () => {
    switch (type) {
      case ParticipantType.PRESENTER:
        return 'order-2';
      case ParticipantType.GUEST_A:
        return 'order-1';
      case ParticipantType.GUEST_B:
        return 'order-3';
      default:
        return '';
    }
  };

  return (
    <div className={`flex flex-col items-center transition-all duration-700 ${isActive ? 'scale-110' : 'scale-90 opacity-40'} ${getPosClass()}`}>
      <div className={`relative p-1 rounded-full ${isActive ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-gray-700'}`}>
        <img 
          src={getAvatarUrl()} 
          alt={name} 
          className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-black"
        />
        {isActive && (
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse">
            LIVE
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <h3 className="font-orbitron text-sm md:text-lg font-bold text-white tracking-wider">{name}</h3>
        <p className="text-[10px] md:text-xs text-blue-400 font-semibold">{location}</p>
      </div>
    </div>
  );
};

export default Character;
