import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FFEBF1] flex justify-center items-start md:py-8 sm:px-4">
      {/* 430px Max Width Phone Container */}
      <main className="w-full max-w-[430px] min-h-screen md:min-h-[890px] md:max-h-[920px] bg-gradient-to-b from-[#FFF0F5] via-[#FFF5F8] to-[#FFF0F4] md:rounded-[40px] md:shadow-[0_20px_50px_rgba(244,63,94,0.12)] border-x md:border border-rose-100/50 relative flex flex-col overflow-hidden">
        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-32 pt-4 no-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};
