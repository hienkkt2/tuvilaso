import React, { useState, useMemo } from 'react';
import { Crown, Lock, Sparkles, Heart, Users, TrendingUp, Hand, Compass, CheckCircle2, AlertCircle } from 'lucide-react';
import { CompatibilityResult, MonthFortune, TuViLaSo, UserWallet } from '../types/horoscope';
import { calculateCompatibility, generate12MonthsFortune, PALMISTRY_FEATURES } from '../utils/vipEngine';

interface VipFeaturesSectionProps {
  wallet: UserWallet;
  onOpenUpgradeModal: () => void;
  currentLaSo: TuViLaSo | null;
}

export const VipFeaturesSection: React.FC<VipFeaturesSectionProps> = ({
  wallet,
  onOpenUpgradeModal,
  currentLaSo
}) => {
  const isVip = wallet.vipTier === 'cat-tuong' || wallet.vipTier === 'de-vuong';
  const isDeVuong = wallet.vipTier === 'de-vuong';

  // Sub tab in VIP features
  const [vipSubTab, setVipSubTab] = useState<'12-thang' | 'hop-tuoi' | 'chi-tay' | 'phong-thuy'>('12-thang');

  // --- 12 MONTHS STATE ---
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const monthsData: MonthFortune[] = useMemo(() => {
    const yearCanChi = currentLaSo?.canChiYear || 'Bính Ngọ 2026';
    const menh = currentLaSo?.menhNguHanh || 'Thiên Hà Thủy';
    const birthYear = currentLaSo?.solarDate.year || 1995;
    return generate12MonthsFortune(yearCanChi, menh, birthYear);
  }, [currentLaSo]);

  const activeMonthFortune = monthsData[selectedMonth - 1];

  // --- HỢP TUỔI 2 NGƯỜI STATE ---
  const [p1Name, setP1Name] = useState<string>(currentLaSo?.fullName || 'Nguyễn Văn An');
  const [p1Year, setP1Year] = useState<number>(currentLaSo?.solarDate.year || 1995);
  const [p1Gender, setP1Gender] = useState<'nam' | 'nu'>(currentLaSo?.gender || 'nam');

  const [p2Name, setP2Name] = useState<string>('Trần Thị Mai');
  const [p2Year, setP2Year] = useState<number>(1998);
  const [p2Gender, setP2Gender] = useState<'nam' | 'nu'>('nu');

  const [compatResult, setCompatResult] = useState<CompatibilityResult | null>(() => {
    return calculateCompatibility('Nguyễn Văn An', 1995, 'nam', 'Trần Thị Mai', 1998, 'nu');
  });

  const handleCalculateCompat = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateCompatibility(p1Name, p1Year, p1Gender, p2Name, p2Year, p2Gender);
    setCompatResult(result);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <section className="bg-gradient-to-b from-[#221626] to-[#140e18] border-2 border-yellow-500/50 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-500/30">
                <Crown className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black font-cinzel text-yellow-200 tracking-wide">
                    ĐẶC QUYỀN HỘI VIÊN CAO CẤP (VIP)
                  </h2>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border uppercase ${
                    isDeVuong
                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400'
                      : isVip
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                      : 'bg-stone-800 text-stone-400 border-stone-700'
                  }`}>
                    {isDeVuong ? '👑 VIP Đế Vương' : isVip ? '🌟 VIP Cát Tường' : 'Khóa (Bản Miễn Phí)'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-200/80 mt-1 font-serif-vi">
                  Kho tàng chiêm đoán nâng cao: Dự đoán 12 tháng, So kèo Bát tự hợp hôn, Soi tướng chỉ tay & Cải vận phong thủy.
                </p>
              </div>
            </div>
          </div>

          {!isVip && (
            <button
              type="button"
              onClick={onOpenUpgradeModal}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 hover:brightness-110 text-stone-950 shadow-xl shadow-yellow-500/20 transition flex items-center justify-center gap-2 self-start md:self-auto active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Nâng Cấp VIP Mở Khóa Ngay</span>
            </button>
          )}
        </div>

        {/* VIP Sub Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-amber-900/40">
          <button
            type="button"
            onClick={() => setVipSubTab('12-thang')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              vipSubTab === '12-thang'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-stone-950 shadow-md'
                : 'bg-[#120e16] text-amber-200/80 hover:bg-amber-950/60 border border-amber-900/30'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Vận Trình 12 Tháng</span>
          </button>

          <button
            type="button"
            onClick={() => setVipSubTab('hop-tuoi')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              vipSubTab === 'hop-tuoi'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-stone-950 shadow-md'
                : 'bg-[#120e16] text-amber-200/80 hover:bg-amber-950/60 border border-amber-900/30'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>So Kèo Bát Tự & Hợp Hôn</span>
          </button>

          <button
            type="button"
            onClick={() => setVipSubTab('chi-tay')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              vipSubTab === 'chi-tay'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-stone-950 shadow-md'
                : 'bg-[#120e16] text-amber-200/80 hover:bg-amber-950/60 border border-amber-900/30'
            }`}
          >
            <Hand className="w-4 h-4" />
            <span>Soi Tướng Chỉ Tay AI</span>
          </button>

          <button
            type="button"
            onClick={() => setVipSubTab('phong-thuy')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
              vipSubTab === 'phong-thuy'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-stone-950 shadow-md'
                : 'bg-[#120e16] text-amber-200/80 hover:bg-amber-950/60 border border-amber-900/30'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Phong Thủy Đổi Vận</span>
          </button>
        </div>
      </section>

      {/* --- SUB TAB 1: 12 THÁNG TRONG NĂM --- */}
      {vipSubTab === '12-thang' && (
        <div className="space-y-6 relative">
          {!isVip && (
            <div className="absolute inset-0 z-20 backdrop-blur-md bg-black/60 rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="p-4 rounded-full bg-yellow-500/20 border-2 border-yellow-400 text-yellow-300">
                <Lock className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h3 className="text-xl font-bold font-cinzel text-yellow-200">
                  Nội Dung Dành Riêng Cho Hội Viên VIP
                </h3>
                <p className="text-xs text-amber-200/80 font-serif-vi">
                  Khám phá toàn bộ diễn biến tài lộc, sự nghiệp, tình cảm của bạn trong suốt 12 tháng Âm lịch để nắm bắt thời cơ vàng và chủ động phòng ngừa vận hạn.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenUpgradeModal}
                className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-yellow-500 to-amber-500 hover:brightness-110 text-stone-950 shadow-xl"
              >
                Mở Khóa Toàn Bộ 12 Tháng Ngay (Từ 99 Vàng)
              </button>
            </div>
          )}

          {/* Month selector cards (1 -> 12) */}
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2">
            {monthsData.map((m) => (
              <button
                key={m.month}
                type="button"
                onClick={() => setSelectedMonth(m.month)}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-between min-h-[64px] ${
                  selectedMonth === m.month
                    ? 'border-yellow-400 bg-amber-950/60 shadow-md shadow-amber-500/20'
                    : 'border-amber-900/40 bg-[#120e16] hover:border-amber-600/50 text-stone-300'
                }`}
              >
                <span className="text-xs font-bold font-cinzel text-amber-200">
                  Tháng {m.month}
                </span>
                <span className="text-[10px] text-amber-400/80 font-mono">
                  {m.careerScore}đ
                </span>
              </button>
            ))}
          </div>

          {/* Selected Month Detail Card */}
          <div className="bg-gradient-to-b from-[#18131e] to-[#100c14] border-2 border-amber-600/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-900/30 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-cinzel">
                  {activeMonthFortune.canChi}
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-cinzel text-yellow-200 mt-0.5">
                  {activeMonthFortune.title}
                </h3>
              </div>

              {/* 3 Metric Bars */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-center">
                  <span className="text-[10px] text-amber-400/70 block">Công Danh</span>
                  <span className="text-base font-bold text-emerald-400">{activeMonthFortune.careerScore}%</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-amber-400/70 block">Tài Lộc</span>
                  <span className="text-base font-bold text-yellow-400">{activeMonthFortune.wealthScore}%</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-amber-400/70 block">Tình Cảm</span>
                  <span className="text-base font-bold text-rose-400">{activeMonthFortune.loveScore}%</span>
                </div>
              </div>
            </div>

            {/* Narrative Interpretation */}
            <div className="p-4 rounded-xl bg-[#0e0a12] border border-amber-900/40 text-sm font-serif-vi text-amber-100/90 leading-relaxed space-y-2">
              <strong className="text-amber-300 block font-cinzel">Khái Quát Vận Khí Tháng Này:</strong>
              <p>{activeMonthFortune.summary}</p>
            </div>

            {/* Good Events & Taboos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Sự Kiện Đắc Lợi & Nên Triển Khai</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-emerald-100/90 font-serif-vi">
                  {activeMonthFortune.goodEvents.map((evt, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{evt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 space-y-2">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Điều Cần Đề Phòng & Kiêng Cữ</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-rose-100/90 font-serif-vi">
                  {activeMonthFortune.taboos.map((taboo, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400 mt-0.5">•</span>
                      <span>{taboo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUB TAB 2: HỢP TUỔI 2 NGƯỜI (BÁT TỰ HỢP HÔN) --- */}
      {vipSubTab === 'hop-tuoi' && (
        <div className="space-y-6 relative">
          {!isVip && (
            <div className="absolute inset-0 z-20 backdrop-blur-md bg-black/60 rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="p-4 rounded-full bg-yellow-500/20 border-2 border-yellow-400 text-yellow-300">
                <Lock className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h3 className="text-xl font-bold font-cinzel text-yellow-200">
                  Tính Năng So Kèo Bát Tự & Hợp Hôn
                </h3>
                <p className="text-xs text-amber-200/80 font-serif-vi">
                  Chấm điểm tương sinh tương khắc giữa 2 người (vợ chồng, người yêu hoặc đối tác làm ăn) theo Cung Phi Bát Trạch, Can Chi và Ngũ Hành Nạp Âm.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenUpgradeModal}
                className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-yellow-500 to-amber-500 hover:brightness-110 text-stone-950 shadow-xl"
              >
                Nâng Cấp VIP Để So Kèo Bát Tự
              </button>
            </div>
          )}

          {/* Input Form for 2 Persons */}
          <div className="bg-[#120e16] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold font-cinzel text-amber-200">
              Nhập Thông Tin 2 Thân Chủ Để So Kèo
            </h3>

            <form onSubmit={handleCalculateCompat} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Person 1 */}
              <div className="p-4 rounded-xl bg-[#0c0a0f] border border-amber-800/40 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-cinzel">
                  Người Thứ Nhất
                </span>
                <div>
                  <label className="text-[11px] text-amber-300/80 font-medium block mb-1">Họ và Tên</label>
                  <input
                    type="text"
                    value={p1Name}
                    onChange={(e) => setP1Name(e.target.value)}
                    className="w-full bg-[#16121a] border border-amber-800/50 rounded-lg px-3 py-1.5 text-xs text-amber-200"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-amber-300/80 font-medium block mb-1">Năm Sinh</label>
                    <input
                      type="number"
                      value={p1Year}
                      onChange={(e) => setP1Year(Number(e.target.value))}
                      className="w-full bg-[#16121a] border border-amber-800/50 rounded-lg px-3 py-1.5 text-xs text-amber-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-amber-300/80 font-medium block mb-1">Giới Tính</label>
                    <select
                      value={p1Gender}
                      onChange={(e) => setP1Gender(e.target.value as any)}
                      className="w-full bg-[#16121a] border border-amber-800/50 rounded-lg px-3 py-1.5 text-xs text-amber-200"
                    >
                      <option value="nam">Nam</option>
                      <option value="nu">Nữ</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Person 2 */}
              <div className="p-4 rounded-xl bg-[#0c0a0f] border border-amber-800/40 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-cinzel">
                  Người Thứ Hai
                </span>
                <div>
                  <label className="text-[11px] text-amber-300/80 font-medium block mb-1">Họ và Tên</label>
                  <input
                    type="text"
                    value={p2Name}
                    onChange={(e) => setP2Name(e.target.value)}
                    className="w-full bg-[#16121a] border border-amber-800/50 rounded-lg px-3 py-1.5 text-xs text-amber-200"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-amber-300/80 font-medium block mb-1">Năm Sinh</label>
                    <input
                      type="number"
                      value={p2Year}
                      onChange={(e) => setP2Year(Number(e.target.value))}
                      className="w-full bg-[#16121a] border border-amber-800/50 rounded-lg px-3 py-1.5 text-xs text-amber-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-amber-300/80 font-medium block mb-1">Giới Tính</label>
                    <select
                      value={p2Gender}
                      onChange={(e) => setP2Gender(e.target.value as any)}
                      className="w-full bg-[#16121a] border border-amber-800/50 rounded-lg px-3 py-1.5 text-xs text-amber-200"
                    >
                      <option value="nu">Nữ</option>
                      <option value="nam">Nam</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-600 to-yellow-500 hover:brightness-110 text-stone-950 shadow-md"
                >
                  Bắt Đầu So Kèo Bát Tự
                </button>
              </div>
            </form>
          </div>

          {/* Result Card */}
          {compatResult && (
            <div className="bg-gradient-to-b from-[#1c1424] to-[#120e18] border-2 border-yellow-500/60 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-900/40 pb-5 text-center sm:text-left">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-cinzel">
                    KẾT QUẢ TƯƠNG HỢP BÁT TỰ
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black font-cinzel text-yellow-200 mt-1">
                    {compatResult.p1.name} ({compatResult.p1.canChi}) ❤️ {compatResult.p2.name} ({compatResult.p2.canChi})
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-full border-4 border-yellow-400 bg-amber-950/80 flex flex-col items-center justify-center font-bold font-cinzel shadow-lg shadow-yellow-500/20">
                    <span className="text-2xl text-yellow-300">{compatResult.score}</span>
                    <span className="text-[9px] text-amber-400">/ 100 ĐIỂM</span>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-serif-vi">
                <div className="p-4 rounded-xl bg-[#0c0a0f] border border-amber-900/30 space-y-1">
                  <strong className="text-amber-300 block font-cinzel">1. Cung Phi Bát Trạch:</strong>
                  <p className="text-amber-200/90">{compatResult.cungPhiMatch}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0c0a0f] border border-amber-900/30 space-y-1">
                  <strong className="text-amber-300 block font-cinzel">2. Ngũ Hành Nạp Âm:</strong>
                  <p className="text-amber-200/90">{compatResult.menhMatch}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0c0a0f] border border-amber-900/30 space-y-1">
                  <strong className="text-amber-300 block font-cinzel">3. Thiên Can & Địa Chi:</strong>
                  <p className="text-amber-200/90">{compatResult.canChiMatch}</p>
                </div>
              </div>

              {/* Remedy Advice */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-yellow-500/40 text-xs sm:text-sm font-serif-vi text-amber-100 leading-relaxed space-y-2">
                <strong className="text-yellow-300 block font-cinzel text-sm">
                  Lời Khuyên Phong Thủy & Phương Pháp Hóa Giải:
                </strong>
                <p>{compatResult.remedyAdvice}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SUB TAB 3: BÓI CHỈ TAY AI --- */}
      {vipSubTab === 'chi-tay' && (
        <div className="space-y-6 relative">
          {!isVip && (
            <div className="absolute inset-0 z-20 backdrop-blur-md bg-black/60 rounded-3xl flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="p-4 rounded-full bg-yellow-500/20 border-2 border-yellow-400 text-yellow-300">
                <Lock className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h3 className="text-xl font-bold font-cinzel text-yellow-200">
                  Nội Dung Soi Tướng Chỉ Tay VIP
                </h3>
                <p className="text-xs text-amber-200/80 font-serif-vi">
                  Giải mã 5 đường chỉ tay đại phú quý: Sinh Đạo, Trí Đạo, Tâm Đạo, Vân Mắt Phượng và Đường Thái Dương.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenUpgradeModal}
                className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-yellow-500 to-amber-500 hover:brightness-110 text-stone-950 shadow-xl"
              >
                Nâng Cấp VIP Mở Khóa Tướng Tay
              </button>
            </div>
          )}

          <div className="bg-[#120e16] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold font-cinzel text-amber-200">
                Giải Mã 5 Nét Tướng Tay Quý Nhân & Đại Phú Quý
              </h3>
              <p className="text-xs text-amber-300/70 font-serif-vi">
                Soi chiếu các đường nét bàn tay thuận để luận đoán thọ mệnh, phúc lộc và con đường danh vọng.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PALMISTRY_FEATURES.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-[#0c0a0f] border border-amber-800/40 rounded-xl p-4 shadow space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-amber-900/30 pb-2">
                      <span className="text-[10px] font-bold text-amber-400 font-cinzel uppercase">
                        NÉT TƯỚNG #{idx + 1}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-yellow-300 font-mono font-bold border border-yellow-500/40">
                        {feature.fortuneScore} điểm
                      </span>
                    </div>

                    <h4 className="text-sm font-bold font-cinzel text-yellow-200 mt-2">
                      {feature.name}
                    </h4>
                    <span className="text-xs font-semibold text-emerald-400 block mt-0.5">
                      ✓ {feature.sign}
                    </span>

                    <p className="text-xs text-amber-200/80 font-serif-vi mt-2 leading-relaxed">
                      {feature.meaning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SUB TAB 4: PHONG THỦY ĐỔI VẬN --- */}
      {vipSubTab === 'phong-thuy' && (
        <div className="bg-[#120e16] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold font-cinzel text-amber-200">
              Cẩm Nang Phong Thủy Hộ Mệnh & Kích Hoạt Tài Vị
            </h3>
            <p className="text-xs text-amber-300/70 font-serif-vi">
              Theo quy luật Ngũ hành tương sinh tương khắc cho bản mệnh {currentLaSo?.menhNguHanh || 'Thiên Hà Thủy'}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-serif-vi">
            <div className="p-4 rounded-xl bg-[#0c0a0f] border border-amber-900/30 space-y-1.5">
              <span className="text-2xl block">🎨</span>
              <strong className="text-amber-300 font-cinzel block text-sm">Màu Sắc Hợp Mệnh</strong>
              <p className="text-amber-200/80">• <strong>Tương sinh:</strong> Trắng, Xám, Ghi, Vàng kim (Hành Kim)</p>
              <p className="text-amber-200/80">• <strong>Hòa hợp:</strong> Đen, Xanh nước biển (Hành Thủy)</p>
              <p className="text-rose-400/80">• <strong>Kỵ khắc:</strong> Vàng đất, Nâu (Hành Thổ)</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0c0a0f] border border-amber-900/30 space-y-1.5">
              <span className="text-2xl block">🔢</span>
              <strong className="text-amber-300 font-cinzel block text-sm">Con Số May Mắn</strong>
              <p className="text-amber-200/80">• <strong>Số kích tài:</strong> 1, 6, 7 (Số tài vị)</p>
              <p className="text-amber-200/80">• <strong>Số bình an:</strong> 9 (Cát tinh hội tụ)</p>
              <p className="text-amber-400/80 font-italic mt-1">Dùng để chọn số điện thoại, số tầng nhà, biển số xe.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0c0a0f] border border-amber-900/30 space-y-1.5">
              <span className="text-2xl block">🧭</span>
              <strong className="text-amber-300 font-cinzel block text-sm">Hướng Bàn Làm Việc</strong>
              <p className="text-amber-200/80">• <strong>Hướng Sinh Khí:</strong> Đông Nam (Chiêu tài lộc)</p>
              <p className="text-amber-200/80">• <strong>Hướng Diên Niên:</strong> Chính Nam (Củng cố uy tín)</p>
              <p className="text-stone-400">Tránh ngồi quay lưng ra cửa sổ hoặc đối diện cửa ra vào.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0c0a0f] border border-amber-900/30 space-y-1.5">
              <span className="text-2xl block">💎</span>
              <strong className="text-amber-300 font-cinzel block text-sm">Vật Phẩm Hộ Thân</strong>
              <p className="text-amber-200/80">• <strong>Đá phong thủy:</strong> Thạch anh đen, Aquamarine, Thạch anh trắng</p>
              <p className="text-amber-200/80">• <strong>Linh vật:</strong> Tỳ Hưu ngọc, Thiềm Thừ ngậm tiền vàng</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
