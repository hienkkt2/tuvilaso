/**
 * Type definitions for Vietnamese Horoscope (Tử Vi), 
 * Auspicious Day Selection (Xem Ngày Giờ Tốt Xấu), and Divination (Kinh Dịch, Bói Quẻ)
 */

export type Can = 'Giáp' | 'Ất' | 'Bính' | 'Đinh' | 'Mậu' | 'Kỷ' | 'Canh' | 'Tân' | 'Nhâm' | 'Quý';
export type Chi = 'Tý' | 'Sửu' | 'Dần' | 'Mão' | 'Thìn' | 'Tỵ' | 'Ngọ' | 'Mùi' | 'Thân' | 'Dậu' | 'Tuất' | 'Hợi';

export type Gender = 'nam' | 'nu';

export type AmDuongMenh = 'Dương Nam' | 'Âm Nam' | 'Dương Nữ' | 'Âm Nữ';

export type NguHanh = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

export type CucType = 'Thủy Nhị Cục' | 'Mộc Tam Cục' | 'Kim Tứ Cục' | 'Thổ Ngũ Cục' | 'Hỏa Lục Cục';

export interface SolarDate {
  day: number;
  month: number;
  year: number;
}

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
}

export interface CanChiDate {
  yearCanChi: string;
  monthCanChi: string;
  dayCanChi: string;
  hourCanChi?: string;
  napAmYear: string;
  napAmDay: string;
}

export interface GioHoangDaoItem {
  chi: Chi;
  timeRange: string;
  isHoangDao: boolean;
  starName: string; // Thanh Long, Minh Đường, v.v.
  nature: 'Cát' | 'Hung';
  goodFor: string;
}

export interface DayAuspiciousInfo {
  solar: SolarDate;
  lunar: LunarDate;
  canChi: CanChiDate;
  tietKhi: string;
  isHoangDaoDay: boolean;
  hoangDaoType: string; // Thanh Long Hoàng Đạo, Minh Đường Hoàng Đạo, v.v.
  lucDieu: {
    name: string;
    description: string;
    isGood: boolean;
  };
  truc: {
    name: string;
    nature: string;
    description: string;
    isGood: boolean;
  };
  nhiThapBatTu: {
    name: string;
    conVat: string;
    element: string;
    isGood: boolean;
    description: string;
  };
  gioHoangDao: GioHoangDaoItem[];
  saoTot: string[];
  saoXau: string[];
  viecNenLam: string[];
  viecKiengCu: string[];
  huongXuatHanh: {
    hyThan: string;
    taiThan: string;
    hacThan: string;
  };
  tuoiXungKhac: string[];
  score: number; // 0 - 100
  verdict: 'Rất Tốt (Đại Cát)' | 'Khá Tốt (Tiểu Cát)' | 'Bình Thường' | 'Xấu (Hung)' | 'Rất Xấu (Đại Hung)';
}

export interface Star {
  name: string;
  type: 'chinh-tinh' | 'phu-tinh-cat' | 'phu-tinh-hung' | 'tu-hoa';
  element: NguHanh;
  brightness?: 'Miếu' | 'Vượng' | 'Đắc' | 'Bình' | 'Hãm';
  meaning: string;
}

export interface TuViCung {
  index: number; // 0 -> 11 (Tý -> Hợi)
  chi: Chi;
  can: Can;
  name: string; // Mệnh, Phụ Mẫu, Phúc Đức, Điền Trạch, Quan Lộc, Nô Bộc, Thiên Di, Tật Ách, Tài Bạch, Tử Tức, Phu Thê, Huynh Đệ
  isThanCu: boolean;
  daiHan: number; // Tuổi bắt đầu đại hạn 10 năm
  chinhTinh: Star[];
  phuTinhCat: Star[];
  phuTinhHung: Star[];
  tuanTriet?: 'Tuần' | 'Triệt' | 'Tuần - Triệt' | null;
  cungScore?: number;
  luanGiai?: string;
}

export interface TuViLaSo {
  id: string;
  fullName: string;
  gender: Gender;
  solarDate: SolarDate;
  birthHour: number;
  birthMinute: number;
  birthHourChi: Chi;
  lunarDate: LunarDate;
  canChiYear: string;
  canChiMonth: string;
  canChiDay: string;
  canChiHour: string;
  amDuongMenh: AmDuongMenh;
  menhNguHanh: string;
  cuc: CucType;
  chuMenh: string;
  chuThan: string;
  thanCuCung: string;
  cungs: TuViCung[];
  luanGiaiTongQuat: {
    tongQuanMenh: string;
    tinhCach: string;
    congDanhSuNghiep: string;
    taiLocTienTai: string;
    tinhDuyenGiaDao: string;
    sucKhoeBaoVe: string;
    daiVanDacBiet: string;
    loiKhuyenHanhSu: string;
  };
  createdAt: string;
}

export interface KinhDichQue {
  number: number;
  name: string;
  hanTu: string;
  upperTrigram: string; // Quẻ Thượng (Càn, Khôn, ...)
  lowerTrigram: string; // Quẻ Hạ
  thoanTu: string;
  yNghia: string;
  loiKhuyen: string;
  catHung: 'Đại Cát' | 'Cát' | 'Bình Hoà' | 'Hung' | 'Đại Hung';
}

export interface TheKieuItem {
  id: number;
  title: string;
  lines: string[];
  meaning: string;
  advice: string;
}

export interface BoiBaiItem {
  id: string;
  name: string;
  suit: 'Cơ' | 'Rô' | 'Chuồn' | 'Bích';
  symbol: string;
  color: 'red' | 'black';
  meaning: string;
  position: 'Quá Khứ' | 'Hiện Tại' | 'Tương Lai';
}

export type VipTier = 'free' | 'cat-tuong' | 'de-vuong';

export interface UserWallet {
  coins: number;
  vipTier: VipTier;
  vipExpiresAt: string | null;
  transactionHistory: {
    id: string;
    amount: number;
    coinsAdded: number;
    description: string;
    date: string;
    status: 'success' | 'pending';
  }[];
}

export interface MonthFortune {
  month: number; // 1 to 12
  canChi: string;
  title: string;
  careerScore: number;
  wealthScore: number;
  loveScore: number;
  summary: string;
  goodEvents: string[];
  taboos: string[];
}

export interface CompatibilityResult {
  p1: { name: string; birthYear: number; canChi: string; menh: string; cungPhi: string };
  p2: { name: string; birthYear: number; canChi: string; menh: string; cungPhi: string };
  score: number; // 0 - 100
  rating: 'Tuyệt Mạng' | 'Họa Hại' | 'Lục Sát' | 'Ngũ Quỷ' | 'Sinh Khí' | 'Diên Niên' | 'Thiên Y' | 'Phục Vị';
  isGood: boolean;
  canChiMatch: string;
  menhMatch: string;
  cungPhiMatch: string;
  overallConclusion: string;
  remedyAdvice: string;
}

export interface PalmistryFeature {
  name: string;
  sign: string;
  meaning: string;
  fortuneScore: number;
}

