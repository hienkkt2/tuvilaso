/**
 * VIP Engine - High-End Astrology, 12-Month Fortune, Compatibility & Palmistry
 */

import { CompatibilityResult, MonthFortune, PalmistryFeature } from '../types/horoscope';
import { CANS, CHIS, NAP_AM_MAP } from './lunarCalendar';

// Cung Phi Bát Trạch mapping
const CUNG_PHI_NAM = ['Khảm', 'Ly', 'Cấn', 'Đoài', 'Càn', 'Khôn', 'Tốn', 'Chấn', 'Khôn'];
const CUNG_PHI_NU = ['Cấn', 'Càn', 'Đoài', 'Cấn', 'Ly', 'Khảm', 'Khôn', 'Chấn', 'Tốn'];

export function calculateCungPhi(birthYear: number, gender: 'nam' | 'nu'): string {
  // Tính tổng các chữ số của năm sinh
  let sum = String(birthYear).split('').reduce((acc, digit) => acc + Number(digit), 0);
  while (sum > 9) {
    sum = String(sum).split('').reduce((acc, digit) => acc + Number(digit), 0);
  }
  if (gender === 'nam') {
    const idx = (11 - sum) % 9;
    return CUNG_PHI_NAM[idx] || 'Càn';
  } else {
    const idx = (4 + sum) % 9;
    return CUNG_PHI_NU[idx] || 'Khôn';
  }
}

// Bát Quái phối ngẫu (Bát Trạch)
const BAT_TRACH_COMBINATIONS: Record<string, { rating: CompatibilityResult['rating']; isGood: boolean; desc: string }> = {
  'Càn_Càn': { rating: 'Phục Vị', isGood: true, desc: 'Bình yên, hòa thuận, củng cố sức mạnh gia đạo.' },
  'Càn_Đoài': { rating: 'Sinh Khí', isGood: true, desc: 'Thu hút tài lộc, danh tiếng, thăng quan tiến chức, rất tốt.' },
  'Càn_Cấn': { rating: 'Thiên Y', isGood: true, desc: 'Cải thiện sức khỏe, thọ trường, quý nhân nâng đỡ.' },
  'Càn_Khôn': { rating: 'Diên Niên', isGood: true, desc: 'Củng cố các mối quan hệ, tình yêu bền vững, gia đạo an vui.' },
  'Càn_Khảm': { rating: 'Lục Sát', isGood: false, desc: 'Xáo trộn quan hệ tình cảm, thù hận, kiện tụng, tai nạn.' },
  'Càn_Chấn': { rating: 'Ngũ Quỷ', isGood: false, desc: 'Mất nguồn thu nhập, mất việc làm, cãi lộn thị phi.' },
  'Càn_Tốn': { rating: 'Họa Hại', isGood: false, desc: 'Không may mắn, thị phi, thất bại trong làm ăn.' },
  'Càn_Ly': { rating: 'Tuyệt Mạng', isGood: false, desc: 'Phá sản, bệnh tật chết người, trắc trở lớn (cần hóa giải).' },

  'Khôn_Khôn': { rating: 'Phục Vị', isGood: true, desc: 'Vững chãi, hòa thuận, tài chính tích lũy.' },
  'Khôn_Cấn': { rating: 'Sinh Khí', isGood: true, desc: 'Đại cát, tiền tài phát đạt, sinh con thông minh.' },
  'Khôn_Đoài': { rating: 'Thiên Y', isGood: true, desc: 'Gia đạo êm ấm, sức khỏe dồi dào, bệnh tật tiêu trừ.' },
  'Khôn_Càn': { rating: 'Diên Niên', isGood: true, desc: 'Hạnh phúc trọn vẹn, vợ chồng hòa thuận tương kính.' },
  'Khôn_Chấn': { rating: 'Họa Hại', isGood: false, desc: 'Bất hòa, tài sản hao hụt, khó tích lũy.' },
  'Khôn_Tốn': { rating: 'Ngũ Quỷ', isGood: false, desc: 'Nội bộ nghi kỵ, dễ bị tiểu nhân gièm pha.' },
  'Khôn_Khảm': { rating: 'Tuyệt Mạng', isGood: false, desc: 'Xung khắc nặng, cần sinh con hợp tuổi hóa giải.' },
  'Khôn_Ly': { rating: 'Lục Sát', isGood: false, desc: 'Thị phi, tai bay vạ gió, cần tu tâm dưỡng tính.' },
};

