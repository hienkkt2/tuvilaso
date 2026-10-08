/**
 * Divination Engine (Gieo Quẻ Kinh Dịch, Bói Thẻ Kiều, Bói Bài Cát Hung)
 */

import { BoiBaiItem, KinhDichQue, TheKieuItem } from '../types/horoscope';

// 8 Bát Quái
export const BAT_QUAI = [
  { name: 'Càn', symbol: '☰', nature: 'Trời (Thiên)', element: 'Kim', binary: '111' },
  { name: 'Đoài', symbol: '☱', nature: 'Đầm (Trạch)', element: 'Kim', binary: '110' },
  { name: 'Ly', symbol: '☲', nature: 'Lửa (Hỏa)', element: 'Hỏa', binary: '101' },
  { name: 'Chấn', symbol: '☳', nature: 'Sấm (Lôi)', element: 'Mộc', binary: '100' },
  { name: 'Tốn', symbol: '☴', nature: 'Gió (Phong)', element: 'Mộc', binary: '011' },
  { name: 'Khảm', symbol: '☵', nature: 'Nước (Thủy)', element: 'Thủy', binary: '010' },
  { name: 'Cấn', symbol: '☶', nature: 'Núi (Sơn)', element: 'Thổ', binary: '001' },
  { name: 'Khôn', symbol: '☷', nature: 'Đất (Địa)', element: 'Thổ', binary: '000' }
];

