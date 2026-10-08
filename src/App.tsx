/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TuViSection } from './components/TuViSection';
import { AuspiciousDateSection } from './components/AuspiciousDateSection';
import { DivinationSection } from './components/DivinationSection';
import { AiConsultantSection } from './components/AiConsultantSection';
import { SavedChartsModal, SavedQueItem } from './components/SavedChartsModal';
import { VipFeaturesSection } from './components/VipFeaturesSection';
import { VipUpgradeModal } from './components/VipUpgradeModal';
import { TuViLaSo, UserWallet } from './types/horoscope';
import { generateTuViLaSo } from './utils/tuViEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tu-vi' | 'xem-ngay' | 'boi-toan' | 'ai-master' | 'so-tay' | 'vip'>('tu-vi');

  // Initialize wallet with 50 free coins as welcome bonus
  const [wallet, setWallet] = useState<UserWallet>(() => {
    try {
      const stored = localStorage.getItem('tuvi_user_wallet');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      coins: 50,
      vipTier: 'free',
      vipExpiresAt: null,
      transactionHistory: [
        {
          id: 'welcome_gift',
          amount: 0,
          coinsAdded: 50,
          description: 'Quà tặng tân thủ khởi tạo tài khoản',
          date: new Date().toLocaleDateString('vi-VN'),
          status: 'success'
        }
      ]
    };
  });

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);

  // Initialize with a default chart so the user has instant rich visuals
  const [currentLaSo, setCurrentLaSo] = useState<TuViLaSo | null>(() => {
    return generateTuViLaSo({
      fullName: 'Nguyễn Văn An',
      gender: 'nam',
      solarDate: { day: 15, month: 8, year: 1995 },
      birthHour: 6,
      birthMinute: 30
    });
  });

  // Local storage saved charts & divinations
  const [savedCharts, setSavedCharts] = useState<TuViLaSo[]>(() => {
    try {
      const stored = localStorage.getItem('tuvi_saved_charts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savedQues, setSavedQues] = useState<SavedQueItem[]>(() => {
    try {
      const stored = localStorage.getItem('tuvi_saved_ques');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Context question when jumping to AI Master tab
  const [aiInitialQuestion, setAiInitialQuestion] = useState<string>('');

  // Persist wallet to local storage
  useEffect(() => {
    try {
      localStorage.setItem('tuvi_user_wallet', JSON.stringify(wallet));
    } catch (e) {
      console.error(e);
    }
  }, [wallet]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('tuvi_saved_charts', JSON.stringify(savedCharts));
    } catch (e) {
      console.error(e);
    }
  }, [savedCharts]);

  useEffect(() => {
    try {
      localStorage.setItem('tuvi_saved_ques', JSON.stringify(savedQues));
    } catch (e) {
      console.error(e);
    }
  }, [savedQues]);

  // Save chart handler
  const handleSaveLaSo = (laSo: TuViLaSo) => {
    if (!savedCharts.some((c) => c.id === laSo.id)) {
      setSavedCharts((prev) => [laSo, ...prev]);
    }
  };

  // Delete chart handler
  const handleDeleteChart = (id: string) => {
    setSavedCharts((prev) => prev.filter((c) => c.id !== id));
  };

  // Save divination handler
  const handleSaveQue = (title: string, content: string) => {
    const newItem: SavedQueItem = {
      id: `que_${Date.now()}`,
      title,
      content,
      savedAt: new Date().toLocaleDateString('vi-VN')
    };
    setSavedQues((prev) => [newItem, ...prev]);
  };

  // Delete divination handler
  const handleDeleteQue = (id: string) => {
    setSavedQues((prev) => prev.filter((q) => q.id !== id));
  };

  // Transition to AI Master with context
  const handleConsultAi = (question: string, contextLaSo?: TuViLaSo) => {
    if (contextLaSo) setCurrentLaSo(contextLaSo);
    setAiInitialQuestion(question);
    setActiveTab('ai-master');
  };

  // Transition from divination to AI Master
  const handleConsultAiWithQue = (
    queName: string,
    thoanTu: string,
    yNghia: string,
    question: string,
    type: 'dich' | 'kieu'
  ) => {
    const prompt = `Con vừa gieo được ${type === 'kieu' ? 'Thẻ Kiều' : 'Quẻ Kinh Dịch'}: "${queName}".\nÝ nghĩa: ${yNghia}.\nTâm nguyện của con: "${question}".\nKính nhờ Thầy luận giải chi tiết việc này giúp con.`;
    setAiInitialQuestion(prompt);
    setActiveTab('ai-master');
  };

  const isCurrentChartSaved = currentLaSo ? savedCharts.some((c) => c.id === currentLaSo.id) : false;
  const isVip = wallet.vipTier === 'cat-tuong' || wallet.vipTier === 'de-vuong';

  return (
    <div className="min-h-screen bg-[#0a090d] text-[#eee9dc] flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedCharts.length + savedQues.length}
        wallet={wallet}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'tu-vi' && (
          <TuViSection
            currentLaSo={currentLaSo}
            setCurrentLaSo={setCurrentLaSo}
            onConsultAi={handleConsultAi}
            onSaveLaSo={handleSaveLaSo}
            isSaved={isCurrentChartSaved}
            onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
            onSelectVipTab={() => setActiveTab('vip')}
            isVip={isVip}
          />
        )}

        {activeTab === 'xem-ngay' && (
          <AuspiciousDateSection
            onConsultAiWithDate={(prompt) => handleConsultAi(prompt, currentLaSo || undefined)}
          />
        )}

        {activeTab === 'boi-toan' && (
          <DivinationSection
            onConsultAiWithQue={handleConsultAiWithQue}
            onSaveQue={handleSaveQue}
          />
        )}

        {activeTab === 'ai-master' && (
          <AiConsultantSection
            currentLaSo={currentLaSo}
            initialQuestion={aiInitialQuestion}
          />
        )}

        {activeTab === 'vip' && (
          <VipFeaturesSection
            wallet={wallet}
            onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
            currentLaSo={currentLaSo}
          />
        )}

        {activeTab === 'so-tay' && (
          <SavedChartsModal
            savedCharts={savedCharts}
            savedQues={savedQues}
            onSelectChart={(chart) => {
              setCurrentLaSo(chart);
              setActiveTab('tu-vi');
            }}
            onDeleteChart={handleDeleteChart}
            onDeleteQue={handleDeleteQue}
          />
        )}
      </main>

      {/* VIP Upgrade & Top-up Modal */}
      <VipUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        wallet={wallet}
        onUpdateWallet={setWallet}
      />

      {/* Oriental Footer */}
      <footer className="border-t border-amber-900/30 bg-[#0c0a0e] py-8 text-center text-xs text-amber-300/60 font-serif-vi">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-3 text-amber-400/80">
            <span>☯ Âm Dương Giao Hòa</span>
            <span>•</span>
            <span>Ngũ Hành Tương Sinh</span>
            <span>•</span>
            <span>Đức Năng Thắng Số</span>
          </div>
          <p className="text-[11px] text-stone-500 max-w-2xl mx-auto">
            Ứng dụng Tử Vi & Vạn Sự Lành phát triển dựa trên các tác phẩm lý số cổ điển phương Đông kết hợp công nghệ trí tuệ nhân tạo. 
            Mọi luận đoán mang ý nghĩa chiêm nghiệm định hướng, lấy chữ Tâm và chữ Đức làm gốc cải biến vận mệnh.
          </p>
          <p className="text-[10px] text-stone-600">
            © {new Date().getFullYear()} Tử Vi & Vạn Sự Lành. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
