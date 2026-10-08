import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Endpoint: Luận giải chuyên sâu Lá Số Tử Vi hoặc giải đáp câu hỏi của người dùng
 */
app.post('/api/horoscope/consult', async (req, res) => {
  try {
    const { laSo, question, userContext } = req.body;

    if (!question && !laSo) {
      return res.status(400).json({ error: 'Thiếu thông tin lá số hoặc câu hỏi tư vấn.' });
    }

    const systemPrompt = `Bạn là một Cụ Đồ / Bậc Thầy Huyền Học & Tử Vi Đẩu Số uyên bác, đức độ của Việt Nam.
Phong thái của bạn: Trang trọng, nhã nhặn, từ bi, sâu sắc, sử dụng ngôn từ tao nhã đậm chất văn hóa Á Đông và thuật ngữ Tử Vi Đẩu Số chuẩn xác.
Nguyên tắc luận giải:
1. "Đức năng thắng số" - Luôn định hướng thân chủ hành thiện tích đức, giữ tâm sáng, nỗ lực phấn đấu thay vì bi quan yếm thế.
2. Phân tích cụ thể dựa trên Can Chi, Cung Mệnh, Thân, các chính tinh, phụ tinh và tam hợp/xung chiếu.
3. Đưa ra lời khuyên thực tế cho sự nghiệp, tình duyên, tài chính, thời điểm nên hành động hoặc nên kiên nhẫn.
4. Trình bày bài luận rõ ràng, có tiêu đề, gạch đầu dòng mạch lạc, lời văn cuốn hút, súc tích.`;

    const userPrompt = `
Thông tin người xem:
- Họ tên: ${laSo?.fullName || 'Thân chủ'}
- Giới tính: ${laSo?.gender === 'nam' ? 'Nam' : 'Nữ'}
- Ngày sinh Dương lịch: ${laSo?.solarDate ? `${laSo.solarDate.day}/${laSo.solarDate.month}/${laSo.solarDate.year}` : 'N/A'}
- Năm Can Chi: ${laSo?.canChiYear || ''} (Mệnh: ${laSo?.menhNguHanh || ''})
- Cục: ${laSo?.cuc || ''} | Thân cư: ${laSo?.thanCuCung || ''}
- Chủ mệnh: ${laSo?.chuMenh || ''} | Chủ thân: ${laSo?.chuThan || ''}
- Cung Mệnh toạ lạc: ${laSo?.cungs?.[0]?.chi || ''} có các sao: ${laSo?.cungs?.[0]?.chinhTinh?.map((s: any) => `${s.name} (${s.brightness})`).join(', ') || 'Vô Chính Diệu'}

Câu hỏi của thân chủ:
"${question || 'Xin Thầy luận giải chi tiết tổng quan lá số trọn đời, vận hạn sắp tới và lời khuyên lập nghiệp, hôn nhân.'}"

${userContext ? `Bối cảnh thêm: ${userContext}` : ''}

Kính nhờ Thầy luận giải tường tận giúp thân chủ.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      reading: response.text || 'Thầy hiện đang bận chiêm nghiệm thiên tượng, xin thân chủ thử lại trong giây lát.',
    });
  } catch (error: any) {
    console.error('Error consulting horoscope:', error);
    res.status(500).json({
      success: false,
      error: 'Không thể kết nối tới Thầy Tử Vi lúc này. Vui lòng thử lại sau.'
    });
  }
});

/**
 * Endpoint: Luận giải quẻ Kinh Dịch hoặc Bói Kiều theo câu hỏi thực tế
 */
app.post('/api/divination/consult', async (req, res) => {
  try {
    const { queName, thoanTu, yNghia, question, type } = req.body;

    const systemPrompt = `Bạn là một bậc cao nhân am hiểu Kinh Dịch, Chu Dịch và Triết học phương Đông.
Hãy luận quẻ cho thân chủ một cách thấu triệt, phân tích mối tương quan giữa sự việc thân chủ đang hỏi với hào quẻ, âm dương, biến dịch.
Phong cách: Điềm đạm, trí tuệ, khai mở góc nhìn cho người hỏi.`;

    const userPrompt = `
Loại hình: ${type === 'kieu' ? 'Bói Thẻ Kiều' : 'Gieo Quẻ Kinh Dịch'}
Quẻ nhận được: ${queName}
Thoán từ / Lời quẻ: "${thoanTu || ''}"
Ý nghĩa cốt lõi: "${yNghia || ''}"
Câu hỏi / Tâm nguyện của người gieo quẻ: "${question || 'Xin quẻ về sự nghiệp, công việc và bình an thời gian tới.'}"

Hãy luận giải chi tiết quẻ này ứng vào tâm sự và hoàn cảnh của người gieo quẻ, chỉ rõ việc nên làm, điều cần tránh và thời điểm hanh thông.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      reading: response.text || 'Quẻ đã hiển linh, tâm thành ắt ứng nghiệm.',
    });
  } catch (error: any) {
    console.error('Error consulting divination:', error);
    res.status(500).json({
      success: false,
      error: 'Không thể giải quẻ lúc này. Vui lòng thử lại sau.'
    });
  }
});

/**
 * Endpoint: Gợi ý ngày giờ tốt theo mục đích (Cưới hỏi, Khai trương, Động thổ...)
 */
app.post('/api/auspicious-date/recommend', async (req, res) => {
  try {
    const { purpose, birthYear, month, year } = req.body;

    const prompt = `Bạn là chuyên gia xem ngày giờ Hoàng Đạo phong thủy truyền thống Việt Nam.
Hãy tư vấn chọn ngày hoàng đạo tốt nhất trong tháng ${month}/${year} cho người sinh năm ${birthYear} để thực hiện công việc: "${purpose || 'Khai trương, Động thổ, Cưới hỏi'}".
Hãy liệt kê 3 ngày đẹp nhất trong tháng này, kèm:
1. Ngày Dương lịch & Âm lịch
2. Can Chi ngày & Trực, Sao Hoàng Đạo
3. Khung giờ Hoàng Đạo đẹp nhất để làm lễ
4. Hướng xuất hành và điều cần kiêng kỵ khi tiến hành.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Bạn là chuyên gia chọn ngày giờ tốt lành truyền thống Việt Nam, hướng dẫn ân cần, chi tiết, chính xác.',
        temperature: 0.6,
      },
    });

    res.json({
      success: true,
      recommendation: response.text,
    });
  } catch (error: any) {
    console.error('Error recommending date:', error);
    res.status(500).json({
      success: false,
      error: 'Không thể tra cứu ngày lúc này. Vui lòng thử lại sau.'
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tu Vi & Van Su Lanh server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
