import React, { useState } from 'react';
import { Send, Sparkles, User, RefreshCw, MessageSquare, BookOpen, Compass } from 'lucide-react';
import { TuViLaSo } from '../types/horoscope';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AiConsultantSectionProps {
  currentLaSo: TuViLaSo | null;
  initialQuestion?: string;
}

export const AiConsultantSection: React.FC<AiConsultantSectionProps> = ({ currentLaSo, initialQuestion }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Kính chào thân chủ! Bần đạo nghiên cứu lý số Tử Vi Đẩu Số và Kinh Dịch đã nhiều năm.

${
  currentLaSo
    ? `Bần đạo đã tiếp nhận lá số của thân chủ: **${currentLaSo.fullName}**, tuổi **${currentLaSo.canChiYear}** (Mệnh ${currentLaSo.menhNguHanh}). Cung Mệnh tọa tại ${currentLaSo.cungs[0]?.chi}, Thân cư ${currentLaSo.thanCuCung}.`
    : 'Bần đạo có thể luận giải chi tiết lá số trọn đời, định hướng nghề nghiệp, tình duyên, tài lộc, xem ngày giờ hoàng đạo hoặc giải quẻ Kinh Dịch.'
}

Thân chủ đang có điều gì trăn trở nơi lòng cần bần đạo soi tỏ? Xin cứ tự nhiên giãi bày.`,
      timestamp: new Date().toLocaleTimeString('vi-VN')
    }
  ]);

  const [inputQuestion, setInputQuestion] = useState<string>(initialQuestion || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Quick suggestion prompts
  const suggestions = [
    'Năm nay tuổi con có phạm Tam Tai, Hoang Ốc hay Thái Tuế không?',
    'Theo lá số, con nên đi theo con đường làm công hay khởi nghiệp tự do?',
    'Đường tình duyên và hôn nhân của con sau này có êm ấm không?',
    'Làm thế nào để hóa giải các sao xấu trong cung Tài Bạch và Tật Ách?',
    'Nhờ Thầy xem giúp ngày tốt nhất trong tháng này để khởi sự công việc.'
  ];

  const handleSend = async (questionToSend?: string) => {
    const q = (questionToSend || inputQuestion).trim();
    if (!q || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/horoscope/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          laSo: currentLaSo,
          userContext: currentLaSo ? `Lá số ${currentLaSo.fullName}, sinh năm ${currentLaSo.canChiYear}` : 'Người dùng chưa lập lá số'
        })
      });

      const data = await response.json();

      if (data.success && data.reading) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reading,
            timestamp: new Date().toLocaleTimeString('vi-VN')
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Bần đạo hiện đang bận tế lễ hoặc mạng truyền thông gián đoạn. Thân chủ hoan hỷ thử lại sau giây lát nhé.',
            timestamp: new Date().toLocaleTimeString('vi-VN')
          }
        ]);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Không thể kết nối đến máy chủ lúc này. Xin thân chủ kiểm tra lại đường truyền.',
          timestamp: new Date().toLocaleTimeString('vi-VN')
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header Profile */}
      <div className="bg-gradient-to-b from-[#1c1422] to-[#120f16] border border-amber-900/40 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-amber-700 to-yellow-500 p-0.5 shadow-lg shadow-amber-600/30">
            <div className="w-full h-full rounded-full bg-[#18131d] flex items-center justify-center text-3xl select-none">
              🧙‍♂️
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-cinzel text-amber-200">
                Cụ Đồ Tử Vi AI (Bậc Thầy Huyền Học)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-600/40">
                Sẵn Sàng Trực Tuyến
              </span>
            </div>
            <p className="text-xs text-amber-300/70 font-serif-vi mt-0.5">
              Am hiểu Tử Vi Đẩu Số, Kinh Dịch, Phong Thủy Địa Lý • Lời khuyên định hướng thiện lương
            </p>
          </div>
        </div>

        {currentLaSo ? (
          <div className="text-right text-xs text-amber-300/80 font-serif-vi bg-amber-950/30 px-3.5 py-2 rounded-xl border border-amber-800/40">
            <span className="text-[10px] text-amber-400 block font-bold font-cinzel">LÁ SỐ ĐANG KẾT NỐI</span>
            <strong>{currentLaSo.fullName}</strong> ({currentLaSo.canChiYear} - Mệnh {currentLaSo.menhNguHanh})
          </div>
        ) : (
          <div className="text-xs text-stone-400 italic font-serif-vi">
            (Có thể sang tab "Tử Vi Trọn Đời" để lập lá số giúp Thầy luận giải chính xác hơn)
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-amber-400/80 font-medium mr-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gợi ý câu hỏi:</span>
        </span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(s)}
            className="text-xs px-3 py-1.5 rounded-full bg-[#16121a] hover:bg-amber-950/60 text-amber-300/90 border border-amber-800/40 transition font-serif-vi"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="bg-[#0e0c10] border border-amber-900/40 rounded-2xl p-4 sm:p-6 shadow-2xl min-h-[420px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-9 h-9 rounded-full bg-amber-900/40 border border-amber-600/50 flex-shrink-0 flex items-center justify-center text-lg select-none">
                📜
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm font-serif-vi leading-relaxed shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-stone-950 font-medium'
                  : 'bg-[#18131d] border border-amber-900/40 text-amber-100/90 whitespace-pre-line'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] opacity-70 mb-1 border-b border-white/10 pb-1">
                <span>{msg.role === 'user' ? 'Thân chủ' : 'Cụ Đồ Tử Vi'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>

            {msg.role === 'user' && (
              <div className="w-9 h-9 rounded-full bg-amber-600/40 border border-amber-400/50 flex-shrink-0 flex items-center justify-center text-sm font-bold text-amber-200">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-amber-300 text-xs italic font-serif-vi animate-pulse pl-2">
            <span className="text-xl">🕯️</span>
            <span>Cụ Đồ đang bấm tay tính toán thiên can địa chi và xem quẻ...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-[#141018] border border-amber-800/50 rounded-2xl p-2 shadow-xl focus-within:border-amber-400"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Nhập câu hỏi của bạn (ví dụ: Xem ngày cưới hỏi, công danh, cách hoá giải sao xấu...)"
          className="flex-1 bg-transparent px-4 py-2.5 text-xs sm:text-sm text-amber-100 placeholder-amber-400/30 focus:outline-none font-serif-vi"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || isLoading}
          className={`p-3 rounded-xl font-bold transition flex items-center justify-center ${
            !inputQuestion.trim() || isLoading
              ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 shadow-md shadow-amber-600/30 active:scale-95'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
