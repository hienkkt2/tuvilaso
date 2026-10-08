import React from 'react';
import { Bookmark, Trash2, Eye, Calendar, Sparkles, BookOpen } from 'lucide-react';
import { TuViLaSo } from '../types/horoscope';

export interface SavedQueItem {
  id: string;
  title: string;
  content: string;
  savedAt: string;
}

interface SavedChartsModalProps {
  savedCharts: TuViLaSo[];
  savedQues: SavedQueItem[];
  onSelectChart: (chart: TuViLaSo) => void;
  onDeleteChart: (id: string) => void;
  onDeleteQue: (id: string) => void;
}

export const SavedChartsModal: React.FC<SavedChartsModalProps> = ({
  savedCharts,
  savedQues,
  onSelectChart,
  onDeleteChart,
  onDeleteQue
}) => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#18131d] to-[#120f16] border border-amber-900/40 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Bookmark className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-200 tracking-wide">
              Sổ Tay Lưu Trữ Lá Số & Quẻ Dịch
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/70 mt-0.5 font-serif-vi">
              Lưu giữ các lá số tử vi và quẻ bói đã gieo để chiêm nghiệm, đối chiếu và tra cứu thuận tiện bất kỳ lúc nào.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: Saved Horoscope Natal Charts */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold font-cinzel text-amber-300 uppercase tracking-wider flex items-center gap-2">
          <span>📜 Danh Sách Lá Số Đã Lưu</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/40">
            {savedCharts.length} lá số
          </span>
        </h3>

        {savedCharts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedCharts.map((chart) => (
              <div
                key={chart.id}
                className="bg-[#120e16] border border-amber-800/40 rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-3 hover:border-amber-500/60 transition group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold font-cinzel text-amber-200">
                        {chart.fullName}
                      </h4>
                      <p className="text-xs text-amber-400 font-serif-vi">
                        {chart.gender === 'nam' ? 'Nam Mạng' : 'Nữ Mạng'} • {chart.canChiYear}
                      </p>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40 font-mono">
                      {chart.cuc}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-amber-200/70 font-serif-vi space-y-0.5">
                    <p>Sinh: {chart.solarDate.day}/{chart.solarDate.month}/{chart.solarDate.year} ({chart.birthHourChi})</p>
                    <p>Mệnh: {chart.menhNguHanh}</p>
                    <p>{chart.thanCuCung}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-900/30 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onSelectChart(chart)}
                    className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-100 font-bold bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-800/50 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Mở Xem Lá Số</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteChart(chart.id)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-950/30 transition"
                    title="Xóa lá số"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#120e16]/60 border border-dashed border-amber-900/30 rounded-2xl p-8 text-center text-stone-400 font-serif-vi text-xs sm:text-sm">
            Bạn chưa lưu lá số nào. Hãy vào mục <strong>"Tử Vi Trọn Đời"</strong> và nhấn nút <strong>"Lưu Lá Số Này"</strong>.
          </div>
        )}
      </div>

      {/* Section 2: Saved Divinations */}
      <div className="space-y-3 pt-4 border-t border-amber-900/30">
        <h3 className="text-sm font-bold font-cinzel text-amber-300 uppercase tracking-wider flex items-center gap-2">
          <span>🪙 Quẻ Bói Đã Gieo</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/40">
            {savedQues.length} quẻ
          </span>
        </h3>

        {savedQues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedQues.map((que) => (
              <div
                key={que.id}
                className="bg-[#120e16] border border-amber-800/40 rounded-2xl p-4 shadow-lg space-y-2 relative"
              >
                <div className="flex items-center justify-between border-b border-amber-900/30 pb-2">
                  <h4 className="text-sm font-bold font-cinzel text-amber-200">
                    {que.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-amber-400/60">{que.savedAt}</span>
                    <button
                      type="button"
                      onClick={() => onDeleteQue(que.id)}
                      className="text-stone-500 hover:text-rose-400 transition"
                      title="Xóa quẻ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-amber-200/80 font-serif-vi whitespace-pre-line leading-relaxed">
                  {que.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#120e16]/60 border border-dashed border-amber-900/30 rounded-2xl p-8 text-center text-stone-400 font-serif-vi text-xs sm:text-sm">
            Chưa có quẻ nào được lưu. Bạn có thể lưu quẻ sau khi gieo tại mục <strong>"Gieo Quẻ Bói Toán"</strong>.
          </div>
        )}
      </div>
    </div>
  );
};
