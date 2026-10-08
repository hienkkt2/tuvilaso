import React, { useState } from 'react';
import { Crown, Sparkles, Check, QrCode, CreditCard, ShieldCheck, X, Zap, ArrowRight, Wallet } from 'lucide-react';
import { UserWallet, VipTier } from '../types/horoscope';

interface VipUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: UserWallet;
  onUpdateWallet: (updated: UserWallet) => void;
  defaultTab?: 'packages' | 'topup';
}

export const VipUpgradeModal: React.FC<VipUpgradeModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onUpdateWallet,
  defaultTab = 'packages'
}) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'topup'>(defaultTab);
  const [selectedTopupAmount, setSelectedTopupAmount] = useState<number>(100000);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle direct VIP upgrade using coins
  const handleUpgradeWithCoins = (tier: VipTier, costCoins: number, tierName: string) => {
    if (wallet.coins < costCoins) {
      setActiveTab('topup');
      return;
    }

    const updated: UserWallet = {
      ...wallet,
      coins: wallet.coins - costCoins,
      vipTier: tier,
      vipExpiresAt: tier === 'de-vuong' ? 'Vĩnh Viễn' : '1 Năm',
      transactionHistory: [
        {
          id: `tx_${Date.now()}`,
          amount: 0,
          coinsAdded: -costCoins,
          description: `Kích hoạt gói ${tierName}`,
          date: new Date().toLocaleDateString('vi-VN'),
          status: 'success'
        },
        ...wallet.transactionHistory
      ]
    };

    onUpdateWallet(updated);
    setPaymentSuccessMsg(`Chúc mừng thân chủ đã kích hoạt thành công Gói ${tierName}!`);
    setTimeout(() => {
      setPaymentSuccessMsg(null);
    }, 3000);
  };

  // Simulate instant bank / VietQR transfer
  const handleSimulatePayment = () => {
    setIsProcessing(true);

    const coinsToAdd = selectedTopupAmount === 50000 ? 50 : selectedTopupAmount === 100000 ? 110 : selectedTopupAmount === 200000 ? 240 : 650;

    setTimeout(() => {
      const updated: UserWallet = {
        ...wallet,
        coins: wallet.coins + coinsToAdd,
        transactionHistory: [
          {
            id: `tx_${Date.now()}`,
            amount: selectedTopupAmount,
            coinsAdded: coinsToAdd,
            description: `Nạp Kim Ngân qua VietQR (${selectedTopupAmount.toLocaleString('vi-VN')}đ)`,
            date: new Date().toLocaleDateString('vi-VN'),
            status: 'success'
          },
          ...wallet.transactionHistory
        ]
      };

      onUpdateWallet(updated);
      setIsProcessing(false);
      setPaymentSuccessMsg(`Nạp thành công ${coinsToAdd} Vàng vào Ví Kim Ngân!`);
      setTimeout(() => {
        setPaymentSuccessMsg(null);
        setActiveTab('packages');
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#1c1424] via-[#140e1a] to-[#0e0a12] border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-amber-900/40 flex items-center justify-between bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 text-stone-950 font-bold shadow-md shadow-amber-500/30">
              <Crown className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-cinzel text-amber-200">
                Nâng Cấp Hội Viên VIP & Ví Kim Ngân
              </h3>
              <p className="text-[11px] text-amber-300/70 font-serif-vi">
                Mở khóa toàn bộ kho tàng huyền học cao cấp: Vận trình 12 tháng, Bát tự hợp hôn, Soi tướng chỉ tay
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Wallet balance chip */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs font-bold font-mono">
              <Wallet className="w-3.5 h-3.5 text-yellow-400" />
              <span>Ví: {wallet.coins} Vàng</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-amber-200 hover:bg-amber-950/40 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-amber-900/30">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'packages'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-amber-200/60 hover:text-amber-200'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Gói Hội Viên VIP</span>
          </button>

          <button
            onClick={() => setActiveTab('topup')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'topup'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-amber-200/60 hover:text-amber-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Nạp Vàng Vào Ví (VietQR / MoMo)</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {paymentSuccessMsg && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{paymentSuccessMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: VIP PACKAGES */}
          {activeTab === 'packages' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Package 1: Cát Tường */}
              <div className="bg-[#120e16] border border-amber-700/50 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5 relative">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-cinzel">
                      GÓI 1 NĂM
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/40">
                      Cơ Bản Cao Cấp
                    </span>
                  </div>

                  <h4 className="text-xl font-black font-cinzel text-amber-200 mt-1">
                    VIP CÁT TƯỜNG
                  </h4>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-100 font-cinzel">
                      99 Vàng
                    </span>
                    <span className="text-xs text-amber-400/60 font-serif-vi">
                      (Tương đương 99.000đ)
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs text-amber-200/90 font-serif-vi">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Vận Trình 12 Tháng:</strong> Dự đoán chi tiết công danh, tài lộc, tình cảm từng tháng trong năm</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Soi Tướng Chỉ Tay:</strong> Giải mã 5 nét tướng quý nhân, đường sinh đạo, trí đạo, tài vận</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Xuất PDF Cung Đình:</strong> Bản in lá số sắc nét màu dát vàng kèm triện son phong thủy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span><strong>50 Lượt Hỏi:</strong> Đàm đạo cùng Cụ Đồ Tử Vi AI</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpgradeWithCoins('cat-tuong', 99, 'VIP Cát Tường')}
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition shadow-lg ${
                    wallet.vipTier === 'cat-tuong' || wallet.vipTier === 'de-vuong'
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-600/50 cursor-default'
                      : wallet.coins >= 99
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 shadow-amber-600/30'
                      : 'bg-stone-800 text-amber-200 hover:bg-stone-700 border border-amber-900/40'
                  }`}
                >
                  {wallet.vipTier === 'cat-tuong' || wallet.vipTier === 'de-vuong'
                    ? '✓ Đang Sử Dụng Gói Này'
                    : wallet.coins >= 99
                    ? 'Kích Hoạt (99 Vàng)'
                    : 'Nạp Thêm Vàng Để Kích Hoạt'}
                </button>
              </div>

              {/* Package 2: Đế Vương (Best Seller) */}
              <div className="bg-gradient-to-b from-[#221828] to-[#140e1b] border-2 border-yellow-400 rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-5 relative gold-glow-strong">
                {/* Popular Badge */}
                <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-[10px] tracking-widest px-3 py-1 rounded-full shadow-md uppercase">
                  👑 ĐƯỢC CHỌN NHIỀU NHẤT
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-yellow-300 uppercase tracking-widest font-cinzel">
                      TRỌN ĐỜI VĨNH VIỄN
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-400/40">
                      Đặc Quyền Vô Hạn
                    </span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-black font-cinzel text-yellow-200 mt-1">
                    VIP ĐẾ VƯƠNG
                  </h4>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-yellow-300 font-cinzel">
                      299 Vàng
                    </span>
                    <span className="text-xs text-amber-400/60 line-through">
                      599.000đ
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">
                      (Tiết kiệm 50%)
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs text-amber-100 font-serif-vi">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Toàn bộ quyền lợi gói Cát Tường</strong> trọn đời không giới hạn thời gian</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>So Kèo Bát Tự & Hợp Hôn:</strong> Chấm điểm tương sinh tương khắc 2 người (vợ chồng, đối tác làm ăn)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Cẩm Nang Đổi Vận Toàn Diện:</strong> Hướng tài vị, màu sắc tương sinh, linh vật phong thủy hộ thân</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span><strong>Hỏi Đáp Thầy Tử Vi AI Vô Hạn:</strong> Phân tích chuyên sâu mọi trăn trở trong cuộc sống</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpgradeWithCoins('de-vuong', 299, 'VIP Đế Vương Trọn Đời')}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition shadow-xl ${
                    wallet.vipTier === 'de-vuong'
                      ? 'bg-amber-950/60 text-yellow-300 border border-yellow-500/50 cursor-default'
                      : wallet.coins >= 299
                      ? 'bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 hover:brightness-110 text-stone-950 shadow-yellow-500/30'
                      : 'bg-gradient-to-r from-stone-800 to-amber-950 text-amber-200 hover:brightness-110 border border-yellow-500/40'
                  }`}
                >
                  {wallet.vipTier === 'de-vuong'
                    ? '👑 Đang Sở Hữu VIP Đế Vương Trọn Đời'
                    : wallet.coins >= 299
                    ? 'Kích Hoạt Ngay (299 Vàng)'
                    : 'Nạp Thêm Vàng Để Kích Hoạt'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TOP UP COINS (NẠP VÀNG) */}
          {activeTab === 'topup' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Select Denomination */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <h4 className="text-sm font-bold font-cinzel text-amber-200">
                    1. Chọn Mức Nạp Kim Ngân
                  </h4>
                  <p className="text-xs text-amber-300/70 font-serif-vi">
                    Tỷ lệ quy đổi: 1.000 VNĐ = 1 Vàng (Nạp mệnh giá lớn được thưởng thêm tới +30%)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { amount: 50000, coins: 50, bonus: '' },
                    { amount: 100000, coins: 110, bonus: '+10% Thưởng' },
                    { amount: 200000, coins: 240, bonus: '+20% Thưởng' },
                    { amount: 500000, coins: 650, bonus: '+30% Thưởng (Siêu Hời)' }
                  ].map((item) => (
                    <div
                      key={item.amount}
                      onClick={() => setSelectedTopupAmount(item.amount)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                        selectedTopupAmount === item.amount
                          ? 'border-yellow-400 bg-amber-950/40 shadow-lg shadow-amber-500/20'
                          : 'border-amber-900/40 bg-[#120e16] hover:border-amber-600/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-amber-100 font-cinzel">
                          {item.amount.toLocaleString('vi-VN')} đ
                        </span>
                        {item.bonus && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 font-bold border border-red-700/40">
                            {item.bonus}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-xs font-bold text-yellow-300 font-mono">
                        Nhận: {item.coins} Vàng
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/30 text-xs text-amber-200/80 font-serif-vi space-y-1">
                  <p className="flex items-center gap-1.5 font-bold text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Cam kết bảo mật & Kích hoạt tức thì:</span>
                  </p>
                  <p>• Hệ thống đối soát tự động xử lý trong 5-10 giây sau khi chuyển khoản.</p>
                  <p>• Hỗ trợ mọi ứng dụng Ngân hàng (Vietcombank, MB, Techcombank, BIDV, VPBank...) và ví MoMo.</p>
                </div>
              </div>

              {/* VietQR & Transfer Simulation */}
              <div className="lg:col-span-5 bg-[#120e16] border-2 border-amber-600/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between items-center text-center space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-cinzel">
                    QUÉT MÃ VIETQR TỰ ĐỘNG
                  </span>
                  <h5 className="text-sm font-bold text-amber-200 mt-0.5">
                    Số Tiền: {selectedTopupAmount.toLocaleString('vi-VN')} VNĐ
                  </h5>
                </div>

                {/* Real VietQR Code with Techcombank */}
                <div className="relative p-3 bg-white rounded-2xl shadow-xl border-2 border-amber-400">
                  <img
                    src={`https://img.vietqr.io/image/TCB-8396869395-compact2.png?amount=${selectedTopupAmount}&addInfo=NAP%20TUVI%20${wallet.coins + 777}&accountName=DOAN%20DINH%20HIEN`}
                    onError={(e) => {
                      // Fallback if VietQR API has network latency
                      (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://tuvi.vansulanh.vn/pay?bank=TCB&acc=8396869395&amount=${selectedTopupAmount}&name=DOAN%20DINH%20HIEN`;
                    }}
                    alt="VietQR Techcombank Payment"
                    className="w-64 h-64 sm:w-72 sm:h-72 object-contain rounded-xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white text-xs font-black shadow-md">
                      TCB
                    </div>
                  </div>
                </div>

                <div className="w-full text-left text-xs font-mono bg-[#0c0a0f] p-3.5 rounded-xl border border-amber-900/40 text-amber-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400/60">Ngân hàng:</span>
                    <strong className="text-amber-100 font-bold text-sm">Techcombank</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400/60">Số TK:</span>
                    <strong className="text-yellow-300 font-bold text-base tracking-wider">8396869395</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400/60">Chủ TK:</span>
                    <strong className="text-amber-100 uppercase font-semibold">ĐOÀN ĐÌNH HIỂN</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400/60">Nội dung CK:</span>
                    <strong className="text-yellow-300 font-bold bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800/40">
                      NAP TUVI {wallet.coins + 777}
                    </strong>
                  </div>
                </div>

                {/* Instant Simulator / Payment Confirm Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleSimulatePayment}
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-lg transition flex items-center justify-center gap-2 ${
                    isProcessing
                      ? 'bg-amber-900/40 text-amber-300/40 cursor-wait'
                      : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:brightness-110 text-stone-950 shadow-emerald-600/30 active:scale-98'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>{isProcessing ? 'Đang Xác Nhận Giao Dịch...' : 'Xác Nhận Nạp Tiền Ngay'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