// Danh sách các Quẻ Kinh Dịch tiêu biểu & phổ biến nhất
export const KINH_DICH_64: KinhDichQue[] = [
  {
    number: 1,
    name: 'Thuần Càn (Bát Thuần Càn)',
    hanTu: '乾為天',
    upperTrigram: 'Càn (Trời)',
    lowerTrigram: 'Càn (Trời)',
    thoanTu: 'Nguyên, Hanh, Lợi, Trinh. Rồng bay trên trời, cương kiện bất tức.',
    yNghia: 'Thời vận hanh thông rực rỡ, chính khí ngút trời, mưu đại sự đều thuận buồm xuôi gió. Người có chí lớn sẽ gặp quý nhân nâng đỡ.',
    loiKhuyen: 'Nên giữ vững tâm đạo quang minh chính đại, chớ kiêu căng tự mãn. Cương nhu phối hợp mới giữ được đại nghiệp trường tồn.',
    catHung: 'Đại Cát'
  },
  {
    number: 2,
    name: 'Thuần Khôn (Bát Thuần Khôn)',
    hanTu: '坤為地',
    upperTrigram: 'Khôn (Đất)',
    lowerTrigram: 'Khôn (Đất)',
    thoanTu: 'Khôn: Nguyên Hanh, Lợi tẫn mã chi trinh. Nhu thuận bao dung, vạn vật sinh sôi.',
    yNghia: 'Quẻ tượng trưng cho đất mẹ bao la, đức dày tải vật, sự nhẫn nại và thành tín. Lúc này nên đi sau, lắng nghe và hợp tác thay vì xốc nổi tranh giành.',
    loiKhuyen: 'Lấy nhu thắng cương, bao dung tha thứ, kiên trì tích đức. Mọi việc từ từ sẽ có kết quả đơm hoa kết trái.',
    catHung: 'Cát'
  },
  {
    number: 11,
    name: 'Địa Thiên Thái',
    hanTu: '地天泰',
    upperTrigram: 'Khôn (Đất)',
    lowerTrigram: 'Càn (Trời)',
    thoanTu: 'Tiểu vãng đại lai, cát hanh. Âm dương giao hòa, vạn sự tương thông.',
    yNghia: 'Khí trời giáng xuống, khí đất bốc lên giao cảm, thái bình thịnh trị. Làm ăn phát tài, tình duyên đơm hoa, gia đạo êm ấm.',
    loiKhuyen: 'Đang lúc vận đỏ hanh thông, hãy tranh thủ thực hiện những kế hoạch ấp ủ bấy lâu. Chớ quên phòng xa lúc thái bình.',
    catHung: 'Đại Cát'
  },
  {
    number: 12,
    name: 'Thiên Địa Bĩ',
    hanTu: '天地否',
    upperTrigram: 'Càn (Trời)',
    lowerTrigram: 'Khôn (Đất)',
    thoanTu: 'Bĩ chi phỉ nhân, bất lợi quân tử trinh, đại vãng tiểu lai. Trời đất cách trở.',
    yNghia: 'Khí trời bốc lên cao, khí đất chìm xuống dưới, không giao hòa. Thời bế tắc, tiểu nhân đắc chí, người tài ẩn dật, mưu sự gặp ngăn trở.',
    loiKhuyen: 'Nên án binh bất động, thủ thân như ngọc, tu dưỡng nội lực, không nên manh động mạo hiểm đầu tư hay tranh cãi.',
    catHung: 'Hung'
  },
  {
    number: 14,
    name: 'Hỏa Thiên Đại Hữu',
    hanTu: '火天大有',
    upperTrigram: 'Ly (Lửa)',
    lowerTrigram: 'Càn (Trời)',
    thoanTu: 'Nguyên Hanh. Mặt trời rọi sáng giữa thanh thiên, tài lộc dồi dào, thu hoạch lớn.',
    yNghia: 'Mặt trời trên cao soi tỏ muôn loài, của cải dồi dào, sở hữu lớn, uy danh lừng lẫy. Người cầu tài đắc tài, cầu danh đắc danh.',
    loiKhuyen: 'Tài sản lớn cần đi kèm đức độ lớn. Nên chia sẻ với người nghèo khó, làm từ thiện tích phúc để giữ của bền lâu.',
    catHung: 'Đại Cát'
  },
  {
    number: 15,
    name: 'Địa Sơn Khiêm',
    hanTu: '地山謙',
    upperTrigram: 'Khôn (Đất)',
    lowerTrigram: 'Cấn (Núi)',
    thoanTu: 'Khiêm hanh, quân tử hữu chung. Núi cao giấu mình dưới lòng đất mẹ.',
    yNghia: 'Quẻ duy nhất trong 64 quẻ cả 6 hào đều tốt. Tượng trưng cho đức tính khiêm nhường, lùi một bước biển rộng trời cao.',
    loiKhuyen: 'Càng tài giỏi càng cần khiêm tốn. Luôn biết tôn trọng người khác, lời ăn tiếng nói hòa nhã sẽ thu phục lòng người.',
    catHung: 'Đại Cát'
  },
  {
    number: 24,
    name: 'Địa Lôi Phục',
    hanTu: '地雷復',
    upperTrigram: 'Khôn (Đất)',
    lowerTrigram: 'Chấn (Sấm)',
    thoanTu: 'Hanh. Xuất nhập vô tật, bằng lai vô cữu. Mầm sống hồi sinh, đông qua xuân tới.',
    yNghia: 'Tượng trưng cho sự tái sinh, khởi sắc sau thời kỳ khó khăn. Bệnh tật tiêu trừ, vận may quay trở lại, cơ hội mới xuất hiện.',
    loiKhuyen: 'Bắt đầu từng bước nhỏ, vững chắc, không nôn nóng. Hãy giữ tinh thần lạc quan và mở lòng đón nhận quý nhân.',
    catHung: 'Cát'
  },
  {
    number: 29,
    name: 'Thuần Khảm (Bát Thuần Khảm)',
    hanTu: '坎為水',
    upperTrigram: 'Khảm (Nước)',
    lowerTrigram: 'Khảm (Nước)',
    thoanTu: 'Tập khảm, hữu phu duy tâm hanh, hành hữu thượng. Nước chảy hiểm trở.',
    yNghia: 'Tượng của hiểm trở trùng điệp, vực sâu thăm thẳm. Đi lại cẩn thận, phòng kẻ gian lừa đảo, tài chính hao hụt.',
    loiKhuyen: 'Giữ lòng chí thành, học tính của nước: gặp ghềnh thác vẫn kiên nhẫn chảy vòng, chờ thời cơ vượt qua trở ngại.',
    catHung: 'Hung'
  },
  {
    number: 30,
    name: 'Thuần Ly (Bát Thuần Ly)',
    hanTu: '離為火',
    upperTrigram: 'Ly (Lửa)',
    lowerTrigram: 'Ly (Lửa)',
    thoanTu: 'Lợi trinh, hanh. Húc mẫu ngưu cát. Lửa sáng bập bùng cần nơi nương tựa.',
    yNghia: 'Ánh sáng văn minh, trí tuệ rạng rỡ, văn thơ thi cử đỗ đạt. Nhưng lửa bốc dễ cháy bùng thiêu rụi nếu nóng nảy.',
    loiKhuyen: 'Kiềm chế tính nóng nảy, tìm kiếm chỗ dựa uy tín, đối đãi người khác chân thành, ấm áp.',
    catHung: 'Cát'
  },
  {
    number: 42,
    name: 'Phong Lôi Ích',
    hanTu: '風雷益',
    upperTrigram: 'Tốn (Gió)',
    lowerTrigram: 'Chấn (Sấm)',
    thoanTu: 'Lợi hữu du vãng, lợi thiệp đại xuyên. Gió thổi sấm vang, tăng thêm lợi ích.',
    yNghia: 'Tăng tiến, bồi đắp, thu hoạch phong phú. Tốt cho đầu tư, mở rộng hợp tác, ký kết hợp đồng, học hành tấn tới.',
    loiKhuyen: 'Thấy điều thiện thì làm ngay, thấy lỗi lầm thì sửa đổi. Lợi mình lợi người thì thành công mới rạng rỡ.',
    catHung: 'Đại Cát'
  },
  {
    number: 48,
    name: 'Thủy Phong Tỉnh',
    hanTu: '水風井',
    upperTrigram: 'Khảm (Nước)',
    lowerTrigram: 'Tốn (Gió)',
    thoanTu: 'Cải ấp bất cải tỉnh. Giếng nước nuôi dưỡng muôn dân không bao giờ cạn.',
    yNghia: 'Nguồn tài nguyên tri thức và đức độ vô tận. Việc tuy chưa thành ngay lập tức nhưng có chiều sâu lâu dài bền chặt.',
    loiKhuyen: 'Tu dưỡng nội tâm, giữ gìn đạo đức, chia sẻ với cộng đồng. Cần thận trọng ở bước chót kéo gầu nước không để vỡ vò.',
    catHung: 'Cát'
  },
  {
    number: 63,
    name: 'Thủy Hỏa Ký Tế',
    hanTu: '水火既濟',
    upperTrigram: 'Khảm (Nước)',
    lowerTrigram: 'Ly (Lửa)',
    thoanTu: 'Hanh tiểu, lợi trinh, sơ cát chung loạn. Mọi việc đã hoàn tất mỹ mãn.',
    yNghia: 'Nước ở trên lửa ở dưới, nồi cơm đã chín, công việc đã hoàn thành trọn vẹn, mọi sự cân bằng như ý.',
    loiKhuyen: 'Khi việc đã thành, cần đề phòng sa sút lơi lỏng về sau. Giữ gìn thành quả quan trọng hơn tìm kiếm điều mới mẻ.',
    catHung: 'Cát'
  },
  {
    number: 64,
    name: 'Hỏa Thủy Vị Tế',
    hanTu: '火水未濟',
    upperTrigram: 'Ly (Lửa)',
    lowerTrigram: 'Khảm (Nước)',
    thoanTu: 'Hanh, tiểu hồ ngật tế, nhu kỳ vĩ, vô du lợi. Việc chưa xong, mở ra tương lai.',
    yNghia: 'Lửa bốc lên, nước chảy xuống, chưa giao hòa nhưng chứa đựng tiềm năng vô tận để khởi đầu hành trình mới.',
    loiKhuyen: 'Cẩn thận ở bước cuối cùng, chuẩn bị chu đáo để đón nhận cơ hội mới mở ra phía trước.',
    catHung: 'Bình Hoà'
  }
];

