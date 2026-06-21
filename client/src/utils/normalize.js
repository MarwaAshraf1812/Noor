export const normalizeArabic = (text) => {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u065F\u06D6-\u06ED\u0640\u0670]/g, "") // remove Tashkeel, small signs, Tatweel & superscript Alef
    .replace(/[أإآٱ]/g, "ا")           // normalize Alef
    .replace(/ة/g, "ه")               // normalize Teh Marbuta
    .replace(/ى/g, "ي")               // normalize Alef Maksura to Yeh
    .replace(/^(سورة|سوره)\s*/g, "")  // remove "سورة" or "سوره" prefix with optional spaces
    .replace(/\s+/g, "");             // remove spaces
};
