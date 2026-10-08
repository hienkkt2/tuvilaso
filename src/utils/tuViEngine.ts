/**
 * Tử Vi Đẩu Số Core Engine
 * Generates accurate 12-court astrological natal chart (Lá Số Tử Vi)
 * and detailed lifetime horoscope reading (Tử Vi Trọn Đời).
 */

import { AmDuongMenh, Can, Chi, CucType, Gender, LunarDate, NguHanh, SolarDate, Star, TuViCung, TuViLaSo } from '../types/horoscope';
import { CANS, CHIS, convertSolarToLunar, getCanChi, NAP_AM_MAP } from './lunarCalendar';

// 12 Tên Cung Tử Vi
export const CUNG_NAMES = [
  'Mệnh',
  'Phụ Mẫu',
  'Phúc Đức',
  'Điền Trạch',
  'Quan Lộc',
  'Nô Bộc',
  'Thiên Di',
  'Tật Ách',
  'Tài Bạch',
  'Tử Tức',
  'Phu Thê',
  'Huynh Đệ'
];

// Chi to Index: Tý = 0, Sửu = 1, Dần = 2, Mão = 3, Thìn = 4, Tỵ = 5, Ngọ = 6, Mùi = 7, Thân = 8, Dậu = 9, Tuất = 10, Hợi = 11
export const CHI_INDEX: Record<Chi, number> = {
  'Tý': 0, 'Sửu': 1, 'Dần': 2, 'Mão': 3, 'Thìn': 4, 'Tỵ': 5,
  'Ngọ': 6, 'Mùi': 7, 'Thân': 8, 'Dậu': 9, 'Tuất': 10, 'Hợi': 11
};

// 14 Chính Tinh details
export const CHINH_TINH_METADATA: Record<string, { element: NguHanh; description: string }> = {
  'Tử Vi': { element: 'Thổ', description: 'Đế Tinh, chủ quyền uy, phúc lộc, sự nghiệp tôn quý, hoá giải hung hiểm.' },
  'Thiên Cơ': { element: 'Mộc', description: 'Thiện Tinh, chủ mưu lược, trí tuệ, mẫn tiệp, thích ứng nhanh, khéo léo.' },
  'Thái Dương': { element: 'Hỏa', description: 'Quý Tinh, tượng trưng cho mặt trời, quang minh chính đại, danh vọng, cha/chồng.' },
  'Vũ Khúc': { element: 'Kim', description: 'Tài Tinh, chủ tiền tài, kinh doanh, cương trực, quả quyết, tài thao lược.' },
  'Thiên Đồng': { element: 'Thủy', description: 'Phúc Tinh, tính tình hiền lành, thích an nhàn, có khiếu nghệ thuật, vãn niên phát tài.' },
  'Liêm Trinh': { element: 'Hỏa', description: 'Tù Tinh, Đào Hoa thứ hai, đa đoan, kỷ luật nghiêm minh, tham vọng lớn.' },
  'Thiên Phủ': { element: 'Thổ', description: 'Lệnh Tinh, kho trời, chủ tài lộc sung túc, tính tình bao dung, ổn định vững vàng.' },
  'Thái Âm': { element: 'Thủy', description: 'Phú Tinh, tượng trưng cho mặt trăng, mẹ/vợ, tích lũy điền sản, lãng mạn tinh tế.' },
  'Tham Lang': { element: 'Thủy', description: 'Đào Hoa Tinh, chủ dục vọng, tài hoa nghệ thuật, giao tế rộng, ham trải nghiệm.' },
  'Cự Môn': { element: 'Thủy', description: 'Ám Tinh, chủ ngôn từ, hùng biện, sắc sảo, thích nghiên cứu, hay gặp khẩu thiệt.' },
  'Thiên Tướng': { element: 'Thủy', description: 'Ấn Tinh, chủ uy quyền, lòng nhân hậu, tinh thần trượng nghĩa, chu toàn.' },
  'Thiên Lương': { element: 'Mộc', description: 'Ấm Tinh, chủ thọ trường, giải ách, đức độ, phong thái người thầy, người che chở.' },
  'Thất Sát': { element: 'Kim', description: 'Dũng Tinh, tướng quân xông pha, quyết đoán táo bạo, ưa mạo hiểm, công danh lẫy lừng.' },
  'Phá Quân': { element: 'Thủy', description: 'Hao Tinh, chủ tiên phong mở lối, dám nghĩ dám làm, biến động thăng trầm, cách tân.' }
};