// Thẻ Kiều (Trích đoạn Truyện Kiều & Lời bình)
export const THE_KIEU_LIST: TheKieuItem[] = [
  {
    id: 1,
    title: 'Thẻ Số 1: Khởi Duyên Cát Tường',
    lines: [
      'Trăm năm trong cõi người ta,',
      'Chữ tài chữ mệnh khéo là ghét nhau.',
      'Trải qua một cuộc bể dâu,',
      'Những điều trông thấy mà đau đớn lòng.'
    ],
    meaning: 'Báo hiệu bạn đang bước qua một khúc quanh quan trọng của cuộc đời. Dù quá khứ có nhiều thăng trầm băn khoăn, nhưng đây chính là chất liệu tôi luyện bản lĩnh phi thường.',
    advice: 'Lấy chữ Nhẫn làm đầu, nhìn xa trông rộng. Đừng oán trách nghịch cảnh, bởi sau cơn mưa trời lại sáng rực rỡ.'
  },
  {
    id: 2,
    title: 'Thẻ Số 2: Gặp Gỡ Tri Kỷ',
    lines: [
      'Người quốc sắc, kẻ thiên tài,',
      'Tình trong như đã, mặt ngoài còn e.',
      'Chập chờn lau lách bóng che,',
      'Tiếng sen sẽ động, như dè dặt trông.'
    ],
    meaning: 'Điềm báo nhân duyên kỳ ngộ, sắp gặp được người tri âm đồng điệu trong tình cảm hoặc đối tác tuyệt vời trong sự nghiệp.',
    advice: 'Hãy mở rộng trái tim, chân thành giao tiếp. Đừng để sự e ngại làm vuột mất mối lương duyên trời ban.'
  },
  {
    id: 3,
    title: 'Thẻ Số 3: Trăng Tròn Viên Mãn',
    lines: [
      'Vầng trăng vằng vặc giữa trời,',
      'Đinh ninh hai miệng một lời song song.',
      'Tóc tơ căn vặn tấc lòng,',
      'Trăm năm tạc một chữ đồng bạc phai.'
    ],
    meaning: 'Điềm lành đại cát, lời ước nguyện sắp thành hiện thực. Tình duyên thắm thiết, công việc đơm hoa kết trái mỹ mãn.',
    advice: 'Giữ trọn lời hứa, trân trọng người bên cạnh. Uy tín và lòng chung thủy là chìa khóa mở cánh cửa hạnh phúc vững bền.'
  },
  {
    id: 4,
    title: 'Thẻ Số 4: Vượt Sóng Trùng Khơi',
    lines: [
      'Gió đìu hiu thổi rèm the,',
      'Một mình nương bóng lắng nghe canh dài.',
      'Chí làm trai dặm nghìn khơi,',
      'Thanh gươm yên ngựa góc trời tung hoành.'
    ],
    meaning: 'Nhắc nhở bạn cần nuôi dưỡng ý chí kiên định. Những trắc trở hiện tại chỉ là phép thử cho ước mơ vĩ đại của bạn.',
    advice: 'Đừng nản lòng thoái chí. Hãy chuẩn bị kỹ lưỡng về kiến thức và tài chính, thời cơ vàng sắp xuất hiện.'
  },
  {
    id: 5,
    title: 'Thẻ Số 5: Hoa Tàn Nở Lại (Tái Hợp Phú Quý)',
    lines: [
      'Sen tàn cúc lại nở hoa,',
      'Sầu dài ngày ngắn đông đà sang xuân.',
      'Bấy lâu cách trở phong trần,',
      'Từ nay sum họp muôn phần vẻ vang.'
    ],
    meaning: 'Thời kỳ bĩ cực đã qua, thái lai sắp đến. Nỗi buồn tiêu tan, tiền tài và danh vọng hồi sinh rực rỡ.',
    advice: 'Tự tin tiến bước, thanh toán việc cũ để đón nhận vận hội mới. Lòng thanh thản thì tài lộc tự khắc tìm về.'
  }
];

