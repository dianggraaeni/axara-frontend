// src/services/ai.service.ts
// Semua fitur AI menggunakan Gemini SDK langsung dari frontend.
// Pola yang dipakai IDENTIK dengan FloatingChat yang sudah terbukti bekerja.

import { GoogleGenAI } from '@google/genai';

const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!geminiKey) {
  console.error('❌ VITE_GEMINI_API_KEY tidak ditemukan di .env.local');
}

const ai = new GoogleGenAI({ apiKey: geminiKey ?? '' });

// ─── Chat (dipakai ChatPage dan FloatingChat) ─────────────────────────────────
export const chatWithGuide = async (
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  contextProvince?: string
): Promise<string> => {
  try {
    const systemInstruction = contextProvince
      ? `Kamu adalah Axara, pemandu budaya Nusantara yang ramah. Jawab dalam bahasa Indonesia yang asik. Fokus pada budaya, sejarah, dan tradisi Indonesia. Saat ini pengguna sedang mengeksplorasi provinsi: ${contextProvince}.`
      : 'Kamu adalah Axara, pemandu budaya Nusantara yang ramah. Jawab dalam bahasa Indonesia yang asik. Fokus pada budaya, sejarah, dan tradisi Indonesia.';

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction },
      history,
    });

    const response = await chat.sendMessage({ message });
    return response.text ?? 'Maaf, tidak ada respons dari AI.';
  } catch (error) {
    console.error('Chat AI error:', error);
    return 'Maaf, Axara sedang istirahat sebentar. Coba lagi nanti ya! 😊';
  }
};

export const chatWithGuideFallback = chatWithGuide;

// ─── Quiz Generator ───────────────────────────────────────────────────────────
export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category?: string;
}

export const generateQuiz = async (
  provinceName: string,
  count: number = 3,
  difficulty: 'easy' | 'medium' | 'hard' = 'easy'
): Promise<QuizQuestion[]> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction:
          'Kamu adalah pembuat soal kuis budaya Indonesia. Kamu HANYA membalas dengan JSON murni, tanpa penjelasan, tanpa markdown, tanpa backtick.',
      },
      history:[],
    });

    const prompt = `Buat ${count} soal pilihan ganda tentang budaya, sejarah, makanan, atau pakaian adat dari ${provinceName}.
Tingkat kesulitan: ${difficulty}.
Balas HANYA dengan JSON array, tidak ada teks lain. Format:
[{"question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"...","category":"food"}]`;

    const response = await chat.sendMessage({ message: prompt });
    let text = response.text ?? '';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text) as QuizQuestion[];

    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Invalid quiz format');
    return parsed;
  } catch (error) {
    console.error('Quiz generation error:', error);
    // REVISI FALLBACK: Menggunakan nama provinsi secara dinamis agar logis
    const name = provinceName || 'Nusantara';
    return[
      {
        question: `[SOAL DARURAT] Saat ini AI sedang terkena limit server. Namun coba tebak, Semboyan negara Indonesia adalah...`,
        options:['Tut Wuri Handayani', 'Bhinneka Tunggal Ika', 'Pancasila', 'Kartika Eka Paksi'],
        correctIndex: 1,
        explanation: 'Bhinneka Tunggal Ika berarti berbeda-beda tetapi tetap satu jua. (Tunggu sekitar 1 menit agar AI normal kembali).',
        category: 'culture',
      },
    ];
  }
};

// ─── Story Generator ──────────────────────────────────────────────────────────
export const generateStory = async (
  provinceName: string,
  theme: string = 'adventure'
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'Kamu adalah penulis cerita petualangan budaya Indonesia yang kreatif.',
      },
      history:[],
    });

    const response = await chat.sendMessage({
      message: `Buat cerita petualangan singkat (150-200 kata) tentang ${provinceName} dengan tema "${theme}". Sudut pandang orang kedua (kamu). Bahasa Indonesia yang asik untuk remaja. Sertakan fakta budaya nyata.`,
    });

    return response.text ?? 'Cerita tidak tersedia saat ini.';
  } catch (error) {
    console.error('Story generation error:', error);
    return `Petualanganmu di ${provinceName} dimulai! Sayangnya panduan cerita sedang beristirahat. Coba lagi nanti.`;
  }
};

// ─── Memory Match Generator ───────────────────────────────────────────────────
export interface MemoryPair { 
  term: string;
  hint: string;
}

const GENERIC_MEMORY_WORDS = [
  'kuliner',
  'makanan khas',
  'tarian khas',
  'seni tari tradisional',
  'adat',
  'tradisi',
  'budaya',
  'pusaka',
];

