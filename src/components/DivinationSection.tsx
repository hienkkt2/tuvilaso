import React, { useState } from 'react';
import { Sparkles, RefreshCw, BookOpen, Layers, HelpCircle, ArrowRight } from 'lucide-react';
import { BoiBaiItem, KinhDichQue, TheKieuItem } from '../types/horoscope';
import { BOI_BAI_DECK, gieoMotHao, GieoHaoResult, KINH_DICH_64, lookupQueFromHaos, THE_KIEU_LIST } from '../utils/divinationEngine';

interface DivinationSectionProps {
  onConsultAiWithQue: (queName: string, thoanTu: string, yNghia: string, question: string, type: 'dich' | 'kieu') => void;
  onSaveQue: (title: string, content: string) => void;
}

export const DivinationSection: React.FC<DivinationSectionProps> = ({ onConsultAiWithQue, onSaveQue }) => {
  const [activeTab, setActiveTab] = useState<'kinh-dich' | 'the-kieu' | 'boi-bai'>('kinh-dich');

  // --- KINH DỊCH STATES ---
  const [haos, setHaos] = useState<GieoHaoResult[]>([]);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [queResult, setQueResult] = useState<{
    queBan: KinhDichQue;
    queBien?: KinhDichQue;
    changingIndices: number[];
  } | null>(null);
  const [userQuestion, setUserQuestion] = useState<string>('Xin quẻ về công danh sự nghiệp và tài lộc năm nay');

  // Gieo một hào
  const handleGieoHao = () => {
    if (haos.length >= 6 || isFlipping) return;

    setIsFlipping(true);
    setTimeout(() => {
      const newHao = gieoMotHao(haos.length + 1);
      const updatedHaos = [...haos, newHao];
      setHaos(updatedHaos);
      setIsFlipping(false);

      if (updatedHaos.length === 6) {
        const result = lookupQueFromHaos(updatedHaos);
        setQueResult(result);
      }
    }, 600);
  };

  // Reset quẻ dịch
  const handleResetKinhDich = () => {
    setHaos([]);
    setQueResult(null);
  };

  // --- BÓI THẺ KIỀU STATES ---
  const [isDrawingKieu, setIsDrawingKieu] = useState<boolean>(false);
  const [currentTheKieu, setCurrentTheKieu] = useState<TheKieuItem | null>(null);
  const [kieuQuestion, setKieuQuestion] = useState<string>('Xin cơ duyên về tình cảm và gia đạo êm ấm');

  const handleDrawKieu = () => {
    setIsDrawingKieu(true);
    setCurrentTheKieu(null);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * THE_KIEU_LIST.length);
      setCurrentTheKieu(THE_KIEU_LIST[randomIndex]);
      setIsDrawingKieu(false);
    }, 800);
  };

  // --- BÓI BÀI STATES ---
  const [selectedCards, setSelectedCards] = useState<BoiBaiItem[]>([]);
  const [isShufflingCards, setIsShufflingCards] = useState<boolean>(false);

  const handleDrawCards = () => {
    setIsShufflingCards(true);
    setSelectedCards([]);
    setTimeout(() => {
      // Pick 3 unique cards
      const shuffled = [...BOI_BAI_DECK].sort(() => 0.5 - Math.random());
      const c1 = { ...shuffled[0], position: 'Quá Khứ' as const };
      const c2 = { ...shuffled[1], position: 'Hiện Tại' as const };
      const c3 = { ...shuffled[2], position: 'Tương Lai' as const };
      setSelectedCards([c1, c2, c3]);
      setIsShufflingCards(false);
    }, 700);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Navigation */}
      <section className="bg-gradient-to-b from-[#18131d] to-[#120f16] border border-amber-900/40 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-900/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-200 tracking-wide">
                Gieo Quẻ Bói Toán & Chiêm Nghiệm Thiên Cơ
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/70 mt-1 font-serif-vi">
              Vạn sự tùy duyên, tâm thành tất ứng. Chọn phương thức gieo quẻ để khai thông tâm trí trước khúc quanh cuộc đời.
            </p>
          </div>

          {/* Sub tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('kinh-dich')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'kinh-dich'
                  ? 'bg-amber-600 text-stone-950 shadow-md'
                  : 'bg-[#0e0c10] text-amber-300/80 hover:bg-amber-950/40 border border-amber-800/30'
              }`}
            >
              🪙 Quẻ Kinh Dịch 3 Đồng Xu
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('the-kieu')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'the-kieu'
                  ? 'bg-amber-600 text-stone-950 shadow-md'
                  : 'bg-[#0e0c10] text-amber-300/80 hover:bg-amber-950/40 border border-amber-800/30'
              }`}
            >
              📜 Bói Thẻ Kiều Linh Ứng
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('boi-bai')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'boi-bai'
                  ? 'bg-amber-600 text-stone-950 shadow-md'
                  : 'bg-[#0e0c10] text-amber-300/80 hover:bg-amber-950/40 border border-amber-800/30'
              }`}
            >
              🃏 Bói Bài Cát Hung (3 Lá)
            </button>
          </div>
        </div>
      </section>

      {/* --- TAB 1: KINH DỊCH 3 ĐỒNG XU --- */}
      {activeTab === 'kinh-dich' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Coin Tossing Platter */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#1e1713] to-[#120e14] border-2 border-amber-700/50 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-between space-y-6 text-center">
              <div className="w-full">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-cinzel block">
                  ĐĨA GIEO QUẺ BÁT QUÁI
                </span>
                <h3 className="text-base font-bold text-amber-200 font-cinzel mt-0.5">
                  Gieo 3 Đồng Xu Âm Dương (6 Lần)
                </h3>
                <p className="text-xs text-amber-300/70 font-serif-vi mt-1">
                  Đã gieo được: <strong className="text-amber-300 font-mono text-sm">{haos.length}/6</strong> Hào
                </p>
              </div>

              {/* Input Question */}
              <div className="w-full text-left space-y-1">
                <label className="text-[11px] font-semibold text-amber-300/80">Tâm nguyện / Câu hỏi khi gieo quẻ:</label>
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="Nhập việc bạn đang trăn trở..."
                  className="w-full bg-[#0d0b10] border border-amber-800/50 rounded-lg px-3 py-1.5 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 3 Coins Visual Area */}
              <div className="relative w-48 h-48 rounded-full border-4 border-amber-600/40 bg-gradient-to-tr from-[#151012] via-[#241a18] to-[#151012] flex items-center justify-center shadow-inner gold-glow">
                <div className="flex items-center justify-center gap-3">
                  {[0, 1, 2].map((idx) => {
                    const lastHao = haos[haos.length - 1];
                    const coinVal = lastHao ? lastHao.coins[idx] : 1;
                    const isYang = coinVal === 1;

                    return (
                      <div
                        key={idx}
                        className={`w-12 h-12 rounded-full border-2 border-yellow-500/70 bg-gradient-to-tr from-amber-700 via-amber-400 to-yellow-200 flex items-center justify-center text-stone-900 font-black shadow-md select-none transition-transform ${
                          isFlipping ? 'animate-coin' : ''
                        }`}
                      >
                        <div className="w-8 h-8 rounded-sm border border-stone-800/40 flex items-center justify-center text-[10px] font-serif">
                          {isYang ? 'Dương' : 'Âm'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full">
                <button
                  type="button"
                  disabled={haos.length >= 6 || isFlipping}
                  onClick={handleGieoHao}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition shadow-lg ${
                    haos.length >= 6
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 shadow-amber-600/30 active:scale-98'
                  }`}
                >
                  {isFlipping ? 'Đang Lắc Xu...' : haos.length >= 6 ? 'Đã Hoàn Tất 6 Hào' : `Gieo Hào Thứ ${haos.length + 1}`}
                </button>

                <button
                  type="button"
                  onClick={handleResetKinhDich}
                  className="p-2.5 rounded-xl bg-[#0e0c10] hover:bg-amber-950/40 border border-amber-800/40 text-amber-300 transition"
                  title="Gieo Lại Từ Đầu"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: The 6 Haos & Hexagram Result */}
            <div className="lg:col-span-7 bg-[#141117] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-6">
              <div>
                <h3 className="text-base font-bold font-cinzel text-amber-200">
                  Tiến Trình Xếp Hào (Từ Sơ Hào Lên Thượng Hào)
                </h3>
                <p className="text-xs text-amber-400/60 font-serif-vi mt-0.5">
                  Vạch liền: Hào Dương (—) • Vạch đứt: Hào Âm (-- --) • Đỏ: Hào Động
                </p>
              </div>

              {/* 6 Haos Visual (Stacking from bottom to top) */}
              <div className="space-y-2 bg-[#0e0c10] border border-amber-900/30 rounded-xl p-4">
                {[6, 5, 4, 3, 2, 1].map((step) => {
                  const hao = haos.find((h) => h.step === step);
                  return (
                    <div key={step} className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-amber-400/60 w-16">
                        Hào {step}:
                      </span>

                      {hao ? (
                        <div className="flex-1 flex items-center justify-between">
                          {hao.isYang ? (
                            /* Hào Dương: Vạch liền */
                            <div
                              className={`h-4 rounded flex-1 ${
                                hao.isChanging
                                  ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                                  : 'bg-amber-400'
                              }`}
                            ></div>
                          ) : (
                            /* Hào Âm: Vạch đứt */
                            <div className="flex items-center gap-2 flex-1">
                              <div
                                className={`h-4 rounded flex-1 ${
                                  hao.isChanging
                                    ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                                    : 'bg-amber-400'
                                }`}
                              ></div>
                              <div
                                className={`h-4 rounded flex-1 ${
                                  hao.isChanging
                                    ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                                    : 'bg-amber-400'
                                }`}
                              ></div>
                            </div>
                          )}

                          <span
                            className={`text-[10px] ml-3 font-semibold ${
                              hao.isChanging ? 'text-rose-400 font-bold' : 'text-amber-200/80'
                            }`}
                          >
                            {hao.haoType}
                          </span>
                        </div>
                      ) : (
                        <div className="flex-1 h-4 rounded border border-dashed border-stone-800 bg-stone-950/30"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Hexagram Reading Result Card */}
              {queResult && (
                <div className="bg-gradient-to-b from-[#1f1712] to-[#140e14] border-2 border-amber-500/60 rounded-xl p-5 shadow-2xl space-y-4 animate-fadeIn">
                  <div className="flex items-start justify-between border-b border-amber-900/40 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-cinzel">
                        KẾT QUẢ QUẺ BẢN
                      </span>
                      <h4 className="text-xl font-black font-cinzel text-amber-100 mt-0.5">
                        {queResult.queBan.name} ({queResult.queBan.hanTu})
                      </h4>
                      <p className="text-xs text-amber-300 font-serif-vi">
                        Thượng: {queResult.queBan.upperTrigram} • Hạ: {queResult.queBan.lowerTrigram}
                      </p>
                    </div>

                    <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                      {queResult.queBan.catHung}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm font-serif-vi text-amber-100/90 leading-relaxed">
                    <div>
                      <strong className="text-amber-300 block mb-0.5">Thoán Từ:</strong>
                      <p className="italic text-amber-200/80">{queResult.queBan.thoanTu}</p>
                    </div>

                    <div>
                      <strong className="text-amber-300 block mb-0.5">Ý Nghĩa Quẻ:</strong>
                      <p>{queResult.queBan.yNghia}</p>
                    </div>

                    <div>
                      <strong className="text-amber-300 block mb-0.5">Lời Khuyên Hành Sự:</strong>
                      <p>{queResult.queBan.loiKhuyen}</p>
                    </div>

                    {queResult.queBien && (
                      <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 mt-2">
                        <strong className="text-rose-300 block mb-0.5">
                          Quẻ Biến (Biến Đổi Tương Lai): {queResult.queBien.name}
                        </strong>
                        <p className="text-xs text-amber-200/80">{queResult.queBien.yNghia}</p>
                      </div>
                    )}
                  </div>

                  {/* Consult AI Action */}
                  <div className="pt-2 border-t border-amber-900/40 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSaveQue(`Quẻ ${queResult.queBan.name}`, `${queResult.queBan.yNghia}\nLời khuyên: ${queResult.queBan.loiKhuyen}`)}
                      className="text-xs text-amber-300 hover:text-amber-100 font-medium px-3 py-1.5 rounded-lg bg-[#0e0c10] border border-amber-800/40"
                    >
                      Lưu Quẻ Vào Sổ
                    </button>

                    <button
                      type="button"
                      onClick={() => onConsultAiWithQue(
                        queResult.queBan.name,
                        queResult.queBan.thoanTu,
                        queResult.queBan.yNghia,
                        userQuestion,
                        'dich'
                      )}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-800 to-amber-700 text-amber-100 border border-amber-500/40 shadow hover:brightness-110 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Nhờ AI Luận Giải Chi Tiết Cho Câu Hỏi Này</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: BÓI THẺ KIỀU --- */}
      {activeTab === 'the-kieu' && (
        <div className="bg-gradient-to-b from-[#1c1422] to-[#120e16] border border-amber-900/40 rounded-2xl p-6 sm:p-8 shadow-xl max-w-3xl mx-auto space-y-6 text-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-cinzel block">
              TRUYỆN KIỀU VẠN TỰ
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-200 mt-1">
              Rút Thẻ Xăm Bói Kiều Linh Ứng
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/70 font-serif-vi mt-1 max-w-lg mx-auto">
              Tĩnh tâm hít sâu 3 hơi, nhắm mắt thành tâm niệm điều mình đang trăn trở, rồi bấm "Lắc Ống Rút Thẻ".
            </p>
          </div>

          <div className="max-w-md mx-auto text-left space-y-1">
            <label className="text-xs text-amber-300/80 font-medium">Tâm sự / Câu hỏi muốn soi tỏ:</label>
            <input
              type="text"
              value={kieuQuestion}
              onChange={(e) => setKieuQuestion(e.target.value)}
              placeholder="Ví dụ: Tình cảm tương lai, công việc sắp tới..."
              className="w-full bg-[#0d0b10] border border-amber-800/50 rounded-lg px-3.5 py-2 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Bamboo Tube Graphic Button */}
          <div className="py-4">
            <button
              type="button"
              disabled={isDrawingKieu}
              onClick={handleDrawKieu}
              className={`px-8 py-3 rounded-2xl font-bold text-sm tracking-wide shadow-xl transition transform active:scale-95 ${
                isDrawingKieu
                  ? 'bg-amber-900/50 text-amber-300/50 cursor-wait'
                  : 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950 shadow-amber-600/30'
              }`}
            >
              {isDrawingKieu ? 'Đang Lắc Ống Thẻ Tre...' : '🎋 Lắc Ống Rút Thẻ Kiều'}
            </button>
          </div>

          {/* Drawn Card Result */}
          {currentTheKieu && (
            <div className="bg-[#0e0c10] border-2 border-amber-600/60 rounded-2xl p-6 sm:p-7 shadow-2xl text-left space-y-4 animate-fadeIn">
              <div className="text-center pb-3 border-b border-amber-900/30">
                <span className="text-xs font-bold text-amber-400 font-cinzel uppercase block">
                  {currentTheKieu.title}
                </span>
                <div className="my-3 space-y-1 text-base sm:text-lg font-serif-vi italic text-amber-100 font-semibold leading-relaxed">
                  {currentTheKieu.lines.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-serif-vi text-amber-200/90 leading-relaxed">
                <p>
                  <strong className="text-amber-300 block mb-0.5">Lời Luận Giải Cơ Duyên:</strong>
                  {currentTheKieu.meaning}
                </p>
                <p>
                  <strong className="text-amber-300 block mb-0.5">Lời Khuyên Xử Thế:</strong>
                  {currentTheKieu.advice}
                </p>
              </div>

              <div className="pt-3 border-t border-amber-900/30 flex justify-end">
                <button
                  type="button"
                  onClick={() => onConsultAiWithQue(
                    currentTheKieu.title,
                    currentTheKieu.lines.join(' '),
                    currentTheKieu.meaning,
                    kieuQuestion,
                    'kieu'
                  )}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-800 to-amber-700 text-amber-100 border border-amber-500/40 hover:brightness-110 shadow transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Hỏi Thầy Tử Vi AI Luận Bài Thơ Này</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: BÓI BÀI TÂY CÁT HUNG --- */}
      {activeTab === 'boi-bai' && (
        <div className="bg-gradient-to-b from-[#18131d] to-[#120f16] border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-900/30">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-cinzel block">
                TAM QUẺ VẬN THẾ
              </span>
              <h3 className="text-xl font-bold font-cinzel text-amber-200 mt-0.5">
                Bói Bài Cát Hung (Quá Khứ - Hiện Tại - Tương Lai)
              </h3>
            </div>

            <button
              type="button"
              disabled={isShufflingCards}
              onClick={handleDrawCards}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-700 text-stone-950 shadow-md shadow-amber-600/30 transition"
            >
              {isShufflingCards ? 'Đang Xáo Bài...' : '🃏 Trải Bài 3 Lá Vận Mệnh'}
            </button>
          </div>

          {selectedCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
              {selectedCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-[#0e0c10] border-2 border-amber-700/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-amber-400 transition"
                >
                  <div className="flex items-center justify-between border-b border-amber-900/30 pb-2">
                    <span className="text-xs font-bold text-amber-400 font-cinzel uppercase">
                      Lá Số {idx + 1}: {card.position}
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        card.color === 'red' ? 'text-rose-500' : 'text-stone-300'
                      }`}
                    >
                      {card.symbol}
                    </span>
                  </div>

                  <div className="text-center py-4 bg-[#161218] rounded-xl border border-amber-900/30">
                    <span
                      className={`text-3xl font-black block font-serif ${
                        card.color === 'red' ? 'text-rose-400' : 'text-stone-100'
                      }`}
                    >
                      {card.name}
                    </span>
                    <span className="text-xs text-amber-400/70 font-mono mt-1 block">
                      Nước {card.suit}
                    </span>
                  </div>

                  <div className="text-xs font-serif-vi text-amber-200/90 leading-relaxed">
                    <strong className="text-amber-300 block mb-1">Ý nghĩa ứng vận:</strong>
                    {card.meaning}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-stone-400 font-serif-vi text-sm space-y-2">
              <p>Chưa trải bài. Hãy bấm <strong>"Trải Bài 3 Lá Vận Mệnh"</strong> để chiêm nghiệm vận trình.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
