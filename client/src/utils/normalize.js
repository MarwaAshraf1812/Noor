export const normalizeArabic = (text) => {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u065F]/g, "") // remove Tashkeel
    .replace(/[أإآ]/g, "ا")           // normalize Alef
    .replace(/ة/g, "ه")               // normalize Teh Marbuta
    .replace(/\s+/g, "")              // remove spaces
    .replace(/^سورة/g, "");           // remove "سورة" prefix
};
