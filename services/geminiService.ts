
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

export const getGeminiRecommendation = async (userPrompt: string, productCatalog: Product[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const model = "gemini-3-flash-preview";
  
  const catalogContext = productCatalog.map(p => 
    `ID: ${p.id}, Nama: ${p.name}, Kategori: ${p.category}, Harga: Rp ${p.price.toLocaleString('id-ID')}, Rating: ${p.rating}`
  ).slice(0, 100).join('\n');

  const systemInstruction = `
    Anda adalah "Konsultan Keberhasilan Siswa & Pembelajaran" di DigiMarket.
    Misi Anda adalah memberdayakan siswa dan pembelajar seumur hidup dengan merekomendasikan alat digital yang tepat dari katalog kami.
    
    Konteks Katalog (Sampel):
    ${catalogContext}
    
    Panduan Penting:
    1. Bersikaplah empatik, menyemangati, dan sangat profesional. Gunakan Bahasa Indonesia yang sopan.
    2. Analisis tujuan pengguna.
    3. Rekomendasikan 1-2 produk spesifik yang dapat menyelesaikan masalah mereka.
    4. Jelaskan MENGAPA produk ini akan membantu mereka secara spesifik.
    5. Semua harga dalam katalog adalah dalam Rupiah (IDR).
    6. Jaga agar respons tetap di bawah 120 kata.
    7. KRITIS: Saat menyarankan produk, WAJIB sertakan ID-nya di akhir pesan Anda dalam format ini: [PRODUCT_ID:id_disini].
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    return response.text || "Saya di sini untuk membantu Anda mencapai tujuan. Bisa ceritakan lebih lanjut tentang apa yang sedang Anda pelajari?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Asisten Belajar sedang istirahat sejenak. Silakan coba lagi nanti!";
  }
};