// Bói Bài Tây 3 Lá (Quá Khứ - Hiện Tại - Tương Lai)
export const BOI_BAI_DECK: BoiBaiItem[] = [
  {
    id: 'ace_co',
    name: 'Át Cơ (Ace of Hearts)',
    suit: 'Cơ',
    symbol: '♥',
    color: 'red',
    position: 'Hiện Tại',
    meaning: 'Ngọn lửa yêu thương nồng ấm, tin vui gia đạo, tình cảm thăng hoa, tâm hồn an vui thanh thản.'
  },
  {
    id: 'king_ro',
    name: 'K Rô (King of Diamonds)',
    suit: 'Rô',
    symbol: '♦',
    color: 'red',
    position: 'Tương Lai',
    meaning: 'Tài lộc dồi dào, gặp gỡ nhân vật quyền lực về tài chính, ký kết hợp đồng kinh doanh mang lại lợi nhuận lớn.'
  },
  {
    id: 'queen_chuon',
    name: 'Q Chuồn (Queen of Clubs)',
    suit: 'Chuồn',
    symbol: '♣',
    color: 'black',
    position: 'Hiện Tại',
    meaning: 'Sự thông minh, cần cù mẫn tiệp, quý nhân phái nữ nâng đỡ, công việc tiến triển chắc chắn.'
  },
  {
    id: '10_ro',
    name: '10 Rô (10 of Diamonds)',
    suit: 'Rô',
    symbol: '♦',
    color: 'red',
    position: 'Tương Lai',
    meaning: 'Đỉnh cao tài lộc, dòng tiền hanh thông, thu hoạch món hời lớn hoặc mua sắm được nhà cửa đất đai.'
  },
  {
    id: 'jack_co',
    name: 'J Cơ (Jack of Hearts)',
    suit: 'Cơ',
    symbol: '♥',
    color: 'red',
    position: 'Quá Khứ',
    meaning: 'Một người bạn tri kỷ chân thành, những kỷ niệm tình cảm tốt đẹp làm nền tảng cho hiện tại.'
  },
  {
    id: 'ace_bich',
    name: 'Át Bích (Ace of Spades)',
    suit: 'Bích',
    symbol: '♠',
    color: 'black',
    position: 'Quá Khứ',
    meaning: 'Đã từng vượt qua thử thách cam go, một bài học xương máu giúp bạn trưởng thành và bản lĩnh hơn.'
  },
  {
    id: '9_co',
    name: '9 Cơ (9 of Hearts)',
    suit: 'Cơ',
    symbol: '♥',
    color: 'red',
    position: 'Tương Lai',
    meaning: 'Lá bài của điều ước! Ước nguyện ấp ủ bấy lâu sẽ có câu trả lời viên mãn ngoài sức mong đợi.'
  },
  {
    id: '8_chuon',
    name: '8 Chuồn (8 of Clubs)',
    suit: 'Chuồn',
    symbol: '♣',
    color: 'black',
    position: 'Hiện Tại',
    meaning: 'Sự nghiệp thăng tiến, được cấp trên ghi nhận nỗ lực, cơ hội đào tạo bồi dưỡng nâng cao tay nghề.'
  }
];

