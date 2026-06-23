export const normalizeArabic = (text) => {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u065F\u06D6-\u06ED\u0640\u0670]/g, "") 
    .replace(/[أإآٱ]/g, "ا")           
    .replace(/ة/g, "ه")               
    .replace(/ى/g, "ي")               
    .replace(/^(سورة|سوره)\s*/g, "")  
    .replace(/\s+/g, "");             
};
