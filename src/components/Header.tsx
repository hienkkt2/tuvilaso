import React, { useState, useEffect } from 'react';
import { Compass, Calendar, Sparkles, BookOpen, MessageSquare, Clock, Bookmark, Crown, Wallet, PlusCircle } from 'lucide-react';
import { convertSolarToLunar, getCanChi } from '../utils/lunarCalendar';
import { UserWallet } from '../types/horoscope';

interface HeaderProps {
  activeTab: 'tu-vi' | 'xem-ngay' | 'boi-toan' | 'ai-master' | 'so-tay' | 'vip';
  setActiveTab: (tab: 'tu-vi' | 'xem-ngay' | 'boi-toan' | 'ai-master' | 'so-tay' | 'vip') => void;
  savedCount: number;
  wallet: UserWallet;
  onOpenUpgradeModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  wallet,
  onOpenUpgradeModal
}) => {
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const day = currentDateTime.getDate();
  const month = currentDateTime.getMonth() + 1;
  const year = currentDateTime.getFullYear();
  const hour = currentDateTime.getHours();

  const lunar = convertSolarToLunar(day, month, year);
  const canChi = getCanChi({ day, month, year }, lunar, hour);

  return (
    <header className="relative border-b border-amber-900/40 bg-gradient-to-b from-[#181210]/90 to-[#0e0c10]/95 backdrop-blur-md sticky top-0 z-50">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-800/80 to-amber-950 px-4 py-1 text-xs text-amber-200 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-amber-100">Thời gian hiện tại:</span>
            <span>{currentDateTime.toLocaleTimeString('vi-VN')}</span>
            <span className="text-amber-400/60">|</span>
            <span className="font-semibold text-amber-300">Dương lịch: {day}/{month}/{year}</span>
          </div>

          <div className="flex items-center gap-3 text-amber-200/90 font-serif-vi">
            <span>Âm lịch: <strong className="text-amber-300">{lunar.day}/{lunar.month}</strong> Năm <strong className="text-amber-300">{canChi.year}</strong></span>
            <span className="text-amber-400/60">•</span>
            <span>Ngày <strong>{canChi.day}</strong></span>
            <span className="text-amber-400/60">•</span>
            <span>Giờ <strong>{canChi.hour}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('tu-vi')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-400 p-[2px] shadow-lg shadow-amber-600/20 group-hover:shadow-amber-500/40 transition-all duration-300">
            <div className="w-full h-full rounded-full bg-[#130f14] flex items-center justify-center border border-amber-500/30">
              <span className="text-xl font-bold text-amber-300 tracking-wider">☯</span>
            </div>
            {/* Spinning decorative ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-amber-400/40 animate-[spin_20s_linear_infinite]"></div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-wide font-cinzel bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent">
                TỬ VI & VẠN SỰ LÀNH
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 font-medium">
                Kinh Điển
              </span>
            </div>
            <p className="text-xs text-amber-200/70 font-serif-vi italic mt-0.5">
              Tra Cứu Lịch Vạn Niên • Lập Lá Số Tử Vi Trọn Đời • Gieo Quẻ Bát Quái
            </p>
          </div>
        </div>

        {/* Navigation Tabs + VIP Action */}
        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setActiveTab('tu-vi')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'tu-vi'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-700/30 border border-amber-400/40'
                  : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-950/40 border border-transparent'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Tử Vi Trọn Đời</span>
            </button>

            <button
              onClick={() => setActiveTab('xem-ngay')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'xem-ngay'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-700/30 border border-amber-400/40'
                  : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-950/40 border border-transparent'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Ngày Giờ Tốt Xấu</span>
            </button>

            <button
              onClick={() => setActiveTab('boi-toan')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'boi-toan'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-700/30 border border-amber-400/40'
                  : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-950/40 border border-transparent'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Gieo Quẻ Bói Toán</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-master')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'ai-master'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-700/30 border border-amber-400/40'
                  : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-950/40 border border-transparent'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-amber-300" />
              <span>Hỏi Thầy Tử Vi AI</span>
            </button>

            {/* VIP Tab */}
            <button
              onClick={() => setActiveTab('vip')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all relative ${
                activeTab === 'vip'
                  ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-stone-950 shadow-lg shadow-yellow-500/20 border border-yellow-300'
                  : 'text-yellow-300 bg-amber-950/50 hover:bg-amber-900/60 border border-yellow-500/40'
              }`}
            >
              <Crown className="w-4 h-4 text-yellow-300" />
              <span>VIP Đế Vương</span>
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping absolute top-1 right-1"></span>
            </button>

            <button
              onClick={() => setActiveTab('so-tay')}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all relative ${
                activeTab === 'so-tay'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-700/30 border border-amber-400/40'
                  : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-950/40 border border-transparent'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-300" />
              <span>Sổ Tay</span>
              {savedCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Wallet & Top-up Button */}
          <div className="flex items-center gap-1.5 ml-1">
            <button
              type="button"
              onClick={onOpenUpgradeModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 hover:brightness-125 border border-yellow-500/50 text-xs font-mono font-bold text-yellow-300 shadow transition"
              title="Nhấp để Nạp Thêm Vàng hoặc Kích Hoạt VIP"
            >
              <Wallet className="w-3.5 h-3.5 text-yellow-400" />
              <span>{wallet.coins} Vàng</span>
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