const MEMORY_FALLBACK_BY_PROVINCE: Record<string, MemoryPair[]> = {
  'kepulauan-riau': [
    { term: 'Makanan Khas', hint: 'Gonggong' },
    { term: 'Tarian Khas', hint: 'Zapin Penyengat' },
    { term: 'Pakaian Adat', hint: 'Teluk Belanga' },
    { term: 'Sastra Daerah', hint: 'Gurindam Dua Belas' },
  ],
  'riau': [
    { term: 'Makanan Khas', hint: 'Gulai Ikan Patin' },
    { term: 'Tarian Khas', hint: 'Zapin Melayu Riau' },
    { term: 'Rumah Adat', hint: 'Selaso Jatuh Kembar' },
    { term: 'Ikon Budaya', hint: 'Lancang Kuning' },
  ],
};

function isGenericMemoryText(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return GENERIC_MEMORY_WORDS.some((w) => lower === w || lower.includes(` ${w}`) || lower.startsWith(w));
}

function isValidMemoryPair(pair: MemoryPair): boolean {
  if (!pair?.term || !pair?.hint) return false;
  if (pair.term.trim().length < 4 || pair.hint.trim().length < 3) return false;
  if (isGenericMemoryText(pair.hint)) return false;
  if (pair.term.toLowerCase() === pair.hint.toLowerCase()) return false;
  return true;
}

export const generateMemoryMatchData = async (provinceName: string): Promise<MemoryPair[]> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'Kamu adalah ahli budaya Indonesia. Balas HANYA dengan JSON array murni tanpa penjelasan tambahan.',
      },
      history:[],
    });

    const prompt = `Buat tepat 4 pasangan memory game untuk provinsi ${provinceName}.
ATURAN KERAS:
1) "term" harus kategori tetap: "Makanan Khas", "Tarian Khas", "Pakaian Adat", "Ikon Budaya".
2) "hint" harus contoh SPESIFIK dari provinsi tersebut (contoh: "Gulai Ikan Patin", "Tari Zapin").
3) DILARANG jawaban generik/sinonim seperti: "kuliner", "makanan khas", "adat", "budaya", "tradisi", "tarian khas".
4) hint maksimal 4 kata.
Balas HANYA JSON array murni format:
[{"term":"Makanan Khas","hint":"Gulai Ikan Patin"}]`;

    const response = await chat.sendMessage({ message: prompt });
    let text = response.text ?? '';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text) as MemoryPair[];
    const normalized = Array.isArray(parsed) ? parsed.slice(0, 4).map((p) => ({
      term: String(p?.term ?? '').trim(),
      hint: String(p?.hint ?? '').trim(),
    })) : [];

    if (normalized.length !== 4 || normalized.some((p) => !isValidMemoryPair(p))) {
      throw new Error('Memory pairs generic/invalid');
    }

    return normalized;
  } catch (error) {
    console.error('Memory match data error (AI Limit/Error):', error);
    const key = (provinceName || '').toLowerCase().trim().replace(/\s+/g, '-');
    const specificFallback = MEMORY_FALLBACK_BY_PROVINCE[key];
    if (specificFallback) return specificFallback;

    return [
      { term: 'Makanan Khas', hint: 'Masakan Daerah Setempat' },
      { term: 'Tarian Khas', hint: 'Tari Tradisional Setempat' },
      { term: 'Pakaian Adat', hint: 'Busana Adat Setempat' },
      { term: 'Ikon Budaya', hint: 'Warisan Budaya Setempat' },
    ];
  }
};

// ─── Province Puzzle Generator (SUDAH DIGANTI CULTURE SWIPE DI QUEST) ─────────
export interface PuzzlePiece {
  id: string;
  name: string;
  description: string;
}

export const generatePuzzleData = async (provinceName: string): Promise<PuzzlePiece[]> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'Kamu adalah pembuat data puzzle provinsi Indonesia. Balas HANYA dengan JSON array murni.',
      },
      history:[],
    });

    const prompt = `Buat 3 bagian/wilayah/ikon penting dari provinsi ${provinceName} yang bisa dijadikan kepingan puzzle.
    Balas HANYA dengan JSON array:[{"id": "bagian1", "name": "...", "description": "..."}, ...]`;

    const response = await chat.sendMessage({ message: prompt });
    let text = response.text ?? '';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text) as PuzzlePiece[];
  } catch (error) {
    console.error('Puzzle data error:', error);
    const name = provinceName || 'Nusantara';
    return[
      { id: "p1", name: `Ikon ${name}`, description: `Bagian tengah ${name}` },
      { id: "p2", name: `Wilayah Adat`, description: `Bagian utara ${name}` },
      { id: "p3", name: `Situs Sejarah`, description: `Bagian selatan ${name}` }
    ];
  }
};

