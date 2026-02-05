
import { GoogleGenAI } from "@google/genai";

export async function polishText(text: string, type: 'chronology' | 'actions'): Promise<string> {
  if (!text.trim()) return text;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const model = 'gemini-3-flash-preview';

  const systemInstruction = `
    Anda adalah Pegawai Tadbir di Jabatan Pendidikan Negeri (JPN) Selangor.
    Tugas anda adalah memurnikan (polish) teks laporan kes sekolah supaya lebih profesional, berstruktur, dan menggunakan Bahasa Melayu formal yang tepat.
    Pastikan format senarai (1., 2., 3.) dikekalkan jika ada.
    Jangan ubah fakta asal, hanya baiki tatabahasa dan kosa kata.
    Teks yang diberikan adalah untuk bahagian: ${type === 'chronology' ? 'Kronologi Kes' : 'Tindakan Sekolah'}.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Sila murnikan teks berikut:\n\n${text}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return text;
  }
}
