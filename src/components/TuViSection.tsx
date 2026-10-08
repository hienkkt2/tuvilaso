import React, { useState } from 'react';
import { Compass, Sparkles, User, Calendar as CalendarIcon, Clock, ChevronRight, Bookmark, Printer, HelpCircle, Eye, Crown, Lock } from 'lucide-react';
import { Gender, SolarDate, TuViCung, TuViLaSo } from '../types/horoscope';
import { generateTuViLaSo } from '../utils/tuViEngine';

interface TuViSectionProps {
  currentLaSo: TuViLaSo | null;
  setCurrentLaSo: (laSo: TuViLaSo | null) => void;
  onConsultAi: (question: string, contextLaSo: TuViLaSo) => void;
  onSaveLaSo: (laSo: TuViLaSo) => void;
  isSaved: boolean;
  onOpenUpgradeModal?: () => void;
  onSelectVipTab?: () => void;
  isVip?: boolean;
}

// Bố cục Bàn Cờ 12 Cung Địa Bàn:
// Hàng 1 (trên cùng): Tỵ (5), Ngọ (6), Mùi (7), Thân (8)
// Hàng 2: Thìn (4) ở trái | [THIÊN BÀN TÂM] | Dậu (9) ở phải
// Hàng 3: Mão (3) ở trái | [THIÊN BÀN TÂM] | Tuất (10) ở phải
// Hàng 4 (dưới cùng): Dần (2), Sửu (1), Tý (0), Hợi (11)
const COURT_GRID_ORDER = [
  [5, 6, 7, 8],
  [4, -1, -1, 9],
  [3, -1, -1, 10],
  [2, 1, 0, 11]
];