// ─── Culture Swipe Generator (MITOS ATAU FAKTA) ────────────────────────────────
export interface SwipeCard {
  statement: string;
  isFact: boolean;
  explanation: string;
}

export const generateCultureSwipeData = async (provinceName: string): Promise<SwipeCard[]> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'Kamu adalah pembuat soal trivia budaya. Balas HANYA dengan JSON array murni tanpa backticks.',
      },
      history:[],
    });

    const prompt = `Buat 5 pernyataan (Mitos atau Fakta) tentang budaya, sejarah, atau tradisi KHUSUS DARI PROVINSI ${provinceName}.
Pastikan ada pernyataan yang BENAR (Fakta) dan ada yang SALAH (Mitos/mengecoh).
Balas HANYA dalam format JSON array murni. Format:[{"statement": "...", "isFact": true/false, "explanation": "Penjelasan singkat maks 15 kata"}]`;

    const response = await chat.sendMessage({ message: prompt });
    let text = response.text ?? '';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text) as SwipeCard[];
  } catch (error) {
    console.error('Culture swipe error:', error);
    // Data darurat jika AI kena Limit
    const name = provinceName || 'Nusantara';
    return[
      { statement: `Semua penduduk asli ${name} tinggal di rumah panggung.`, isFact: false, explanation: "Bentuk rumah adat beragam, tidak semuanya panggung." },
      { statement: `${name} memiliki tradisi yang diwariskan turun-temurun.`, isFact: true, explanation: "Tradisi lisan sangat kuat di seluruh wilayah Nusantara." },
      { statement: `Pakaian adat ${name} hanya boleh dipakai oleh bangsawan.`, isFact: false, explanation: "Pakaian adat kini bisa dipakai oleh semua kalangan." }
    ];
  }
};

// ─── Aksara Scramble Generator (SUSUN KATA BUDAYA) ────────────────────────────
export interface ScrambleWord {
  correctWord: string;
  scrambledWord: string;
  clue: string;
  category?: string;
}

export const generateAksaraScramble = async (provinceName: string, count: number = 5): Promise<ScrambleWord[]> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'Kamu adalah pembuat teka-teki kata budaya Indonesia. Balas HANYA dengan JSON array murni tanpa markdown atau backticks.',
      },
      history: [],
    });

    const prompt = `Buat ${count} kata budaya dari ${provinceName} untuk permainan susun huruf.
Kata harus SPESIFIK dan UNIK dari ${provinceName} (seperti nama makanan, tarian, tempat wisata, senjata tradisional, pakaian adat, alat musik).
Untuk setiap kata:
1. Berikan clue/petunjuk yang jelas tapi tidak terlalu mudah (maksimal 15 kata)
2. Acak huruf-hurufnya secara random (scramble)
3. Gunakan huruf KAPITAL semua
4. Pastikan kata tidak terlalu panjang (maksimal 12 huruf)

Balas HANYA dengan JSON array murni. Format:
[
  {
    "correctWord": "RENDANG",
    "scrambledWord": "NGDRANE",
    "clue": "Masakan daging sapi berbumbu yang dimasak lama hingga kering",
    "category": "makanan"
  }
]`;

    const response = await chat.sendMessage({ message: prompt });
    let text = response.text ?? '';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(text) as ScrambleWord[];

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('Invalid scramble data format');
    }

    return parsed;
  } catch (error) {
    console.error('Aksara Scramble generation error:', error);
    
    // Fallback data - data darurat jika AI error
    const name = provinceName || 'Nusantara';
    return [
      {
        correctWord: 'RENDANG',
        scrambledWord: 'NGDRANE',
        clue: 'Masakan daging berbumbu khas Minangkabau yang dimasak lama',
        category: 'makanan',
      },
      {
        correctWord: 'BATIK',
        scrambledWord: 'TIKBA',
        clue: 'Kain tradisional dengan motif dibuat menggunakan canting dan malam',
        category: 'kerajinan',
      },
      {
        correctWord: 'GAMELAN',
        scrambledWord: 'MEALANG',
        clue: 'Alat musik tradisional Jawa terdiri dari berbagai instrumen logam',
        category: 'musik',
      },
      {
        correctWord: 'ANGKLUNG',
        scrambledWord: 'GANKLUNG',
        clue: 'Alat musik dari bambu yang dimainkan dengan digoyangkan',
        category: 'musik',
      },
      {
        correctWord: 'WAYANG',
        scrambledWord: 'GANYAW',
        clue: 'Seni pertunjukan boneka kulit yang menceritakan kisah pewayangan',
        category: 'seni',
      },
    ];
  }
};