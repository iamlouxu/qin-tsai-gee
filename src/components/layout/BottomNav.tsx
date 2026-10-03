import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, PieChart, Target, Settings, Plus } from 'lucide-react';

export type NavTab = 'home' | 'analytics' | 'goals' | 'settings';

export interface NavTabItem {
  id: NavTab;
  path: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}

interface BottomNavProps {
  onAddClick?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onAddClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const leftTabs: NavTabItem[] = [
    { id: 'home', path: '/', label: '總覽', icon: Home },
    { id: 'analytics', path: '/analytics', label: '統計', icon: PieChart },
  ];

  const rightTabs: NavTabItem[] = [
    { id: 'goals', path: '/goals', label: '目標', icon: Target },
    { id: 'settings', path: '/settings', label: '設定', icon: Settings },
  ];

  const renderTab = (tab: NavTabItem) => {
    const Icon = tab.icon;
    const isActive =
      tab.path === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(tab.path);

    return (
      <button
        key={tab.id}
        onClick={() => navigate(tab.path)}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 min-w-[48px] relative ${
          isActive
            ? 'text-rose-600 font-bold'
            : 'text-slate-400 hover:text-rose-400 font-medium'
        }`}
      >
        {isActive && (
          <span className="absolute inset-0 bg-rose-50 rounded-2xl -z-10 scale-95 border border-rose-100" />
        )}
        <Icon
          className={`w-5 h-5 transition-transform duration-200 ${
            isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
          }`}
        />
        <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
      </button>
    );
  };

  return (
    <div className="absolute bottom-5 left-5 right-5 z-30 pointer-events-auto">
      <nav className="glass-nav rounded-3xl py-1.5 px-3 flex justify-around items-center shadow-soft-pink border border-white/90">
        {leftTabs.map(renderTab)}

        {/* Center Prominent Add Button in Project Pink */}
        <button
          onClick={onAddClick}
          aria-label="快速記帳"
          className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white flex items-center justify-center shadow-[0_6px_20px_rgba(244,63,94,0.4)] active:scale-90 transition-all duration-150 mx-1 border border-white/50 shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.8]" />
        </button>

        {rightTabs.map(renderTab)}
      </nav>
    </div>
  );
};