export const TuViSection: React.FC<TuViSectionProps> = ({
  currentLaSo,
  setCurrentLaSo,
  onConsultAi,
  onSaveLaSo,
  isSaved,
  onOpenUpgradeModal,
  onSelectVipTab,
  isVip = false
}) => {
  // Form states
  const [fullName, setFullName] = useState(currentLaSo?.fullName || 'Nguyễn Văn An');
  const [gender, setGender] = useState<Gender>(currentLaSo?.gender || 'nam');
  const [day, setDay] = useState(currentLaSo?.solarDate.day || 15);
  const [month, setMonth] = useState(currentLaSo?.solarDate.month || 8);
  const [year, setYear] = useState(currentLaSo?.solarDate.year || 1995);
  const [hour, setHour] = useState(currentLaSo?.birthHour || 6);
  const [minute, setMinute] = useState(currentLaSo?.birthMinute || 30);

  // Selected Court for detail inspection
  const [selectedCourt, setSelectedCourt] = useState<TuViCung | null>(null);

  // Active reading tab
  const [activeReadingTab, setActiveReadingTab] = useState<'menh' | 'cong-danh' | 'tai-loc' | 'hon-nhan' | 'suc-khoe' | 'dai-van' | 'loi-khuyen' | '12-thang'>('menh');

  // Handle Form Submit
  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const laSo = generateTuViLaSo({
      fullName: fullName.trim() || 'Thân Chủ',
      gender,
      solarDate: { day, month, year },
      birthHour: hour,
      birthMinute: minute
    });
    setCurrentLaSo(laSo);
    // Default select Cung Mệnh
    const menhCung = laSo.cungs.find(c => c.name === 'Mệnh') || laSo.cungs[0];
    setSelectedCourt(menhCung);
  };

  // Quick preset sample profiles
  const applyPreset = (presetName: string, g: Gender, d: number, m: number, y: number, h: number) => {
    setFullName(presetName);
    setGender(g);
    setDay(d);
    setMonth(m);
    setYear(y);
    setHour(h);
    setMinute(15);
    const laSo = generateTuViLaSo({
      fullName: presetName,
      gender: g,
      solarDate: { day: d, month: m, year: y },
      birthHour: h,
      birthMinute: 15
    });
    setCurrentLaSo(laSo);
    const menhCung = laSo.cungs.find(c => c.name === 'Mệnh') || laSo.cungs[0];
    setSelectedCourt(menhCung);
  };

  // Color mapping for stars according to Five Elements (Ngũ Hành)
  const getElementColor = (el: string) => {
    switch (el) {
      case 'Kim': return 'text-slate-200 border-slate-400/40 bg-slate-800/40';
      case 'Mộc': return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
      case 'Thủy': return 'text-sky-400 border-sky-500/40 bg-sky-950/40';
      case 'Hỏa': return 'text-rose-400 border-rose-500/40 bg-rose-950/40';
      case 'Thổ': return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
      default: return 'text-amber-300 border-amber-500/40 bg-amber-950/40';
    }
  };

  const getBrightnessBadge = (b?: string) => {
    switch (b) {
      case 'Miếu': return <span className="text-[10px] px-1 py-0.2 rounded bg-red-900/60 text-red-200 font-bold border border-red-500/30">M</span>;
      case 'Vượng': return <span className="text-[10px] px-1 py-0.2 rounded bg-amber-900/60 text-amber-200 font-bold border border-amber-500/30">V</span>;
      case 'Đắc': return <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-900/60 text-emerald-200 font-bold border border-emerald-500/30">Đ</span>;
      case 'Bình': return <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800/60 text-slate-300 font-medium border border-slate-600/30">B</span>;
      case 'Hãm': return <span className="text-[10px] px-1 py-0.2 rounded bg-stone-900 text-stone-400 border border-stone-700/30">H</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Form Banner */}
      <section className="bg-gradient-to-b from-[#18141c] to-[#120f16] border border-amber-900/40 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-amber-900/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Compass className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-200 tracking-wide">
                Lập Lá Số Tử Vi & Luận Giải Trọn Đời
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/70 mt-1 font-serif-vi">
              Nhập ngày giờ sinh để an sao 12 Cung, xác định Cục số, Mệnh Thân và giải đoán toàn diện tiền định & hậu vận.
            </p>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-amber-300/60 mr-1 font-medium">Mẫu nhanh:</span>
            <button
              type="button"
              onClick={() => applyPreset('Trần Hữu Nam (1990)', 'nam', 12, 5, 1990, 7)}
              className="text-xs px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/40 transition"
            >
              Canh Ngọ 1990
            </button>
            <button
              type="button"
              onClick={() => applyPreset('Lê Mai Hương (1995)', 'nu', 20, 10, 1995, 14)}
              className="text-xs px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/40 transition"
            >
              Ất Hợi 1995
            </button>
            <button
              type="button"
              onClick={() => applyPreset('Nguyễn Đức Toàn (1998)', 'nam', 8, 3, 1998, 21)}
              className="text-xs px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/40 transition"
            >
              Mậu Dần 1998
            </button>
            <button
              type="button"
              onClick={() => applyPreset('Vũ Thuỳ Linh (2000)', 'nu', 15, 7, 2000, 9)}
              className="text-xs px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/40 transition"
            >
              Canh Thìn 2000
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Full Name */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-amber-300/80 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Họ và Tên</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn An"
              className="w-full bg-[#0d0b10] border border-amber-800/50 rounded-lg px-3.5 py-2 text-sm text-amber-100 placeholder-amber-400/30 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50"
              required
            />
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-amber-300/80">Giới Tính</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('nam')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition ${
                  gender === 'nam'
                    ? 'bg-amber-700/80 border-amber-400 text-white font-semibold shadow-sm'
                    : 'bg-[#0d0b10] border-amber-900/40 text-amber-300/70 hover:bg-amber-950/40'
                }`}
              >
                Nam (Dương)
              </button>
              <button
                type="button"
                onClick={() => setGender('nu')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition ${
                  gender === 'nu'
                    ? 'bg-amber-700/80 border-amber-400 text-white font-semibold shadow-sm'
                    : 'bg-[#0d0b10] border-amber-900/40 text-amber-300/70 hover:bg-amber-950/40'
                }`}
              >
                Nữ (Âm)
              </button>
            </div>
          </div>

          {/* Date of Birth (Day, Month, Year) */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-amber-300/80 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Ngày Sinh (Dương Lịch)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                min={1}
                max={31}
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="bg-[#0d0b10] border border-amber-800/50 rounded-lg px-2.5 py-2 text-sm text-center text-amber-100 focus:outline-none focus:border-amber-500"
                placeholder="Ngày"
                required
              />
              <input
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="bg-[#0d0b10] border border-amber-800/50 rounded-lg px-2.5 py-2 text-sm text-center text-amber-100 focus:outline-none focus:border-amber-500"
                placeholder="Tháng"
                required
              />
              <input
                type="number"
                min={1920}
                max={2035}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-[#0d0b10] border border-amber-800/50 rounded-lg px-2.5 py-2 text-sm text-center text-amber-100 focus:outline-none focus:border-amber-500"
                placeholder="Năm"
                required
              />
            </div>
          </div>

          {/* Birth Hour */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-amber-300/80 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Giờ Sinh (Giờ : Phút)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={0}
                max={23}
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="bg-[#0d0b10] border border-amber-800/50 rounded-lg px-2 py-2 text-sm text-center text-amber-100 focus:outline-none focus:border-amber-500"
                placeholder="Giờ"
                required
              />
              <input
                type="number"
                min={0}
                max={59}
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                className="bg-[#0d0b10] border border-amber-800/50 rounded-lg px-2 py-2 text-sm text-center text-amber-100 focus:outline-none focus:border-amber-500"
                placeholder="Phút"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="lg:col-span-6 flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-600/30 transition transform active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>An Sao Lập Lá Số & Luận Giải</span>
            </button>
          </div>
        </form>
      </section>

      {/* Main Horoscope View */}
      {currentLaSo && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141117] border border-amber-900/40 rounded-xl px-5 py-3.5">
            <div>
              <span className="text-xs text-amber-400/80 font-serif-vi">Đang xem lá số của:</span>
              <h3 className="text-lg font-bold text-amber-200 font-cinzel">
                {currentLaSo.fullName} ({currentLaSo.gender === 'nam' ? 'Nam Mạng' : 'Nữ Mạng'} - {currentLaSo.canChiYear})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onSelectVipTab) onSelectVipTab();
                  else if (onOpenUpgradeModal) onOpenUpgradeModal();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-yellow-500 to-amber-500 hover:brightness-110 text-stone-950 shadow-md shadow-yellow-500/20 transition"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Xem Vận Trình 12 Tháng (VIP)</span>
              </button>

              <button
                type="button"
                onClick={() => onSaveLaSo(currentLaSo)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  isSaved
                    ? 'bg-amber-900/60 border-amber-500/50 text-amber-200'
                    : 'bg-[#1e1922] hover:bg-amber-950/60 border-amber-800/40 text-amber-300'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Đã Lưu Vào Sổ' : 'Lưu Lá Số Này'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1e1922] hover:bg-amber-950/60 border border-amber-800/40 text-amber-300 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In / Xuất Bản</span>
              </button>

              <button
                type="button"
                onClick={() => onConsultAi('Xin Thầy xem chi tiết đại vận 10 năm tới và hướng xuất hành, chuyển việc của con', currentLaSo)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-800 to-amber-700 text-amber-100 border border-amber-500/40 hover:brightness-110 shadow-md shadow-red-950/40 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Hỏi Thầy Tử Vi AI</span>
              </button>
            </div>
          </div>

          {/* 12-Court Traditional Board (Bàn Cờ Tử Vi Đẩu Số 4x4) */}
          <section className="bg-[#0e0c10] border-2 border-amber-700/50 rounded-2xl p-2 sm:p-4 shadow-2xl relative">
            <div className="text-center mb-3">
              <h3 className="text-sm font-bold font-cinzel text-amber-300 tracking-wider">
                BÀN CỜ ĐỊA BÀN 12 CUNG TỬ VI ĐẨU SỐ
              </h3>
              <p className="text-[11px] text-amber-400/60 font-serif-vi">
                Nhấp chuột vào bất kỳ cung nào để xem giải nghĩa chi tiết các sao toạ thủ và tiểu hạn
              </p>
            </div>

            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {COURT_GRID_ORDER.map((row, rowIdx) => (
                <React.Fragment key={rowIdx}>
                  {row.map((courtChiIdx, colIdx) => {
                    // Center 2x2 area: Thiên Bàn Trung Cung
                    if (courtChiIdx === -1) {
                      // Only render center once (at row 1 col 1)
                      if (rowIdx === 1 && colIdx === 1) {
                        return (
                          <div
                            key="thien-ban-center"
                            className="col-span-2 row-span-2 bg-gradient-to-b from-[#1c1622] to-[#120f16] border-2 border-amber-600/40 rounded-xl p-3 sm:p-5 flex flex-col justify-between shadow-inner"
                          >
                            <div className="text-center pb-2 border-b border-amber-900/40">
                              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block font-cinzel">
                                THIÊN BÀN TỬ VI
                              </span>
                              <h4 className="text-base sm:text-xl font-black text-amber-200 font-cinzel mt-0.5">
                                {currentLaSo.fullName}
                              </h4>
                              <p className="text-xs text-amber-300/80 font-serif-vi mt-0.5">
                                {currentLaSo.amDuongMenh} • Mệnh {currentLaSo.menhNguHanh}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] sm:text-xs my-2 text-amber-200/90 font-serif-vi">
                              <div>
                                <span className="text-amber-400/60 block text-[10px]">Sinh Dương lịch:</span>
                                <strong>{currentLaSo.solarDate.day}/{currentLaSo.solarDate.month}/{currentLaSo.solarDate.year} ({currentLaSo.birthHour}h{currentLaSo.birthMinute}p)</strong>
                              </div>
                              <div>
                                <span className="text-amber-400/60 block text-[10px]">Sinh Âm lịch:</span>
                                <strong>Ngày {currentLaSo.lunarDate.day}/{currentLaSo.lunarDate.month} ({currentLaSo.birthHourChi})</strong>
                              </div>
                              <div>
                                <span className="text-amber-400/60 block text-[10px]">Năm - Tháng - Ngày - Giờ:</span>
                                <strong className="text-amber-300">{currentLaSo.canChiYear} • {currentLaSo.canChiMonth}</strong>
                              </div>
                              <div>
                                <span className="text-amber-400/60 block text-[10px]">Cục Số & Thân Cư:</span>
                                <strong className="text-amber-300">{currentLaSo.cuc} • {currentLaSo.thanCuCung}</strong>
                              </div>
                              <div>
                                <span className="text-amber-400/60 block text-[10px]">Chủ Mệnh:</span>
                                <span>{currentLaSo.chuMenh}</span>
                              </div>
                              <div>
                                <span className="text-amber-400/60 block text-[10px]">Chủ Thân:</span>
                                <span>{currentLaSo.chuThan}</span>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-amber-900/40 text-center">
                              <span className="text-[10px] text-amber-400/60 italic font-serif-vi">
                                "Đức năng thắng số • Vạn sự tùy tâm tích thiện"
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }

                    const court = currentLaSo.cungs[courtChiIdx];
                    const isSelected = selectedCourt?.chi === court.chi;
                    const isMenh = court.name === 'Mệnh';
                    const isQuan = court.name === 'Quan Lộc';
                    const isTai = court.name === 'Tài Bạch';

                    return (
                      <div
                        key={court.chi}
                        onClick={() => setSelectedCourt(court)}
                        className={`court-box border rounded-xl p-2 sm:p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-200 min-h-[140px] sm:min-h-[175px] select-none relative group ${
                          isSelected
                            ? 'border-amber-400 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400'
                            : 'border-amber-900/40 hover:border-amber-600/60'
                        } ${isMenh ? 'bg-amber-950/20' : ''}`}
                      >
                        {/* Court Header: Name, Court Chi & Can */}
                        <div className="flex items-start justify-between gap-1 border-b border-amber-900/30 pb-1">
                          <div>
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-xs sm:text-sm font-bold font-cinzel ${
                                  isMenh ? 'text-yellow-300' : isQuan || isTai ? 'text-amber-300' : 'text-amber-100'
                                }`}
                              >
                                {court.name}
                              </span>
                              {court.isThanCu && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-rose-900 text-rose-200 font-bold border border-rose-500/40">
                                  THÂN
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-amber-400/70 font-mono">
                              {court.can} {court.chi}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-amber-300/80 font-bold block">
                              Đ.Hạn {court.daiHan}
                            </span>
                            {court.tuanTriet && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-purple-900/80 text-purple-200 font-semibold border border-purple-500/40">
                                {court.tuanTriet}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stars in Court */}
                        <div className="my-1.5 space-y-1 overflow-hidden">
                          {/* Chinh Tinh */}
                          {court.chinhTinh.length > 0 ? (
                            <div className="space-y-0.5">
                              {court.chinhTinh.map((star) => (
                                <div key={star.name} className="flex items-center justify-between text-[11px] sm:text-xs">
                                  <span className={`font-bold ${getElementColor(star.element).split(' ')[0]}`}>
                                    {star.name}
                                  </span>
                                  {getBrightnessBadge(star.brightness)}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[10px] text-stone-500 italic">Vô Chính Diệu</div>
                          )}

                          {/* Cat Tinh & Hung Tinh Mini Chips */}
                          <div className="flex flex-wrap gap-0.5 pt-0.5">
                            {court.phuTinhCat.slice(0, 3).map((star) => (
                              <span
                                key={star.name}
                                className="text-[9px] px-1 rounded bg-amber-950/40 text-amber-300/90 border border-amber-800/30 truncate max-w-[75px]"
                              >
                                {star.name}
                              </span>
                            ))}
                            {court.phuTinhHung.slice(0, 2).map((star) => (
                              <span
                                key={star.name}
                                className="text-[9px] px-1 rounded bg-stone-900/70 text-stone-400 border border-stone-800 truncate max-w-[75px]"
                              >
                                {star.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Click footer hint */}
                        <div className="pt-1 border-t border-amber-900/20 flex items-center justify-between text-[9px] text-amber-500/50">
                          <span>Chi: {court.chi}</span>
                          <span className="opacity-0 group-hover:opacity-100 transition text-amber-300">Chi tiết →</span>
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </section>

          {/* Detailed Selected Court Modal / Drawer */}
          {selectedCourt && (
            <div className="bg-gradient-to-b from-[#18131d] to-[#120e16] border border-amber-800/50 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <h4 className="text-lg font-bold font-cinzel text-amber-200">
                    Chi Tiết Cung {selectedCourt.name} (Tọa tại {selectedCourt.can} {selectedCourt.chi})
                  </h4>
                  {selectedCourt.isThanCu && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-900/80 text-rose-200 font-bold border border-rose-500/50">
                      Cung Thân Cư
                    </span>
                  )}
                  <span className="text-xs text-amber-400/80 font-mono bg-amber-950/50 px-2 py-0.5 rounded border border-amber-900/40">
                    Đại Hạn 10 Năm Bắt Đầu Từ: {selectedCourt.daiHan} Tuổi
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onConsultAi(`Thầy hãy luận giải chi tiết Cung ${selectedCourt.name} của con, các sao tọa thủ và ảnh hưởng thực tế`, currentLaSo)}
                  className="text-xs text-amber-300 hover:text-amber-100 flex items-center gap-1 bg-amber-900/30 px-3 py-1 rounded-lg border border-amber-700/40 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Hỏi Thầy về Cung này</span>
                </button>
              </div>

              {/* Stars Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 14 Chinh Tinh */}
                <div className="bg-[#0e0c10] border border-amber-900/30 rounded-xl p-3.5 space-y-2">
                  <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-cinzel flex items-center justify-between">
                    <span>Chính Tinh Tọa Thủ</span>
                    <span className="text-[10px] text-amber-500 font-mono">{selectedCourt.chinhTinh.length} sao</span>
                  </h5>
                  {selectedCourt.chinhTinh.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCourt.chinhTinh.map((s) => (
                        <div key={s.name} className="p-2 rounded bg-amber-950/20 border border-amber-900/20 text-xs">
                          <div className="flex items-center justify-between font-bold">
                            <span className={getElementColor(s.element).split(' ')[0]}>{s.name}</span>
                            <span className="text-[10px] font-mono text-amber-400">Hành {s.element} • {s.brightness} Địa</span>
                          </div>
                          <p className="text-[11px] text-amber-200/70 mt-1 font-serif-vi">{s.meaning}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400 italic">
                      Cung Vô Chính Diệu (Không có chính tinh toạ thủ, lấy các sao từ cung đối xung chiếu sang để luận đoán).
                    </p>
                  )}
                </div>

                {/* Phu Tinh Cat */}
                <div className="bg-[#0e0c10] border border-amber-900/30 rounded-xl p-3.5 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-cinzel flex items-center justify-between">
                    <span>Cát Tinh & Quý Tinh</span>
                    <span className="text-[10px] text-emerald-500 font-mono">{selectedCourt.phuTinhCat.length} sao</span>
                  </h5>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {selectedCourt.phuTinhCat.map((s) => (
                      <div key={s.name} className="p-1.5 rounded bg-emerald-950/20 border border-emerald-900/30 text-xs">
                        <span className="font-bold text-emerald-300 block">{s.name}</span>
                        <span className="text-[10px] text-emerald-200/70 font-serif-vi">{s.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phu Tinh Hung */}
                <div className="bg-[#0e0c10] border border-amber-900/30 rounded-xl p-3.5 space-y-2">
                  <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider font-cinzel flex items-center justify-between">
                    <span>Hung Tinh & Sát Tinh</span>
                    <span className="text-[10px] text-rose-500 font-mono">{selectedCourt.phuTinhHung.length} sao</span>
                  </h5>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {selectedCourt.phuTinhHung.length > 0 ? (
                      selectedCourt.phuTinhHung.map((s) => (
                        <div key={s.name} className="p-1.5 rounded bg-rose-950/20 border border-rose-900/30 text-xs">
                          <span className="font-bold text-rose-300 block">{s.name}</span>
                          <span className="text-[10px] text-rose-200/70 font-serif-vi">{s.meaning}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-stone-400 italic">Không có hung sát tinh trực chiếu, cung vị êm đẹp bình an.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Court interpretation text */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs sm:text-sm font-serif-vi text-amber-200/90 leading-relaxed">
                <strong className="text-amber-300 block mb-1">Luận giải Cung {selectedCourt.name}:</strong>
                {selectedCourt.luanGiai}
              </div>
            </div>
          )}

          {/* Full Lifetime Horoscope Interpretations (Luận Giải Trọn Đời) */}
          <section className="bg-gradient-to-b from-[#18131d] to-[#120f16] border border-amber-800/40 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-900/40 pb-4">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider font-cinzel">
                  HUYỀN CƠ ĐẨU SỐ
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-100">
                  Toàn Tập Luận Giải Tử Vi Trọn Đời
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-300/80 font-serif-vi">
                  Theo trường phái Tử Vi Đẩu Số Kinh Điển
                </span>
              </div>
            </div>

            {/* Reading Category Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-amber-900/30 pb-3">
              {[
                { id: 'menh', label: '1. Bản Mệnh & Căn Cơ' },
                { id: 'cong-danh', label: '2. Quan Lộc & Sự Nghiệp' },
                { id: 'tai-loc', label: '3. Tài Bạch & Tiền Bạc' },
                { id: 'hon-nhan', label: '4. Phu Thê & Tình Duyên' },
                { id: 'suc-khoe', label: '5. Tật Ách & Thể Trạng' },
                { id: 'dai-van', label: '6. Các Mốc Đại Vận' },
                { id: 'loi-khuyen', label: '7. Lời Khuyên Cải Vận' },
                { id: '12-thang', label: '👑 8. Vận Trình 12 Tháng & Bát Tự (VIP)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveReadingTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeReadingTab === tab.id
                      ? tab.id === '12-thang'
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-stone-950 font-bold shadow-md shadow-yellow-500/30'
                        : 'bg-amber-600 text-stone-950 font-bold shadow-md shadow-amber-600/30'
                      : tab.id === '12-thang'
                      ? 'bg-amber-950/60 text-yellow-300 hover:bg-amber-900/60 border border-yellow-500/40 font-bold'
                      : 'bg-[#1e1922] text-amber-200/80 hover:bg-amber-900/40 hover:text-amber-100 border border-amber-900/30'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Reading Content */}
            <div className="p-4 sm:p-6 rounded-xl bg-[#0e0c10]/80 border border-amber-900/30 font-serif-vi text-amber-100/90 leading-relaxed text-sm sm:text-base space-y-4">
              {activeReadingTab === 'menh' && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-lg font-bold font-cinzel text-amber-300">
                    Tổng Quan Bản Mệnh, Khí Chất & Tư Chất
                  </h4>
                  <p className="whitespace-pre-line">{currentLaSo.luanGiaiTongQuat.tongQuanMenh}</p>
                  <p className="whitespace-pre-line pt-2 border-t border-amber-900/30">
                    <strong className="text-amber-300 block mb-1">Tính Cách & Phong Thái:</strong>
                    {currentLaSo.luanGiaiTongQuat.tinhCach}
                  </p>
                </div>
              )}

              {activeReadingTab === 'cong-danh' && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-lg font-bold font-cinzel text-amber-300">
                    Đường Công Danh, Sự Nghiệp & Vị Thế Xã Hội (Cung Quan Lộc)
                  </h4>
                  <p className="whitespace-pre-line">{currentLaSo.luanGiaiTongQuat.congDanhSuNghiep}</p>
                </div>
              )}

              {activeReadingTab === 'tai-loc' && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-lg font-bold font-cinzel text-amber-300">
                    Tài Lộc, Tiền Bạc & Khả Năng Tích Lũy Của Cải (Cung Tài Bạch)
                  </h4>
                  <p className="whitespace-pre-line">{currentLaSo.luanGiaiTongQuat.taiLocTienTai}</p>
                </div>
              )}

              {activeReadingTab === 'hon-nhan' && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-lg font-bold font-cinzel text-amber-300">
                    Tình Duyên, Nhân Duyên Hôn Phối & Gia Đạo (Cung Phu Thê)
                  </h4>
                  <p className="whitespace-pre-line">{currentLaSo.luanGiaiTongQuat.tinhDuyenGiaDao}</p>
                </div>
              )}

              {activeReadingTab === 'suc-khoe' && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-lg font-bold font-cinzel text-amber-300">
                    Sức Khỏe, Thể Trạng & Phương Pháp Hóa Giải Bệnh Tật (Cung Tật Ách)
                  </h4>
                  <p className="whitespace-pre-line">{currentLaSo.luanGiaiTongQuat.sucKhoeBaoVe}</p>
                </div>
              )}

              {activeReadingTab === 'dai-van' && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-lg font-bold font-cinzel text-amber-300">
                    Diễn Biến Các Mốc Đại Vận 10 Năm Cuộc Đời
                  </h4>
                  <p className="whitespace-pre-line">{currentLaSo.luanGiaiTongQuat.daiVanDacBiet}</p>
                </div>
              )}

              {activeReadingTab === 'loi-khuyen' && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-lg font-bold font-cinzel text-amber-300">
                    Lời Khuyên Tu Dưỡng & Phương Pháp Cải Biến Vận Mệnh
                  </h4>
                  <p className="whitespace-pre-line">{currentLaSo.luanGiaiTongQuat.loiKhuyenHanhSu}</p>
                </div>
              )}

              {activeReadingTab === '12-thang' && (
                <div className="space-y-4 animate-fadeIn p-4 rounded-xl bg-gradient-to-b from-[#1c1424] to-[#120e18] border-2 border-yellow-500/50">
                  <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <h4 className="text-lg font-bold font-cinzel text-yellow-200">
                        Vận Trình Chi Tiết 12 Tháng Trong Năm (Đặc Quyền VIP)
                      </h4>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-400">
                      Bản Quyền Hoàng Gia
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-amber-200/90 font-serif-vi">
                    Dự đoán toàn diện thiên thời, địa lợi, cơ hội tài chính và các cạm bẫy cần tránh cho từng tháng Âm lịch của năm hiện tại, kết hợp thuật toán Bát Trạch và Phi Tinh Tử Vi.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectVipTab) onSelectVipTab();
                        else if (onOpenUpgradeModal) onOpenUpgradeModal();
                      }}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 hover:brightness-110 text-stone-950 shadow-lg shadow-yellow-500/30 transition flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isVip ? 'Xem Đầy Đủ 12 Tháng Tại Phân Hệ VIP' : 'Mở Khóa Toàn Bộ 12 Tháng & VIP Ngay'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
