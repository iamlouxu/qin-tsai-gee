import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FFEBF1] flex justify-center items-start md:py-8 sm:px-4">
      {/* 430px Max Width Phone Container */}
      <main className="w-full max-w-[430px] min-h-screen md:min-h-[890px] md:max-h-[920px] bg-gradient-to-b from-[#FFF0F5] via-[#FFF5F8] to-[#FFF0F4] md:rounded-[44px] md:shadow-[0_25px_70px_rgba(244,63,94,0.22),0_0_0_12px_rgba(255,255,255,0.85)] relative flex flex-col overflow-hidden">
        {/* Dynamic Island / Status Bar Area */}
        <div className="w-full pt-3 pb-1 px-7 flex justify-between items-center text-xs font-semibold text-rose-950/60 select-none z-20">
          <span className="tracking-tight font-display text-sm text-rose-950 font-bold">9:41</span>
          <div className="flex items-center space-x-1.5 text-rose-900/70">
            <span className="w-3.5 h-2.5 rounded-sm border border-rose-900/60 inline-block relative after:content-[''] after:absolute after:right-[-2px] after:top-[2px] after:w-[1.5px] after:h-[3px] after:bg-rose-900/60 after:rounded-r-sm">
              <span className="absolute inset-[1px] bg-rose-500 rounded-[1px] w-2"></span>
            </span>
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-32 pt-1 no-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};
