import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onClick }) => {
  return (
    <div className="absolute bottom-24 right-5 z-40">
      <button
        onClick={onClick}
        aria-label="快速記帳"
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 text-white flex items-center justify-center shadow-fab hover:scale-105 active:scale-95 transition-all duration-200 group border-2 border-white/80"
      >
        <Plus className="w-7 h-7 stroke-[2.6] group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
};