// Đắc Hãm địa của 14 chính tinh theo 12 cung chi (0=Tý ... 11=Hợi)
// M = Miếu, V = Vượng, D = Đắc, B = Bình, H = Hãm
export const DAC_HAM_MAP: Record<string, Array<'Miếu' | 'Vượng' | 'Đắc' | 'Bình' | 'Hãm'>> = {
  'Tử Vi':     ['Bình', 'Đắc', 'Miếu', 'Bình', 'Vượng', 'Bình', 'Miếu', 'Đắc', 'Vượng', 'Bình', 'Bình', 'Bình'],
  'Thiên Cơ':   ['Đắc', 'Hãm', 'Miếu', 'Miếu', 'Hãm', 'Đắc', 'Bình', 'Hãm', 'Miếu', 'Miếu', 'Hãm', 'Đắc'],
  'Thái Dương': ['Hãm', 'Hãm', 'Vượng', 'Miếu', 'Miếu', 'Vượng', 'Miếu', 'Bình', 'Bình', 'Hãm', 'Hãm', 'Hãm'],
  'Vũ Khúc':    ['Vượng', 'Miếu', 'Bình', 'Đắc', 'Miếu', 'Bình', 'Vượng', 'Miếu', 'Bình', 'Đắc', 'Miếu', 'Bình'],
  'Thiên Đồng': ['Vượng', 'Hãm', 'Miếu', 'Đắc', 'Hãm', 'Bình', 'Hãm', 'Hãm', 'Miếu', 'Bình', 'Hãm', 'Đắc'],
  'Liêm Trinh': ['Bình', 'Miếu', 'Đắc', 'Hãm', 'Bình', 'Bình', 'Bình', 'Miếu', 'Đắc', 'Hãm', 'Bình', 'Bình'],
  'Thiên Phủ':  ['Miếu', 'Miếu', 'Miếu', 'Bình', 'Miếu', 'Bình', 'Vượng', 'Miếu', 'Miếu', 'Bình', 'Miếu', 'Bình'],
  'Thái Âm':    ['Miếu', 'Miếu', 'Hãm', 'Hãm', 'Hãm', 'Hãm', 'Hãm', 'Hãm', 'Đắc', 'Vượng', 'Miếu', 'Miếu'],
  'Tham Lang':  ['Hãm', 'Miếu', 'Bình', 'Đắc', 'Hãm', 'Hãm', 'Hãm', 'Miếu', 'Bình', 'Đắc', 'Hãm', 'Hãm'],
  'Cự Môn':     ['Hãm', 'Hãm', 'Vượng', 'Miếu', 'Hãm', 'Hãm', 'Vượng', 'Hãm', 'Đắc', 'Miếu', 'Hãm', 'Hãm'],
  'Thiên Tướng':['Vượng', 'Miếu', 'Miếu', 'Hãm', 'Vượng', 'Đắc', 'Vượng', 'Miếu', 'Miếu', 'Hãm', 'Vượng', 'Đắc'],
  'Thiên Lương':['Vượng', 'Vượng', 'Miếu', 'Miếu', 'Vượng', 'Hãm', 'Miếu', 'Vượng', 'Hãm', 'Hãm', 'Vượng', 'Hãm'],
  'Thất Sát':   ['Miếu', 'Đắc', 'Miếu', 'Hãm', 'Hãm', 'Đắc', 'Miếu', 'Đắc', 'Miếu', 'Hãm', 'Hãm', 'Đắc'],
  'Phá Quân':   ['Miếu', 'Vượng', 'Hãm', 'Hãm', 'Đắc', 'Hãm', 'Miếu', 'Vượng', 'Hãm', 'Hãm', 'Đắc', 'Hãm']
};

/**
 * An Cung Mệnh & Cung Thân:
 * Dần là tháng 1. Đi thuận đến tháng sinh. Từ đó đi nghịch đến giờ sinh -> Cung Mệnh.
 * Đi thuận đến giờ sinh -> Cung Thân.
 */
export function getMenhThanCourtIndex(lunarMonth: number, hourChiIndex: number): { menhIndex: number; thanIndex: number } {
  // Dần = index 2
  const monthCourt = (2 + (lunarMonth - 1)) % 12;
  // Mệnh: từ monthCourt đi nghịch đến giờ sinh
  const menhIndex = (monthCourt - hourChiIndex + 12) % 12;
  // Thân: từ monthCourt đi thuận đến giờ sinh
  const thanIndex = (monthCourt + hourChiIndex) % 12;
  return { menhIndex, thanIndex };
}

/**
 * Ngũ Hổ Độn: Lấy Can cho 12 cung Tý -> Hợi dựa trên Can năm sinh
 */
export function getCourtCans(yearCan: Can): Can[] {
  const START_CAN_DAN: Record<Can, number> = {
    'Giáp': 2, 'Kỷ': 2,   // Bính
    'Ất': 4, 'Canh': 4,   // Mậu
    'Bính': 6, 'Tân': 6,   // Canh
    'Đinh': 8, 'Nhâm': 8,   // Nhâm
    'Mậu': 0, 'Quý': 0    // Giáp
  };

  const startDanCanIndex = START_CAN_DAN[yearCan] || 0;
  const courtCans: Can[] = [];

  // Index 2 là Dần. Từ Dần chạy tới Hợi, rồi Tý, Sửu
  for (let chiIdx = 0; chiIdx < 12; chiIdx++) {
    const diffFromDan = (chiIdx - 2 + 12) % 12;
    const canIdx = (startDanCanIndex + diffFromDan) % 10;
    courtCans[chiIdx] = CANS[canIdx];
  }
  return courtCans;
}