/**
 * 1. VIP: Dự đoán vận trình chi tiết 12 Tháng trong năm
 */
export function generate12MonthsFortune(yearCanChi: string, menhNguHanh: string, birthYear: number): MonthFortune[] {
  const MONTH_NAMES = [
    'Tháng Giêng (Dần)', 'Tháng Hai (Mão)', 'Tháng Ba (Thìn)',
    'Tháng Tư (Tỵ)', 'Tháng Năm (Ngọ)', 'Tháng Sáu (Mùi)',
    'Tháng Bảy (Thân)', 'Tháng Tám (Dậu)', 'Tháng Chín (Tuất)',
    'Tháng Mười (Hợi)', 'Tháng Mười Một (Tý)', 'Tháng Chạp (Sửu)'
  ];

  const FORTUNES_DATA = [
    {
      title: 'Khai Xuân Đắc Lộc • Khởi Sắc Đầu Năm',
      careerScore: 85,
      wealthScore: 80,
      loveScore: 90,
      summary: 'Tháng khởi đầu với nhiều cơ hội gặp gỡ đối tác quý nhân. Công việc hanh thông, gia đạo đón nhiều tin vui hỷ sự. Nên xuất hành hướng Đông Nam để nghênh đón Tài Thần.',
      goodEvents: ['Khai trương mở hàng', 'Ký hợp đồng mới', 'Du xuân cầu an', 'Gặp gỡ tri kỷ'],
      taboos: ['Cho vay mượn lớn không biên nhận', 'Nói lời bất hòa đầu xuân']
    },
    {
      title: 'Mộc Vượng Sinh Tài • Vận May Nảy Nở',
      careerScore: 78,
      wealthScore: 85,
      loveScore: 75,
      summary: 'Tài chính có dấu hiệu khởi sắc rõ rệt. Các khoản đầu tư trước đây bắt đầu sinh lời. Chú ý giữ gìn sức khỏe đường hô hấp khi thời tiết chuyển mùa.',
      goodEvents: ['Mở rộng kinh doanh', 'Học thêm kỹ năng mới', 'Mua sắm vật phẩm phong thủy'],
      taboos: ['Đi lại đường khuya một mình', 'Tranh cãi với đồng nghiệp']
    },
    {
      title: 'Thìn Thổ Trầm Tĩnh • Củng Cố Nền Móng',
      careerScore: 70,
      wealthScore: 68,
      loveScore: 72,
      summary: 'Khối lượng công việc tăng cao, áp lực nhiều. Đây là tháng cần kiên nhẫn tích lũy nội lực, chớ nên nóng vội nhảy việc hay mở rộng quy mô quá đà.',
      goodEvents: ['Kiểm tra sổ sách tài chính', 'Tu sửa nhà cửa, dọn dẹp', 'Làm từ thiện'],
      taboos: ['Đầu tư may rủi lướt sóng', 'Bảo lãnh tài chính cho người khác']
    },
    {
      title: 'Hỏa Khí Bừng Sáng • Đột Phá Công Danh',
      careerScore: 92,
      wealthScore: 88,
      loveScore: 80,
      summary: 'Tháng Đại Cát của bạn trong năm! Năng lượng tràn trề, ý tưởng sáng tạo được cấp trên đánh giá rất cao. Cơ hội thăng quan tiến chức hoặc chốt đơn hàng khủng.',
      goodEvents: ['Trình bày dự án lớn', 'Thi cử, phỏng vấn', 'Đàm phán tăng lương', 'Khai trương cơ sở mới'],
      taboos: ['Tự mãn coi thường đối thủ', 'Thức khuya làm việc kiệt sức']
    },
    {
      title: 'Ngọ Hỏa Cực Thịnh • Đề Phòng Hao Tài',
      careerScore: 75,
      wealthScore: 62,
      loveScore: 65,
      summary: 'Tiền vào nhiều nhưng chi tiêu cũng nhiều. Cần kiểm soát chi phí sinh hoạt và các khoản mua sắm bốc đồng. Tình cảm dễ sinh hờn giận vì những chuyện nhỏ nhặt.',
      goodEvents: ['Đi công tác xa', 'Tặng quà gắn kết người thương', 'Thể dục dưỡng sinh'],
      taboos: ['Cả tin người mới quen', 'Ký hợp đồng thiếu kiểm tra điều khoản']
    },
    {
      title: 'Mùi Thổ Điều Hòa • Bình Ổn Tài Lộc',
      careerScore: 80,
      wealthScore: 82,
      loveScore: 85,
      summary: 'Vận trình lấy lại sự cân bằng, tâm thế thư thái. Gia đạo êm ấm, có cơ hội đoàn tụ người thân từ xa trở về. Thích hợp cho các chuyến du lịch ngắn ngày nghỉ dưỡng.',
      goodEvents: ['Tổ chức tiệc gia đình', 'Nghỉ dưỡng phục hồi năng lượng', 'Bàn chuyện hôn nhân'],
      taboos: ['Tham gia vào chuyện thị phi thiên hạ', 'Ăn uống quá đà']
    },
    {
      title: 'Thân Kim Trợ Mệnh • Cẩn Trọng Tiểu Nhân',
      careerScore: 65,
      wealthScore: 70,
      loveScore: 60,
      summary: 'Tháng có sao Cô Thần chiếu nhẹ, đề phòng đồng nghiệp ghen ghét đố kỵ sau lưng. Nên làm việc kín đáo, khiêm nhường, không khoe khoang tài sản.',
      goodEvents: ['Đọc sách nghiên cứu sâu', 'Làm việc thiện giải nghiệp', 'Bảo dưỡng xe cộ'],
      taboos: ['Đầu tư bất động sản gấp gáp', 'Đi lại vùng sông nước hiểm trở']
    },
    {
      title: 'Thu Phân Trăng Sáng • Nhân Duyên Đơm Hoa',
      careerScore: 88,
      wealthScore: 90,
      loveScore: 95,
      summary: 'Tháng cát tường rực rỡ nhất về phương diện tình cảm và nhân duyên. Người độc thân dễ gặp ý trung nhân tâm đầu ý hợp; người có đôi tính chuyện trăm năm kết tóc.',
      goodEvents: ['Đính hôn, cưới hỏi', 'Khai trương, ra mắt sản phẩm', 'Mua vàng tích lũy'],
      taboos: ['Bội tín lời hứa', 'Ghen tuông vô cớ']
    },
    {
      title: 'Tuất Thổ Hội Tụ • Thu Hoạch Thành Quả',
      careerScore: 86,
      wealthScore: 89,
      loveScore: 82,
      summary: 'Các nỗ lực từ giữa năm bắt đầu kết trái ngọt ngào. Doanh thu tăng trưởng mạnh mẽ, công việc đi vào quỹ đạo ổn định tự động.',
      goodEvents: ['Thu hồi công nợ', 'Đầu tư dài hạn', 'Thưởng nóng bản thân và đội ngũ'],
      taboos: ['Chủ quan lơ là khâu chăm sóc khách hàng', 'Cho vay tiền nóng']
    },
    {
      title: 'Hợi Thủy Nhu Thuận • Vận Trình Êm Ả',
      careerScore: 79,
      wealthScore: 83,
      loveScore: 80,
      summary: 'Thời tiết chớm đông, vận thế ổn định vững vàng. Tâm tính an nhiên, thích hợp học hỏi thêm kiến thức phong thủy, tâm linh hoặc thiền định bồi bổ tinh thần.',
      goodEvents: ['Lập kế hoạch cho năm mới', 'Cúng tạ ơn cuối năm', 'Gặp gỡ tri kỷ'],
      taboos: ['Thao thức lo nghĩ vô cớ', 'Thay đổi chỗ ở đột ngột']
    },
    {
      title: 'Tý Thủy Giao Hòa • Tiền Tài Đổ Về',
      careerScore: 90,
      wealthScore: 94,
      loveScore: 88,
      summary: 'Dòng tiền cuối năm đổ về dồi dào, tiền thưởng và lợi nhuận kinh doanh đạt đỉnh. Công việc bận rộn nhưng tinh thần hưng phấn, đón nhận nhiều lời chúc mừng.',
      goodEvents: ['Tất niên, tổng kết năm', 'Ký kết hợp đồng dài hạn', 'Mua sắm tài sản lớn (nhà, xe)'],
      taboos: ['Uống nhiều bia rượu khi lái xe', 'Làm việc quá sức bỏ bữa']
    },
    {
      title: 'Sửu Thổ Viên Mãn • Đón Tết Thịnh Vượng',
      careerScore: 85,
      wealthScore: 92,
      loveScore: 92,
      summary: 'Tháng Chạp khép lại năm cũ trọn vẹn, phúc lộc dồi dào. Gia đạo sum vầy ấm cúng, chuẩn bị đón chào năm mới với tâm thế tự tin, hưng vượng vượt bậc.',
      goodEvents: ['Trang hoàng nhà cửa đón Tết', 'Mua sắm Tết sung túc', 'Thăm viếng chúc tết tổ tiên họ hàng'],
      taboos: ['Vay nợ vào những ngày cuối năm', 'To tiếng cãi vã trong gia đình']
    }
  ];

  return FORTUNES_DATA.map((data, idx) => ({
    month: idx + 1,
    canChi: MONTH_NAMES[idx],
    ...data
  }));
}