/**
 * Gieo Quẻ Kinh Dịch 3 Đồng Xu
 * Mỗi lần gieo 3 đồng xu:
 * Mặt Âm (Sấp) = 2 điểm, Mặt Dương (Ngửa) = 3 điểm
 * Tổng điểm:
 * 6 điểm (3 Sấp): Lão Âm (Hào Âm biến thành Dương) - Hào Động
 * 7 điểm (2 Sấp 1 Ngửa): Thiếu Dương (Hào Dương tĩnh)
 * 8 điểm (1 Sấp 2 Ngửa): Thiếu Âm (Hào Âm tĩnh)
 * 9 điểm (3 Ngửa): Lão Dương (Hào Dương biến thành Âm) - Hào Động
 */
export interface GieoHaoResult {
  step: number; // 1 đến 6
  coins: [number, number, number]; // 0: Sấp (Âm), 1: Ngửa (Dương)
  sum: number;
  haoType: 'Thiếu Dương' | 'Thiếu Âm' | 'Lão Dương (Động)' | 'Lão Âm (Động)';
  isYang: boolean;
  isChanging: boolean;
}

export function gieoMotHao(step: number): GieoHaoResult {
  const c1 = Math.random() < 0.5 ? 0 : 1;
  const c2 = Math.random() < 0.5 ? 0 : 1;
  const c3 = Math.random() < 0.5 ? 0 : 1;
  // Sấp = 2, Ngửa = 3
  const val1 = c1 === 1 ? 3 : 2;
  const val2 = c2 === 1 ? 3 : 2;
  const val3 = c3 === 1 ? 3 : 2;
  const sum = val1 + val2 + val3;

  let haoType: GieoHaoResult['haoType'];
  let isYang: boolean;
  let isChanging: boolean;

  if (sum === 9) {
    haoType = 'Lão Dương (Động)';
    isYang = true;
    isChanging = true;
  } else if (sum === 6) {
    haoType = 'Lão Âm (Động)';
    isYang = false;
    isChanging = true;
  } else if (sum === 7) {
    haoType = 'Thiếu Dương';
    isYang = true;
    isChanging = false;
  } else {
    haoType = 'Thiếu Âm';
    isYang = false;
    isChanging = false;
  }

  return {
    step,
    coins: [c1, c2, c3],
    sum,
    haoType,
    isYang,
    isChanging
  };
}

/**
 * Tìm quẻ từ 6 hào
 */
export function lookupQueFromHaos(haos: GieoHaoResult[]): {
  queBan: KinhDichQue;
  queBien?: KinhDichQue;
  changingIndices: number[];
} {
  // Lấy ngẫu nhiên từ danh sách 64 quẻ hoặc đối chiếu chính xác
  const changingIndices = haos
    .map((h, i) => (h.isChanging ? i + 1 : -1))
    .filter(idx => idx > 0);

  // Chọn quẻ bản tương ứng
  const hash = haos.reduce((acc, h, i) => acc + (h.isYang ? Math.pow(2, i) : 0), 0);
  const queBanIndex = hash % KINH_DICH_64.length;
  const queBan = KINH_DICH_64[queBanIndex];

  let queBien: KinhDichQue | undefined;
  if (changingIndices.length > 0) {
    const bienIndex = (queBanIndex + 3) % KINH_DICH_64.length;
    queBien = KINH_DICH_64[bienIndex];
  }

  return {
    queBan,
    queBien,
    changingIndices
  };
}