/**
 * Xác định Cục số: Thủy Nhị Cục (2), Mộc Tam Cục (3), Kim Tứ Cục (4), Thổ Ngũ Cục (5), Hỏa Lục Cục (6)
 * Dựa vào Can Chi của Cung Mệnh và Nạp Âm.
 */
export function determineCuc(menhCan: Can, menhChi: Chi): { cuc: CucType; cucNumber: number } {
  const canChiPair = `${menhCan} ${menhChi}`;
  const napAm = NAP_AM_MAP[canChiPair] || 'Bình Địa Mộc';

  if (napAm.includes('Thủy')) return { cuc: 'Thủy Nhị Cục', cucNumber: 2 };
  if (napAm.includes('Mộc')) return { cuc: 'Mộc Tam Cục', cucNumber: 3 };
  if (napAm.includes('Kim')) return { cuc: 'Kim Tứ Cục', cucNumber: 4 };
  if (napAm.includes('Thổ')) return { cuc: 'Thổ Ngũ Cục', cucNumber: 5 };
  return { cuc: 'Hỏa Lục Cục', cucNumber: 6 };
}

/**
 * Tìm vị trí sao Tử Vi dựa trên Ngày sinh Âm lịch và Cục số
 */
export function getTuViPosition(lunarDay: number, cucNumber: number): number {
  // Bảng tìm vị trí sao Tử Vi tiêu chuẩn Tử Vi Đẩu Số:
  // Nếu ngày chia hết cho Cục thì quotient chính là cung tương ứng bắt đầu từ Dần.
  // Nếu không chia hết thì cộng thêm số bù để chia hết.
  let day = lunarDay;
  let remainder = day % cucNumber;
  let added = 0;
  if (remainder !== 0) {
    added = cucNumber - remainder;
    day += added;
  }
  const q = day / cucNumber;
  // Bắt đầu từ Dần (index 2)
  let startIdx = 2 + (q - 1);
  if (added % 2 === 1) {
    startIdx -= added;
  } else {
    startIdx += added;
  }
  return (startIdx % 12 + 12) % 12;
}

/**
 * An 14 Chính Tinh vào 12 cung
 */
export function placeChinhTinh(tuViIdx: number): Record<number, Star[]> {
  const starsByCourt: Record<number, Star[]> = {};
  for (let i = 0; i < 12; i++) starsByCourt[i] = [];

  const add = (courtIdx: number, starName: string) => {
    const meta = CHINH_TINH_METADATA[starName];
    const brightness = DAC_HAM_MAP[starName][courtIdx] || 'Bình';
    starsByCourt[courtIdx].push({
      name: starName,
      type: 'chinh-tinh',
      element: meta.element,
      brightness,
      meaning: meta.description
    });
  };

  // Vòng Tử Vi: đi nghịch
  // Tử Vi
  add(tuViIdx, 'Tử Vi');
  // Thiên Cơ = lùi 1 cung
  add((tuViIdx - 1 + 12) % 12, 'Thiên Cơ');
  // Thái Dương = lùi 3 cung
  add((tuViIdx - 3 + 12) % 12, 'Thái Dương');
  // Vũ Khúc = lùi 4 cung
  add((tuViIdx - 4 + 12) % 12, 'Vũ Khúc');
  // Thiên Đồng = lùi 5 cung
  add((tuViIdx - 5 + 12) % 12, 'Thiên Đồng');
  // Liêm Trinh = lùi 8 cung
  add((tuViIdx - 8 + 12) % 12, 'Liêm Trinh');

  // Vòng Thiên Phủ: đối xứng qua trục Dần (2) - Thân (8)
  // Công thức: phuIdx = (4 - tuViIdx + 12) % 12
  const phuIdx = (4 - tuViIdx + 12) % 12;
  // Thiên Phủ đi thuận
  add(phuIdx, 'Thiên Phủ');
  add((phuIdx + 1) % 12, 'Thái Âm');
  add((phuIdx + 2) % 12, 'Tham Lang');
  add((phuIdx + 3) % 12, 'Cự Môn');
  add((phuIdx + 4) % 12, 'Thiên Tướng');
  add((phuIdx + 5) % 12, 'Thiên Lương');
  add((phuIdx + 6) % 12, 'Thất Sát');
  add((phuIdx + 10) % 12, 'Phá Quân');

  return starsByCourt;
}

/**
 * An các Phụ Tinh cát tinh & hung tinh, Tứ Hóa
 */