/**
 * 2. VIP: So Kèo Bát Tự & Hợp Hôn - Hợp Tác Làm Ăn (2 Người)
 */
export function calculateCompatibility(
  p1Name: string,
  p1Year: number,
  p1Gender: 'nam' | 'nu',
  p2Name: string,
  p2Year: number,
  p2Gender: 'nam' | 'nu'
): CompatibilityResult {
  // Can Chi 2 người
  const can1 = CANS[(p1Year + 6) % 10];
  const chi1 = CHIS[(p1Year + 8) % 12];
  const canChi1 = `${can1} ${chi1}`;
  const napAm1 = NAP_AM_MAP[canChi1] || 'Bình Địa Mộc';

  const can2 = CANS[(p2Year + 6) % 10];
  const chi2 = CHIS[(p2Year + 8) % 12];
  const canChi2 = `${can2} ${chi2}`;
  const napAm2 = NAP_AM_MAP[canChi2] || 'Sa Trung Kim';

  // Cung Phi
  const cungPhi1 = calculateCungPhi(p1Year, p1Gender);
  const cungPhi2 = calculateCungPhi(p2Year, p2Gender);

  // So Cung Phi Bát Trạch
  const key = `${cungPhi1}_${cungPhi2}`;
  const reverseKey = `${cungPhi2}_${cungPhi1}`;
  const matchInfo = BAT_TRACH_COMBINATIONS[key] || BAT_TRACH_COMBINATIONS[reverseKey] || {
    rating: 'Thiên Y' as const,
    isGood: true,
    desc: 'Hòa hợp, âm dương tương hỗ, tài lộc hanh thông.'
  };

  // Tính điểm tổng hợp (0 - 100)
  let score = 50;
  if (matchInfo.isGood) score += 30; else score -= 20;

  // So Ngũ hành nạp âm
  const el1 = napAm1.includes('Kim') ? 'Kim' : napAm1.includes('Mộc') ? 'Mộc' : napAm1.includes('Thủy') ? 'Thủy' : napAm1.includes('Hỏa') ? 'Hỏa' : 'Thổ';
  const el2 = napAm2.includes('Kim') ? 'Kim' : napAm2.includes('Mộc') ? 'Mộc' : napAm2.includes('Thủy') ? 'Thủy' : napAm2.includes('Hỏa') ? 'Hỏa' : 'Thổ';

  let menhMatch = '';
  if ((el1 === 'Kim' && el2 === 'Thủy') || (el1 === 'Thủy' && el2 === 'Mộc') || (el1 === 'Mộc' && el2 === 'Hỏa') || (el1 === 'Hỏa' && el2 === 'Thổ') || (el1 === 'Thổ' && el2 === 'Kim')) {
    score += 15;
    menhMatch = `Tương Sinh (${el1} sinh ${el2}): Rất tốt, người này nâng đỡ chở che cho người kia phát triển.`;
  } else if (el1 === el2) {
    score += 10;
    menhMatch = `Đồng Mệnh (${el1} & ${el2}): Bình hòa, đồng điệu về chí hướng và sở thích.`;
  } else {
    score -= 10;
    menhMatch = `Tương Khắc (${el1} & ${el2}): Đôi lúc khắc khẩu, cần một bên nhường nhịn làm dịu không khí.`;
  }

  // So Can Chi
  let canChiMatch = '';
  // Tam hợp: Thân Tý Thìn, Dần Ngọ Tuất, Tỵ Dậu Sửu, Hợi Mão Mùi
  const isTamHop = (
    (['Thân', 'Tý', 'Thìn'].includes(chi1) && ['Thân', 'Tý', 'Thìn'].includes(chi2)) ||
    (['Dần', 'Ngọ', 'Tuất'].includes(chi1) && ['Dần', 'Ngọ', 'Tuất'].includes(chi2)) ||
    (['Tỵ', 'Dậu', 'Sửu'].includes(chi1) && ['Tỵ', 'Dậu', 'Sửu'].includes(chi2)) ||
    (['Hợi', 'Mão', 'Mùi'].includes(chi1) && ['Hợi', 'Mão', 'Mùi'].includes(chi2))
  );

  if (isTamHop) {
    score += 15;
    canChiMatch = `Tam Hợp (${chi1} & ${chi2}): Trời sinh một cặp, hợp tác ăn ý, buôn bán phát tài, hôn nhân hòa thuận.`;
  } else {
    canChiMatch = `Địa Chi Bình Hòa (${chi1} & ${chi2}): Không phạm tứ hành xung, cùng nhau vun đắp sẽ nên nghiệp lớn.`;
  }

  score = Math.max(25, Math.min(98, score));

  // Lời khuyên hóa giải
  let remedyAdvice = '';
  if (score >= 75) {
    remedyAdvice = 'Hai bạn có căn duyên tiền định rất sâu sắc. Trong làm ăn thì phát tài phát lộc, trong hôn nhân thì con đàn cháu đống. Hãy trân trọng và đồng hành cùng nhau!';
  } else if (score >= 60) {
    remedyAdvice = 'Căn duyên ở mức khá tốt. Để gia đạo và công việc thêm hưng thịnh, nên chọn hướng giường ngủ hoặc bàn làm việc về hướng Sinh Khí/Diên Niên, sinh con vào năm tương sinh để gắn kết trọn đời.';
  } else {
    remedyAdvice = 'Tuy có điểm xung khắc về Cung Phi hoặc Nạp Âm, nhưng "Nhân định thắng thiên - Đức năng thắng số". Cách hóa giải tốt nhất: Sinh con mang mệnh cầu nối (trung gian hòa giải), đeo vòng phong thủy thạch anh tương sinh, và luôn lấy chữ Nhẫn làm đầu.';
  }

  return {
    p1: { name: p1Name, birthYear: p1Year, canChi: canChi1, menh: napAm1, cungPhi: cungPhi1 },
    p2: { name: p2Name, birthYear: p2Year, canChi: canChi2, menh: napAm2, cungPhi: cungPhi2 },
    score,
    rating: matchInfo.rating,
    isGood: matchInfo.isGood,
    canChiMatch,
    menhMatch,
    cungPhiMatch: `Cung ${cungPhi1} phối Cung ${cungPhi2} rơi vào cung ${matchInfo.rating}: ${matchInfo.desc}`,
    overallConclusion: `Đánh giá tổng quan độ tương hợp đạt ${score}/100 điểm. Hai tuổi ${canChi1} và ${canChi2} khi kết hợp tạo nên một trường năng lượng đặc biệt.`,
    remedyAdvice
  };
}

