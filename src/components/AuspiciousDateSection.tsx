import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Star, Compass, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Search, Sparkles, Filter } from 'lucide-react';
import { SolarDate } from '../types/horoscope';
import { getDayAuspiciousDetail } from '../utils/lunarCalendar';

interface AuspiciousDateSectionProps {
  onConsultAiWithDate?: (prompt: string) => void;
}

export const AuspiciousDateSection: React.FC<AuspiciousDateSectionProps> = ({ onConsultAiWithDate }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<SolarDate>({
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear()
  });

  // Filter mode for "Tìm Ngày Tốt"
  const [filterPurpose, setFilterPurpose] = useState<string>('cưới hỏi');
  const [filterBirthYear, setFilterBirthYear] = useState<number>(1995);
  const [filterMonth, setFilterMonth] = useState<number>(today.getMonth() + 1);
  const [filterYear, setFilterYear] = useState<number>(today.getFullYear());
  const [showSmartFinder, setShowSmartFinder] = useState<boolean>(false);

  // Compute detailed auspicious day info
  const dayInfo = useMemo(() => {
    return getDayAuspiciousDetail(selectedDate);
  }, [selectedDate]);

  // Navigate days
  const changeDay = (offset: number) => {
    const cur = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
    cur.setDate(cur.getDate() + offset);
    setSelectedDate({
      day: cur.getDate(),
      month: cur.getMonth() + 1,
      year: cur.getFullYear()
    });
  };

  const setPresetDay = (type: 'today' | 'tomorrow' | 'dayAfter') => {
    const d = new Date();
    if (type === 'tomorrow') d.setDate(d.getDate() + 1);
    if (type === 'dayAfter') d.setDate(d.getDate() + 2);
    setSelectedDate({
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear()
    });
  };

  // Smart scan for top auspicious days in selected month
  const topAuspiciousDays = useMemo(() => {
    const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();
    const results = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const info = getDayAuspiciousDetail({ day: d, month: filterMonth, year: filterYear });
      // Score bonus based on purpose:
      let suitableForPurpose = false;
      if (filterPurpose === 'cưới hỏi' && (info.truc.name === 'Trực Định' || info.truc.name === 'Trực Thành' || info.lucDieu.name === 'Đại An')) {
        suitableForPurpose = true;
      } else if (filterPurpose === 'khai trương' && (info.truc.name === 'Trực Khai' || info.truc.name === 'Trực Mãn' || info.lucDieu.name === 'Tốc Hỷ')) {
        suitableForPurpose = true;
      } else if (filterPurpose === 'động thổ' && (info.truc.name === 'Trực Khai' || info.truc.name === 'Trực Thành')) {
        suitableForPurpose = true;
      } else if (filterPurpose === 'xuất hành' && (info.lucDieu.name === 'Tốc Hỷ' || info.lucDieu.name === 'Đại An')) {
        suitableForPurpose = true;
      } else if (info.isHoangDaoDay) {
        suitableForPurpose = true;
      }

      if (info.isHoangDaoDay && suitableForPurpose) {
        results.push(info);
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [filterPurpose, filterBirthYear, filterMonth, filterYear]);

  // Day of week name in Vietnamese
  const getDayOfWeekName = (solar: SolarDate) => {
    const d = new Date(solar.year, solar.month - 1, solar.day);
    const dayIndex = d.getDay();
    const names = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return names[dayIndex];
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Quick Date Selector */}
      <section className="bg-gradient-to-b from-[#18131d] to-[#120f16] border border-amber-900/40 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-amber-900/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Calendar className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-200 tracking-wide">
                Tra Cứu Lịch Vạn Niên & Xem Ngày Giờ Hoàng Đạo
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/70 mt-1 font-serif-vi">
              Xem chi tiết Hoàng Đạo / Hắc Đạo, Lục Diệu, Thập Nhị Kiến Trừ, 28 Tú, 12 Giờ tốt xấu và Hướng xuất hành.
            </p>
          </div>

          {/* Quick jumps & date picker */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPresetDay('today')}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/40 font-medium transition"
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={() => setPresetDay('tomorrow')}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/40 font-medium transition"
            >
              Ngày mai
            </button>
            <button
              type="button"
              onClick={() => setPresetDay('dayAfter')}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/40 font-medium transition"
            >
              Ngày mốt
            </button>

            <button
              type="button"
              onClick={() => setShowSmartFinder(!showSmartFinder)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                showSmartFinder
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-gradient-to-r from-red-900/80 to-amber-900/80 text-amber-200 border border-amber-600/40 hover:brightness-110'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{showSmartFinder ? 'Đóng Bộ Lọc' : 'Tìm Ngày Đẹp Theo Tuổi'}</span>
            </button>
          </div>
        </div>

        {/* Date Navigation Strip */}
        <div className="flex items-center justify-between gap-4 mt-4 pt-2">
          <button
            type="button"
            onClick={() => changeDay(-1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0e0c10] hover:bg-amber-950/40 border border-amber-800/30 text-amber-300 text-xs font-semibold transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Ngày Trước</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-400 font-serif-vi">Chọn ngày:</span>
            <input
              type="date"
              value={`${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`}
              onChange={(e) => {
                if (e.target.value) {
                  const [y, m, d] = e.target.value.split('-').map(Number);
                  setSelectedDate({ day: d, month: m, year: y });
                }
              }}
              className="bg-[#0e0c10] border border-amber-700/50 rounded-lg px-3 py-1.5 text-xs text-amber-200 font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="button"
            onClick={() => changeDay(1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0e0c10] hover:bg-amber-950/40 border border-amber-800/30 text-amber-300 text-xs font-semibold transition"
          >
            <span>Ngày Kế</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Smart Finder Drawer (When open) */}
      {showSmartFinder && (
        <section className="bg-gradient-to-b from-[#1c1424] to-[#140e1a] border-2 border-amber-600/50 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold font-cinzel text-amber-200">
                Bộ Lọc Tìm Ngày Đại Cát Cho Công Việc Trọng Đại
              </h3>
            </div>
            <span className="text-xs text-amber-400/80 font-serif-vi">
              Tự động đối chiếu Can Chi, Trực, Lục Diệu và Tuổi gia chủ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-amber-300/80 font-medium block mb-1">Mục Đích Công Việc</label>
              <select
                value={filterPurpose}
                onChange={(e) => setFilterPurpose(e.target.value)}
                className="w-full bg-[#0d0b10] border border-amber-800/50 rounded-lg px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
              >
                <option value="cưới hỏi">Cưới Hỏi / Đính Hôn</option>
                <option value="khai trương">Khai Trương / Mở Cửa Hàng</option>
                <option value="động thổ">Động Thổ / Xây Cất Nhà</option>
                <option value="nhập trạch">Nhập Trạch / Về Nhà Mới</option>
                <option value="xuất hành">Xuất Hành / Đi Xa Cầu Tài</option>
                <option value="ký hợp đồng">Ký Hợp Đồng / Đầu Tư Lớn</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-amber-300/80 font-medium block mb-1">Năm Sinh Gia Chủ</label>
              <input
                type="number"
                min={1940}
                max={2025}
                value={filterBirthYear}
                onChange={(e) => setFilterBirthYear(Number(e.target.value))}
                className="w-full bg-[#0d0b10] border border-amber-800/50 rounded-lg px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
                placeholder="Ví dụ: 1995"
              />
            </div>

            <div>
              <label className="text-xs text-amber-300/80 font-medium block mb-1">Tháng Cần Tìm</label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(Number(e.target.value))}
                className="w-full bg-[#0d0b10] border border-amber-800/50 rounded-lg px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-amber-300/80 font-medium block mb-1">Năm</label>
              <input
                type="number"
                min={2024}
                max={2035}
                value={filterYear}
                onChange={(e) => setFilterYear(Number(e.target.value))}
                className="w-full bg-[#0d0b10] border border-amber-800/50 rounded-lg px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Results of Top Days */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-cinzel">
              Top 5 Ngày Đẹp Nhất Trong Tháng {filterMonth}/{filterYear} Cho "{filterPurpose.toUpperCase()}":
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {topAuspiciousDays.map((item) => (
                <div
                  key={`${item.solar.day}-${item.solar.month}`}
                  onClick={() => setSelectedDate(item.solar)}
                  className="bg-[#0e0c10] border border-amber-700/40 hover:border-amber-400 rounded-xl p-3 cursor-pointer transition shadow hover:shadow-amber-500/20 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-amber-200">
                      {item.solar.day}/{item.solar.month}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-700/40">
                      {item.score} điểm
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-400 font-serif-vi">
                    Âm: {item.lunar.day}/{item.lunar.month} ({item.canChi.dayCanChi})
                  </div>
                  <div className="text-[10px] text-amber-200/70 truncate">
                    {item.truc.name} • {item.lucDieu.name}
                  </div>
                  <div className="text-[10px] text-amber-500/80 font-medium text-right pt-1 border-t border-amber-900/30">
                    Bấm để xem chi tiết →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Traditional Wall Calendar (Tear-off Block Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tear-off Calendar Block Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#221814] via-[#1a1216] to-[#120e14] border-2 border-amber-600/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-red-800 via-amber-600 to-red-800"></div>

          {/* Block Header */}
          <div className="text-center pt-2">
            <span className="text-xs font-bold tracking-widest text-amber-400/90 font-cinzel block uppercase">
              {getDayOfWeekName(selectedDate)}
            </span>
            <span className="text-xs text-amber-300/70 font-mono">
              Tháng {selectedDate.month} Năm {selectedDate.year}
            </span>
          </div>

          {/* Huge Solar Date Display */}
          <div className="my-6 text-center">
            <span className="text-7xl sm:text-8xl font-black font-cinzel text-amber-100 tracking-tighter drop-shadow-lg block">
              {selectedDate.day}
            </span>

            {/* Verdict Badge */}
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-md font-bold text-xs tracking-wide uppercase transition">
              {dayInfo.isHoangDaoDay ? (
                <div className="bg-amber-500/20 border-amber-400 text-amber-300 flex items-center gap-1.5 px-3 py-1 rounded-full border">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>NGÀY HOÀNG ĐẠO ({dayInfo.verdict})</span>
                </div>
              ) : (
                <div className="bg-stone-900/80 border-stone-600 text-stone-300 flex items-center gap-1.5 px-3 py-1 rounded-full border">
                  <AlertTriangle className="w-4 h-4 text-stone-400" />
                  <span>NGÀY HẮC ĐẠO ({dayInfo.verdict})</span>
                </div>
              )}
            </div>
          </div>

          {/* Lunar Date Tear-off Lower Card */}
          <div className="bg-[#0e0c10]/90 border border-amber-700/40 rounded-2xl p-4 text-center space-y-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block font-cinzel">
              LỊCH ÂM HÔM NAY
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-black font-cinzel text-yellow-300">
                Ngày {dayInfo.lunar.day}
              </span>
              <span className="text-sm text-amber-200/80 font-serif-vi">
                Tháng {dayInfo.lunar.month} (Năm {dayInfo.canChi.yearCanChi})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-amber-900/40 text-amber-200/90 font-serif-vi">
              <div>
                <span className="text-amber-400/60 block text-[10px]">Can Chi Ngày:</span>
                <strong className="text-amber-300">{dayInfo.canChi.dayCanChi}</strong>
              </div>
              <div>
                <span className="text-amber-400/60 block text-[10px]">Tiết Khí:</span>
                <strong className="text-amber-300">{dayInfo.tietKhi}</strong>
              </div>
              <div>
                <span className="text-amber-400/60 block text-[10px]">Nạp Âm Ngày:</span>
                <span>{dayInfo.canChi.napAmDay}</span>
              </div>
              <div>
                <span className="text-amber-400/60 block text-[10px]">Lục Diệu:</span>
                <span className={dayInfo.lucDieu.isGood ? 'text-emerald-400 font-semibold' : 'text-stone-400'}>
                  {dayInfo.lucDieu.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 12 Hours & Detailed Rules */}
        <div className="lg:col-span-7 space-y-6">
          {/* 12 Giờ Hoàng Đạo / Hắc Đạo */}
          <div className="bg-[#141117] border border-amber-900/40 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold font-cinzel text-amber-200">
                  12 Giờ Trong Ngày ({dayInfo.canChi.dayCanChi})
                </h3>
              </div>
              <span className="text-xs text-amber-400/70 font-serif-vi">
                Vàng: Hoàng Đạo (Cát) • Xám: Hắc Đạo (Hung)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {dayInfo.gioHoangDao.map((item) => (
                <div
                  key={item.chi}
                  className={`p-2.5 rounded-xl border transition ${
                    item.isHoangDao
                      ? 'bg-amber-950/30 border-amber-600/50 text-amber-100 shadow-sm'
                      : 'bg-[#0e0c10] border-amber-900/20 text-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${item.isHoangDao ? 'text-amber-300' : 'text-stone-400'}`}>
                      Giờ {item.chi} ({item.timeRange})
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        item.isHoangDao
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-stone-900 text-stone-500 border border-stone-800'
                      }`}
                    >
                      {item.nature}
                    </span>
                  </div>
                  <span className="text-[10px] block font-mono text-amber-400/80 truncate">
                    {item.starName}
                  </span>
                  <span className="text-[10px] block text-stone-400/80 font-serif-vi truncate mt-0.5">
                    {item.goodFor}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Auspicious & Inauspicious Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Việc Nên Làm */}
            <div className="bg-[#120f15] border border-emerald-900/40 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Việc Nên Làm (Cát Sự)</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-100/80 font-serif-vi">
                {dayInfo.viecNenLam.map((act, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Việc Kiêng Cữ */}
            <div className="bg-[#120f15] border border-rose-900/40 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Việc Nên Kiêng (Hung Sự)</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-rose-100/80 font-serif-vi">
                {dayInfo.viecKiengCu.map((act, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Luc Dieu, Truc, Nhi Thap Bat Tu, Huong Xuat Hanh */}
          <div className="bg-[#141117] border border-amber-900/40 rounded-xl p-4 space-y-3 text-xs font-serif-vi text-amber-200/90">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-cinzel">
              Chi Tiết Sao & Hướng Xuất Hành
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg bg-[#0e0c10] border border-amber-900/30">
                <strong className="text-amber-300 block mb-0.5">
                  Lục Diệu: {dayInfo.lucDieu.name} ({dayInfo.lucDieu.isGood ? 'Cát' : 'Hung'})
                </strong>
                <p className="text-[11px] text-amber-200/70">{dayInfo.lucDieu.description}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0e0c10] border border-amber-900/30">
                <strong className="text-amber-300 block mb-0.5">
                  Thập Nhị Kiến Trừ: {dayInfo.truc.name} ({dayInfo.truc.nature})
                </strong>
                <p className="text-[11px] text-amber-200/70">{dayInfo.truc.description}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0e0c10] border border-amber-900/30">
                <strong className="text-amber-300 block mb-0.5">
                  Nhị Thập Bát Tú: {dayInfo.nhiThapBatTu.name} (Tướng tinh: {dayInfo.nhiThapBatTu.conVat})
                </strong>
                <p className="text-[11px] text-amber-200/70">{dayInfo.nhiThapBatTu.description}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0e0c10] border border-amber-900/30">
                <strong className="text-amber-300 block mb-0.5">Hướng Xuất Hành Cát Tường</strong>
                <p className="text-[11px] text-amber-200/70">
                  • <strong>Hỷ Thần:</strong> Hướng {dayInfo.huongXuatHanh.hyThan} (Đón tin mừng)<br />
                  • <strong>Tài Thần:</strong> Hướng {dayInfo.huongXuatHanh.taiThan} (Đón tài lộc)
                </p>
              </div>
            </div>

            {/* Tuổi xung khắc */}
            <div className="pt-2 border-t border-amber-900/30 flex items-center justify-between text-xs">
              <div className="text-amber-400">
                <strong>Tuổi Xung Khắc Hôm Nay:</strong> {dayInfo.tuoiXungKhac.join(' • ')}
              </div>

              {onConsultAiWithDate && (
                <button
                  type="button"
                  onClick={() => onConsultAiWithDate(`Xin Thầy xem chi tiết ngày ${selectedDate.day}/${selectedDate.month}/${selectedDate.year} (Ngày ${dayInfo.canChi.dayCanChi}) có tốt cho tôi không?`)}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-amber-900/40 hover:bg-amber-800/60 text-amber-300 text-xs font-semibold border border-amber-700/40 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hỏi Thầy về ngày này</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
