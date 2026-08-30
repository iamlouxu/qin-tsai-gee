import React from 'react';
import { Home, PieChart, Target, Settings } from 'lucide-react';

export type NavTab = 'home' | 'analytics' | 'goals' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: '總覽', icon: Home },
    { id: 'analytics', label: '統計', icon: PieChart },
    { id: 'goals', label: '目標', icon: Target },
    { id: 'settings', label: '設定', icon: Settings },
  ];

  return (
    <div className="absolute bottom-5 left-5 right-5 z-30 pointer-events-auto">
      <nav className="glass-nav rounded-3xl py-2.5 px-3 flex justify-around items-center shadow-soft-pink border border-white/90">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 min-w-[56px] min-h-[46px] relative ${
                isActive
                  ? 'text-rose-600 font-bold'
                  : 'text-slate-400 hover:text-rose-400 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 bg-rose-50 rounded-2xl -z-10 scale-95 border border-rose-100" />
              )}
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