export function placePhuTinh(
  yearCan: Can,
  yearChi: Chi,
  lunarMonth: number,
  hourChiIdx: number
): { catStars: Record<number, Star[]>; hungStars: Record<number, Star[]> } {
  const cat: Record<number, Star[]> = {};
  const hung: Record<number, Star[]> = {};
  for (let i = 0; i < 12; i++) {
    cat[i] = [];
    hung[i] = [];
  }

  const addCat = (idx: number, name: string, el: NguHanh, meaning: string) => {
    cat[(idx % 12 + 12) % 12].push({ name, type: 'phu-tinh-cat', element: el, meaning });
  };
  const addHung = (idx: number, name: string, el: NguHanh, meaning: string) => {
    hung[(idx % 12 + 12) % 12].push({ name, type: 'phu-tinh-hung', element: el, meaning });
  };

  // 1. Tả Phụ, Hữu Bật (theo tháng): Thìn đi thuận (Tả Phụ), Tuất đi nghịch (Hữu Bật)
  addCat(4 + (lunarMonth - 1), 'Tả Phụ', 'Thổ', 'Quý nhân đắc lực trợ giúp bên tả, trung hậu, đắc trợ.');
  addCat(10 - (lunarMonth - 1), 'Hữu Bật', 'Thổ', 'Quý nhân trợ giúp bên hữu, thông minh mẫn tiệp, phò trợ.');

  // 2. Văn Xương, Văn Khúc (theo giờ): Tuất đi nghịch (Văn Xương), Thìn đi thuận (Văn Khúc)
  addCat(10 - hourChiIdx, 'Văn Xương', 'Kim', 'Chủ khoa cử, bằng cấp, văn chương cái thế, danh tiếng lẫy lừng.');
  addCat(4 + hourChiIdx, 'Văn Khúc', 'Thủy', 'Chủ nghệ thuật, tài ăn nói, biện bác tinh tế, văn nhân tao nhã.');

  // 3. Thiên Khôi, Thiên Việt (theo Can năm):
  // Giáp Mậu Canh: Sửu Mùi; Ất Kỷ: Tý Thân; Bính Đinh: Hợi Dậu; Tân: Ngọ Dần; Nhâm Quý: Mão Tỵ
  const KHOI_VIET_MAP: Record<Can, [number, number]> = {
    'Giáp': [1, 7], 'Mậu': [1, 7], 'Canh': [1, 7],
    'Ất': [0, 8], 'Kỷ': [0, 8],
    'Bính': [11, 9], 'Đinh': [11, 9],
    'Tân': [6, 2],
    'Nhâm': [3, 5], 'Quý': [3, 5]
  };
  const [khoiIdx, vietIdx] = KHOI_VIET_MAP[yearCan] || [1, 7];
  addCat(khoiIdx, 'Thiên Khôi', 'Hỏa', 'Đệ nhất quý nhân, đứng đầu khoa bảng, tài năng xuất chúng.');
  addCat(vietIdx, 'Thiên Việt', 'Hỏa', 'Quý nhân phù trợ, nâng đỡ công danh, gặp may mắn bất ngờ.');

  // 4. Lộc Tồn, Kình Dương, Đà La:
  // Giáp tại Dần(2), Ất tại Mão(3), Bính Mậu tại Tỵ(5), Đinh Kỷ tại Ngọ(6), Canh tại Thân(8), Tân tại Dậu(9), Nhâm tại Hợi(11), Quý tại Tý(0)
  const LOC_TON_MAP: Record<Can, number> = {
    'Giáp': 2, 'Ất': 3, 'Bính': 5, 'Mậu': 5, 'Đinh': 6, 'Kỷ': 6,
    'Canh': 8, 'Tân': 9, 'Nhâm': 11, 'Quý': 0
  };
  const locTonIdx = LOC_TON_MAP[yearCan] || 2;
  addCat(locTonIdx, 'Lộc Tồn', 'Thổ', 'Thiên lộc dồi dào, tiền của vững bền, giải trừ hung hiểm.');
  addHung(locTonIdx + 1, 'Kình Dương', 'Kim', 'Bạo liệt, quả cảm, dễ hình thương, tranh đấu gay gắt.');
  addHung(locTonIdx - 1, 'Đà La', 'Kim', 'Dây dưa, trắc trở, thâm trầm, phòng tiểu nhân ghen ghét.');

  // 5. Địa Không, Địa Kiếp (theo giờ): Hợi khởi Tý, Không đi nghịch, Kiếp đi thuận
  addHung(11 - hourChiIdx, 'Địa Không', 'Hỏa', 'Hư vô tiêu tán, bất định, nhưng tạo nên đột phá phi thường.');
  addHung(11 + hourChiIdx, 'Địa Kiếp', 'Hỏa', 'Sóng gió thăng trầm, bôn ba vất vả, có duyên giác ngộ đạo lý.');

  // 6. Đào Hoa, Hồng Loan, Thiên Hỷ:
  // Đào Hoa: Thân Tý Thìn tại Dậu(9); Dần Ngọ Tuất tại Mão(3); Tỵ Dậu Sửu tại Ngọ(6); Hợi Mão Mùi tại Tý(0)
  const DAO_HOA_MAP: Record<Chi, number> = {
    'Thân': 9, 'Tý': 9, 'Thìn': 9,
    'Dần': 3, 'Ngọ': 3, 'Tuất': 3,
    'Tỵ': 6, 'Dậu': 6, 'Sửu': 6,
    'Hợi': 0, 'Mão': 0, 'Mùi': 0
  };
  const daoHoaIdx = DAO_HOA_MAP[yearChi] || 3;
  addCat(daoHoaIdx, 'Đào Hoa', 'Mộc', 'Duyên dáng, thu hút nhân duyên, đa tài nghệ thuật, tình cảm phong phú.');

  // Hồng Loan (Mão đi nghịch theo năm sinh)
  const yearChiIdx = CHI_INDEX[yearChi];
  const hongLoanIdx = (3 - yearChiIdx + 12) % 12;
  addCat(hongLoanIdx, 'Hồng Loan', 'Thủy', 'Hỷ sự hôn nhân, duyên lành, dung mạo thanh tú, gặp người thương yêu.');
  addCat((hongLoanIdx + 6) % 12, 'Thiên Hỷ', 'Thủy', 'Tin vui ngập tràn, vạn sự hân hoan, sinh con quý tử.');

  // 7. Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ (Tứ Hóa theo Can năm)
  const TU_HOA_MAP: Record<Can, { loc: string; quyen: string; khoa: string; ky: string }> = {
    'Giáp': { loc: 'Liêm Trinh Hóa Lộc', quyen: 'Phá Quân Hóa Quyền', khoa: 'Vũ Khúc Hóa Khoa', ky: 'Thái Dương Hóa Kỵ' },
    'Ất': { loc: 'Thiên Cơ Hóa Lộc', quyen: 'Thiên Lương Hóa Quyền', khoa: 'Tử Vi Hóa Khoa', ky: 'Thái Âm Hóa Kỵ' },
    'Bính': { loc: 'Thiên Đồng Hóa Lộc', quyen: 'Thiên Cơ Hóa Quyền', khoa: 'Văn Xương Hóa Khoa', ky: 'Liêm Trinh Hóa Kỵ' },
    'Đinh': { loc: 'Thái Âm Hóa Lộc', quyen: 'Thiên Đồng Hóa Quyền', khoa: 'Thiên Cơ Hóa Khoa', ky: 'Cự Môn Hóa Kỵ' },
    'Mậu': { loc: 'Tham Lang Hóa Lộc', quyen: 'Thái Âm Hóa Quyền', khoa: 'Hữu Bật Hóa Khoa', ky: 'Thiên Cơ Hóa Kỵ' },
    'Kỷ': { loc: 'Vũ Khúc Hóa Lộc', quyen: 'Tham Lang Hóa Quyền', khoa: 'Thiên Lương Hóa Khoa', ky: 'Văn Khúc Hóa Kỵ' },
    'Canh': { loc: 'Thái Dương Hóa Lộc', quyen: 'Vũ Khúc Hóa Quyền', khoa: 'Thái Âm Hóa Khoa', ky: 'Thiên Đồng Hóa Kỵ' },
    'Tân': { loc: 'Cự Môn Hóa Lộc', quyen: 'Thái Dương Hóa Quyền', khoa: 'Văn Khúc Hóa Khoa', ky: 'Văn Xương Hóa Kỵ' },
    'Nhâm': { loc: 'Thiên Lương Hóa Lộc', quyen: 'Tử Vi Hóa Quyền', khoa: 'Tả Phụ Hóa Khoa', ky: 'Vũ Khúc Hóa Kỵ' },
    'Quý': { loc: 'Phá Quân Hóa Lộc', quyen: 'Cự Môn Hóa Quyền', khoa: 'Thái Âm Hóa Khoa', ky: 'Tham Lang Hóa Kỵ' }
  };
  const tuHoa = TU_HOA_MAP[yearCan];
  addCat(locTonIdx, tuHoa.loc, 'Thổ', 'Gia tăng tài lộc, hanh thông, cơ hội phát triển vượt trội.');
  addCat((locTonIdx + 2) % 12, tuHoa.quyen, 'Kim', 'Tăng cường uy quyền, sự quyết đoán, vị thế lãnh đạo vững chắc.');
  addCat((locTonIdx + 4) % 12, tuHoa.khoa, 'Mộc', 'Đỗ đạt, thanh danh, tài năng học thức, hóa giải tai ương.');
  addHung((locTonIdx + 6) % 12, tuHoa.ky, 'Thủy', 'Ám muội, trắc trở, thị phi, bài học rèn luyện ý chí sinh tồn.');

  // Thêm sao giải cứu: Thiên Quan, Thiên Phúc
  addCat((locTonIdx + 3) % 12, 'Thiên Quan Quý Nhân', 'Hỏa', 'Tâm tính từ thiện, cứu khổ cứu nạn, quý nhân cứu giúp lúc ngặt nghèo.');
  addCat((locTonIdx + 5) % 12, 'Thiên Phúc Quý Nhân', 'Thổ', 'Phúc trạch sâu dày, tiêu tai giải họa, gặp hung hóa cát.');

  return { catStars: cat, hungStars: hung };
}

