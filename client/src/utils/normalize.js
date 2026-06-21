export const normalizeArabic = (text) => {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u065F]/g, "") // remove Tashkeel
    .replace(/[أإآ]/g, "ا")           // normalize Alef
    .replace(/ة/g, "ه")               // normalize Teh Marbuta
    .replace(/^(سورة|سوره)\s*/g, "")  // remove "سورة" or "سوره" prefix with optional spaces
    .replace(/\s+/g, "");             // remove spaces
};
