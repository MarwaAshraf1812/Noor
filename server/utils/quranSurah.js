import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const quranFilePath = path.join(__dirname, "quranData.json");

let cachedQuranData = null;

const loadQuranData = async () => {
  if(cachedQuranData) return cachedQuranData;

  try {
    const fileExists = await fs.access(quranFilePath).then(() => true).catch(() => false);
    if(fileExists) {
      const fileContent = await fs.readFile(quranFilePath, "utf-8");
      cachedQuranData = JSON.parse(fileContent);
      return cachedQuranData;
    }
  } catch (error) {
    console.error("Error reading local quranData.json:", error);
  }
  console.log("Quran data file not found or invalid. Seeding from API...");
  try {
    const response = await axios.get('https://api.alquran.cloud/v1/quran/quran-uthmani');
    if(response.data && response.data.code === 200 && response.data.data && response.data.data.surahs) {
      cachedQuranData = response.data.data.surahs;
      await fs.writeFile(quranFilePath, JSON.stringify(cachedQuranData, null, 2), 'utf-8');
      console.log("✅ Quran data seeded from API");
      return cachedQuranData;
    }
  } catch (error) {
    console.error("Error seeding Quran data:", error);
  }
  return cachedQuranData || [];
}


export const getQuranData = async () => {
  const surahs = await loadQuranData();
  return surahs.map(surah => ({
    number: surah.number,
    name: surah.name,
    englishName: surah.englishName,
    englishNameTranslation: surah.englishNameTranslation,
    numberOfAyahs: surah.ayahs ? surah.ayahs.length : 0,
    revelationType: surah.revelationType
  }));
}

export const getQuranSurahData = async (surahNumber) => {
  const  surahs = await loadQuranData();
  const surah = surahs.find(s => s.number === parseInt(surahNumber, 10));
  if(surah) {
    return {
      ...surah,
      numberOfAyahs: surah.ayahs ? surah.ayahs.length : 0
    }
  }
  return null;
}

const normalizeArabic = (text) => {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u065F]/g, "") // remove Tashkeel
    .replace(/[أإآ]/g, "ا")           // normalize Alef
    .replace(/ة/g, "ه")               // normalize Teh Marbuta
    .replace(/\s+/g, "")              // remove spaces
    .replace(/^سورة/g, "");           // remove "سورة" prefix
};

export const getQuranSurahDataByName = async (surahName) => {
  const surahs = await loadQuranData();
  const normalizedSearch = normalizeArabic(surahName);
  
  const surah = surahs.find(s => 
    s.englishName === surahName || 
    s.name === surahName ||
    normalizeArabic(s.name) === normalizedSearch ||
    normalizeArabic(s.englishName) === normalizedSearch
  );
  if(surah) {
    return {
      ...surah,
      numberOfAyahs: surah.ayahs ? surah.ayahs.length : 0
    }
  }
  return null;
}

loadQuranData().catch(err => console.error("Error pre-loading Quran data:", err));