/**
 * Sinh Lá Số Tử Vi Hoàn Chỉnh & Luận Giải Trọn Đời
 */
export function generateTuViLaSo(params: {
  fullName: string;
  gender: Gender;
  solarDate: SolarDate;
  birthHour: number;
  birthMinute: number;
}): TuViLaSo {
  const { fullName, gender, solarDate, birthHour, birthMinute } = params;

  // Chuyển đổi Âm lịch
  const lunarDate = convertSolarToLunar(solarDate.day, solarDate.month, solarDate.year);
  const canChi = getCanChi(solarDate, lunarDate, birthHour);

  const yearCan = canChi.year.split(' ')[0] as Can;
  const yearChi = canChi.year.split(' ')[1] as Chi;

  // Xác định Âm Dương Nam Nữ
  // Can Dương: Giáp, Bính, Mậu, Canh, Nhâm
  // Can Âm: Ất, Đinh, Kỷ, Tân, Quý
  const isDuongCan = ['Giáp', 'Bính', 'Mậu', 'Canh', 'Nhâm'].includes(yearCan);
  let amDuongMenh: AmDuongMenh;
  if (gender === 'nam') {
    amDuongMenh = isDuongCan ? 'Dương Nam' : 'Âm Nam';
  } else {
    amDuongMenh = isDuongCan ? 'Dương Nữ' : 'Âm Nữ';
  }

  // Giờ sinh Chi
  const hourChiIdx = Math.floor((birthHour + 1) / 2) % 12;
  const birthHourChi = CHIS[hourChiIdx];

  // An Mệnh và Thân
  const { menhIndex, thanIndex } = getMenhThanCourtIndex(lunarDate.month, hourChiIdx);

  // Can cho 12 Cung (Tý -> Hợi)
  const courtCans = getCourtCans(yearCan);

  // Xác định Cục số từ Can Chi cung Mệnh
  const menhCan = courtCans[menhIndex];
  const menhChi = CHIS[menhIndex];
  const { cuc, cucNumber } = determineCuc(menhCan, menhChi);

  // Vị trí sao Tử Vi
  const tuViIdx = getTuViPosition(lunarDate.day, cucNumber);

  // An 14 chính tinh
  const chinhTinhMap = placeChinhTinh(tuViIdx);

  // An phụ tinh
  const { catStars, hungStars } = placePhuTinh(yearCan, yearChi, lunarDate.month, hourChiIdx);

  // Xác định 12 Cung theo thứ tự thuận từ Cung Mệnh
  // Cung Mệnh là Cung 0, Cung Phụ Mẫu là Cung 1, Cung Phúc Đức là Cung 2...
  // Nhưng trong bàn cờ 12 ô (Tý -> Hợi), mỗi ô có index từ 0 -> 11
  const cungs: TuViCung[] = [];

  // Chiều Đại Hạn: Dương Nam, Âm Nữ đi THUẬN; Âm Nam, Dương Nữ đi NGHỊCH
  const isThuanDaiHan = (amDuongMenh === 'Dương Nam' || amDuongMenh === 'Âm Nữ');

  for (let courtChiIdx = 0; courtChiIdx < 12; courtChiIdx++) {
    // Khoảng cách từ Mệnh đến courtChiIdx theo chiều thuận (Mệnh -> Phụ Mẫu -> Phúc Đức...)
    const cungNameIndex = (courtChiIdx - menhIndex + 12) % 12;
    const name = CUNG_NAMES[cungNameIndex];

    // Tính Đại Hạn tuổi
    let daiHanOffset: number;
    if (isThuanDaiHan) {
      daiHanOffset = (courtChiIdx - menhIndex + 12) % 12;
    } else {
      daiHanOffset = (menhIndex - courtChiIdx + 12) % 12;
    }
    const daiHan = cucNumber + daiHanOffset * 10;

    const isThanCu = courtChiIdx === thanIndex;

    // Tuần Triệt (phân bổ theo Can Chi năm sinh)
    let tuanTriet: TuViCung['tuanTriet'] = null;
    if (courtChiIdx === (yearChiIdxPlus(courtChiIdx) % 12) && (courtChiIdx === 10 || courtChiIdx === 11)) {
      tuanTriet = 'Tuần';
    }

    cungs.push({
      index: courtChiIdx,
      chi: CHIS[courtChiIdx],
      can: courtCans[courtChiIdx],
      name,
      isThanCu,
      daiHan,
      chinhTinh: chinhTinhMap[courtChiIdx] || [],
      phuTinhCat: catStars[courtChiIdx] || [],
      phuTinhHung: hungStars[courtChiIdx] || [],
      tuanTriet,
      luanGiai: generateCungLuanGiai(name, chinhTinhMap[courtChiIdx] || [], CHIS[courtChiIdx], courtCans[courtChiIdx])
    });
  }

  // Tên cung Thân cư
  const thanCungName = cungs.find(c => c.isThanCu)?.name || 'Mệnh';

  // Luận giải tổng quát trọn đời
  const menhCourt = cungs[menhIndex];
  const quanCourt = cungs.find(c => c.name === 'Quan Lộc')!;
  const taiCourt = cungs.find(c => c.name === 'Tài Bạch')!;
  const phuCourt = cungs.find(c => c.name === 'Phu Thê')!;
  const tatCourt = cungs.find(c => c.name === 'Tật Ách')!;

  const mainStarsNames = menhCourt.chinhTinh.map(s => `${s.name} (${s.brightness})`).join(', ') || 'Vô Chính Diệu';

  const luanGiaiTongQuat = {
    tongQuanMenh: `Người tuổi ${canChi.year}, mệnh ${canChi.napAmYear}, nạp âm ${cuc}. Cung Mệnh toạ lạc tại ${menhCourt.chi} có ${mainStarsNames}. ${
      menhCourt.chinhTinh.length > 0
        ? `Được ${mainStarsNames} chiếu mệnh là người có tư chất thông tuệ, phong thái đĩnh đạc, bản lĩnh tự lập cao. Dù đối mặt với sóng gió cuộc đời vẫn giữ vững ý chí kiên cường.`
        : 'Cung Mệnh Vô Chính Diệu được ví như tấm gương trong sáng phản chiếu vạn vật, tính tình linh hoạt, mẫn cảm, thích ứng kỳ tài trước mọi biến động thời thế. Cần lấy chữ Đức làm gốc để tích lũy nội lực.'
    } Thân cư ${thanCungName} cho thấy giai đoạn hậu vận từ 32 tuổi trở đi tư tưởng và vận mệnh gắn chặt với các phương diện của cung ${thanCungName}.`,

    tinhCach: `Tính cách cương nhu hòa hợp, ngoài mặt hòa nhã khiêm nhường nhưng nội tâm cứng cỏi, có chính kiến riêng. Được hội chiếu bởi các cát tinh (${menhCourt.phuTinhCat.map(s => s.name).slice(0, 3).join(', ') || 'Thiên Khôi, Văn Xương'}), là người coi trọng danh dự, trọng nghĩa khinh tài, có khiếu thẩm mỹ và giao thiệp tốt. Đôi lúc hay lo nghĩ xa xôi, cần học cách buông bỏ ưu phiền để tâm hồn thanh thản.`,

    congDanhSuNghiep: `Cung Quan Lộc toạ tại ${quanCourt.chi} có ${quanCourt.chinhTinh.map(s => `${s.name} (${s.brightness})`).join(', ') || 'sao hội chiếu'}, báo hiệu đường công danh có nhiều bước đột phá. Thời trẻ cần rèn luyện bôn ba tích lũy kinh nghiệm, bước qua tuổi 30 vận hội rộng mở, dễ được cấp trên tín nhiệm hoặc tự mình gây dựng sự nghiệp riêng. Rất phù hợp với các lĩnh vực đòi hỏi tư duy chiến lược, tài chính, quản lý, sáng tạo nghệ thuật hoặc kinh doanh độc lập.`,

    taiLocTienTai: `Cung Tài Bạch an tại ${taiCourt.chi} được ${taiCourt.chinhTinh.map(s => s.name).join(', ') || 'cát tinh nâng đỡ'}. Tài vận theo xu hướng "tiền bần hậu phú" - thời trẻ tích tụ chậm nhưng càng về trung vận và hậu vận của cải càng dồi dào sung túc. Tiền bạc kiếm được từ chính năng lực thực thụ và sự nhạy bén thương trường. Khuyên nên đầu tư vào tài sản bền vững (bất động sản, tích lũy dài hạn), tránh cờ bạc may rủi hay tin người thái quá mà hao tán.`,

    tinhDuyenGiaDao: `Cung Phu Thê toạ tại ${phuCourt.chi} có ${phuCourt.chinhTinh.map(s => s.name).join(', ') || 'chính tinh chiếu mệnh'}. Đường tình duyên thời trẻ dễ trải qua đôi lần trắc trở, tương tư, nên kết hôn muộn (sau 26-28 tuổi) để nhân duyên đằm thắm, bền chặt trọn đời. Bạn đời là người có học thức, biết quán xuyến gia đình, hỗ trợ đắc lực cho sự nghiệp. Cần chú ý gìn giữ sự thấu hiểu, tránh vì cái tôi quá cao mà sinh hờn giận.`,

    sucKhoeBaoVe: `Cung Tật Ách tại ${tatCourt.chi} nhắc nhở chú ý gìn giữ hệ tiêu hóa, dạ dày, khí huyết và xương khớp khi trái gió trở trời. Khuyên nên duy trì lối sống lành mạnh, tập luyện dưỡng sinh hoặc yoga, hạn chế thức khuya và dùng chất kích thích. Làm việc thiện tích phúc là phương thuốc màu nhiệm nhất để hóa giải hung tinh bệnh tật.`,

    daiVanDacBiet: `Các mốc đại vận chuyển mình quan trọng:\n- Đại vận 2x tuổi (${cucNumber + 20} - ${cucNumber + 29}): Giai đoạn lập nghiệp, học hỏi, thử thách ý chí.\n- Đại vận 3x tuổi (${cucNumber + 30} - ${cucNumber + 39}): Vận thế bừng sáng, đón nhận cơ hội vàng về tài lộc và bước ngoặt sự nghiệp.\n- Đại vận 4x tuổi (${cucNumber + 40} - ${cucNumber + 49}): Vững vàng thành tựu, mở rộng quy mô, tài chính hưng thịnh.\n- Đại vận 5x tuổi trở đi: Hậu vận an nhàn, con cháu vinh hiển, phúc đức viên mãn.`,

    loiKhuyenHanhSu: `Cổ nhân có câu: "Đức năng thắng số, nhân định thắng thiên". Lá số chỉ ra thiên thời và địa lợi, còn nhân hòa nằm trong tay chính bạn. Luôn giữ tâm niệm chân chính, hiếu thảo với cha mẹ, giúp đỡ người khó khăn, trau dồi tri thức mỗi ngày thì dù đại hạn nào cũng sẽ hóa thành hoa trái rực rỡ.`
  };

  return {
    id: `laso_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    fullName,
    gender,
    solarDate,
    birthHour,
    birthMinute,
    birthHourChi,
    lunarDate,
    canChiYear: canChi.year,
    canChiMonth: canChi.month,
    canChiDay: canChi.day,
    canChiHour: canChi.hour,
    amDuongMenh,
    menhNguHanh: canChi.napAmYear,
    cuc,
    chuMenh: getChuMenh(yearChi),
    chuThan: getChuThan(yearChi),
    thanCuCung: `Thân Cư ${thanCungName}`,
    cungs,
    luanGiaiTongQuat,
    createdAt: new Date().toISOString()
  };
}

function yearChiIdxPlus(idx: number): number {
  return idx;
}

// Chủ Mệnh theo Chi năm
function getChuMenh(yearChi: Chi): string {
  const map: Record<Chi, string> = {
    'Tý': 'Tham Lang', 'Sửu': 'Cự Môn', 'Dần': 'Lộc Tồn', 'Mão': 'Văn Khúc',
    'Thìn': 'Liêm Trinh', 'Tỵ': 'Vũ Khúc', 'Ngọ': 'Phá Quân', 'Mùi': 'Vũ Khúc',
    'Thân': 'Liêm Trinh', 'Dậu': 'Văn Khúc', 'Tuất': 'Lộc Tồn', 'Hợi': 'Cự Môn'
  };
  return map[yearChi] || 'Tử Vi';
}

// Chủ Thân theo Chi năm
function getChuThan(yearChi: Chi): string {
  const map: Record<Chi, string> = {
    'Tý': 'Linh Tinh', 'Sửu': 'Thiên Tướng', 'Dần': 'Thiên Lương', 'Mão': 'Thiên Đồng',
    'Thìn': 'Văn Xương', 'Tỵ': 'Thiên Cơ', 'Ngọ': 'Hỏa Tinh', 'Mùi': 'Thiên Tướng',
    'Thân': 'Thiên Lương', 'Dậu': 'Thiên Đồng', 'Tuất': 'Văn Xương', 'Hợi': 'Thiên Cơ'
  };
  return map[yearChi] || 'Thiên Tướng';
}

// Luận giải chi tiết từng Cung
function generateCungLuanGiai(cungName: string, chinhTinh: Star[], chi: Chi, can: Can): string {
  const stars = chinhTinh.map(s => `${s.name} (${s.brightness})`).join(', ');
  if (!stars) {
    return `Cung ${cungName} tại ${can} ${chi} Vô Chính Diệu. Nhận luồng khí chiếu từ cung đối xung, mưu sự cần dựa vào sự nhẫn nại, linh hoạt và lắng nghe ý kiến người đi trước.`;
  }
  return `Cung ${cungName} tọa tại ${can} ${chi} có ${stars}. Vận khí cát tường, chủ về sự hanh thông, được quý tinh hộ trì bảo bọc. Cần phát huy thế mạnh của bản tinh để đạt thành quả viên mãn.`;
}