/**
 * 3. VIP: Bói Chỉ Tay & Soi Tướng Mạo AI
 */
export const PALMISTRY_FEATURES: PalmistryFeature[] = [
  {
    name: 'Đường Sinh Đạo (Đường Đời) Sâu Rõ & Vòng Cung Rộng',
    sign: 'Sức sống mãnh liệt, thọ trường phú quý',
    meaning: 'Báo hiệu nguồn năng lượng dồi dào, sức đề kháng phi thường, ít ốm đau bệnh tật. Càng về hậu vận càng an nhàn, có khả năng sống thọ trên 80 tuổi, con cháu hiếu thuận vinh hiển.',
    fortuneScore: 95
  },
  {
    name: 'Đường Trí Đạo (Đường Trí Tuệ) Chạy Dài Hơi Chếch Lên',
    sign: 'Tư duy chiến lược, nhạy bén kinh doanh',
    meaning: 'Tượng trưng cho trí tuệ xuất chúng, khả năng nắm bắt tâm lý khách hàng và xoay chuyển tình thế nhanh chóng. Rất có duyên với đầu tư tài chính, chứng khoán, bất động sản hoặc lãnh đạo.',
    fortuneScore: 92
  },
  {
    name: 'Đường Tâm Đạo (Tình Cảm) Ba Nhánh Tươi Sáng Đuôi Én',
    sign: 'Nhân duyên viên mãn, quý nhân phù trợ',
    meaning: 'Tướng tay của người chân thành, giàu lòng trắc ẩn, được bạn bè đối tác hết mực tin cậy. Dễ kết hôn với người bạn đời giàu sang hoặc có học thức cao, gia đình êm ấm không sóng gió.',
    fortuneScore: 90
  },
  {
    name: 'Vân Mắt Phượng (Mắt Phật) Ở Ngón Tay Cái',
    sign: 'Trực giác nhạy bén, tai qua nạn khỏi',
    meaning: 'Nét tướng cực hiếm! Sở hữu giác quan thứ sáu nhạy bén, luôn cảm nhận được điềm báo trước mọi biến cố. Trong đời có quý nhân âm thầm che chở, gặp hiểm nguy đều hóa dữ thành lành.',
    fortuneScore: 98
  },
  {
    name: 'Đường Thái Dương (Đường Danh Vọng) Rõ Nét Thẳng Tắp',
    sign: 'Danh tiếng lẫy lừng, hậu vận đại phú',
    meaning: 'Chủ về sự nổi tiếng, được xã hội tôn vinh, nắm giữ vị trí chủ chốt trong tổ chức. Tiền bạc tự tìm đến sau tuổi 35 mà không cần bon chen vất vả.',
    fortuneScore: 94
  }
];
