import React, { useState } from 'react';
import { ChevronDown, Heart, User, Sparkles, Check } from 'lucide-react';
import { Ledger } from '../../types';

interface LedgerSwitcherProps {
  ledgers: Ledger[];
  currentLedger: Ledger;
  onSelectLedger: (ledger: Ledger) => void;
}

export const LedgerSwitcher: React.FC<LedgerSwitcherProps> = ({
  ledgers,
  currentLedger,
  onSelectLedger,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-30 mb-4">
      <div className="flex items-center justify-between">
        {/* Ledger Selector Capsule */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-white/90 hover:bg-white border border-rose-200/80 py-1.5 px-3.5 rounded-full shadow-sm active:scale-95 transition-all duration-150 backdrop-blur-md"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-600">
            {currentLedger.type === 'shared' ? (
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            ) : (
              <User className="w-3.5 h-3.5 text-rose-600" />
            )}
          </span>
          <span className="text-sm font-bold text-rose-950 font-sans tracking-tight">
            {currentLedger.name}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-rose-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Member Avatar Pills / Greeting */}
        <div className="flex items-center space-x-1.5 bg-white/70 py-1 px-2.5 rounded-full border border-rose-100/60 shadow-xs">
          <div className="flex -space-x-1.5 overflow-hidden">
            {currentLedger.members.map((member) => (
              <img
                key={member.id}
                src={member.avatarUrl}
                alt={member.name}
                title={member.name}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
              />
            ))}
          </div>
          {currentLedger.type === 'shared' ? (
            <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-0.5">
              <Sparkles className="w-3 h-3 text-rose-500 fill-rose-400" />
              2人共編
            </span>
          ) : (
            <span className="text-[11px] font-medium text-slate-500">個人</span>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-11 left-0 w-64 bg-white/95 backdrop-blur-xl rounded-3xl p-2 shadow-card-hover border border-rose-100/90 z-30 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-[11px] font-medium text-rose-900/60 px-3 py-1.5">
              選擇切換帳本
            </div>
            {ledgers.map((ledger) => {
              const isSelected = ledger.id === currentLedger.id;
              return (
                <button
                  key={ledger.id}
                  onClick={() => {
                    onSelectLedger(ledger);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'bg-rose-50/90 text-rose-950 font-bold shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        ledger.type === 'shared'
                          ? 'bg-rose-500 text-white'
                          : 'bg-rose-100 text-rose-600'
                      }`}
                    >
                      {ledger.type === 'shared' ? (
                        <Heart className="w-4 h-4 fill-white" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <div className="text-sm font-bold leading-tight">{ledger.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        {ledger.type === 'shared' ? '伴侶共同記錄' : '個人專屬帳本'}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-rose-600 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
