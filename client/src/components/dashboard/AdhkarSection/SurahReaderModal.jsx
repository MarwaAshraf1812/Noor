import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SURAH_CONTENT = {
  'آية الكرسي': {
    title: 'آيـة الكُرسي',
    subtitle: 'سورة البقرة — الآية ٢٥٥',
    emoji: '🌟',
    color: 'from-[#EDE7F6] to-[#D1C4E9]',
    borderColor: 'border-[#9C27B0]',
    textColor: 'text-[#4A148C]',
    badgeColor: 'bg-[#9C27B0]/10 text-[#6A1B9A] border-[#CE93D8]',
    verses: [
      'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ'
    ]
  },
  'سورة الاخلاص': {
    title: 'سورة الإخلاص',
    subtitle: 'سورة رقم ١١٢ — ٤ آيات',
    emoji: '💎',
    color: 'from-[#E8F5E9] to-[#C8E6C9]',
    borderColor: 'border-[#388E3C]',
    textColor: 'text-[#1B5E20]',
    badgeColor: 'bg-[#388E3C]/10 text-[#2E7D32] border-[#A5D6A7]',
    verses: [
      'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
      'ٱللَّهُ ٱلصَّمَدُ',
      'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ'
    ]
  },
  'سورة الفلق': {
    title: 'سورة الفَلق',
    subtitle: 'سورة رقم ١١٣ — ٥ آيات',
    emoji: '🌅',
    color: 'from-[#FFFDE7] to-[#FFF9C4]',
    borderColor: 'border-[#F9A825]',
    textColor: 'text-[#E65100]',
    badgeColor: 'bg-[#F9A825]/10 text-[#E65100] border-[#FFE082]',
    verses: [
      'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ',
      'مِن شَرِّ مَا خَلَقَ',
      'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      'وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ',
      'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ'
    ]
  },
  'سورة الناس': {
    title: 'سورة النَّاس',
    subtitle: 'سورة رقم ١١٤ — ٦ آيات',
    emoji: '🤲',
    color: 'from-[#E3F2FD] to-[#BBDEFB]',
    borderColor: 'border-[#1565C0]',
    textColor: 'text-[#0D47A1]',
    badgeColor: 'bg-[#1565C0]/10 text-[#0D47A1] border-[#90CAF9]',
    verses: [
      'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
      'مَلِكِ ٱلنَّاسِ',
      'إِلَٰهِ ٱلنَّاسِ',
      'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ',
      'ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ',
      'مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ'
    ]
  }
};

export const SURAH_KEYS = new Set(Object.keys(SURAH_CONTENT));

export default function SurahReaderModal({ isOpen, onClose, onDone, surahName }) {
  const data = SURAH_CONTENT[surahName];
  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          className={`relative z-10 w-full max-w-lg bg-gradient-to-br ${data.color} rounded-[32px] border-4 ${data.borderColor} shadow-2xl flex flex-col gap-5 p-6 sm:p-8 select-none`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-sm text-lg font-black"
            aria-label="إغلاق"
          >
            ✕
          </button>

          <div className="flex flex-col items-center gap-2 text-center">
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="text-5xl sm:text-6xl"
            >
              {data.emoji}
            </motion.div>

            <h2 className={`text-2xl sm:text-3xl font-black ${data.textColor} tracking-normal`}>
              {data.title}
            </h2>

            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${data.badgeColor}`}>
              {data.subtitle}
            </span>
          </div>

          <div className="flex flex-col gap-3 max-h-[45vh] overflow-y-auto pr-1">
            {data.verses.map((verse, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className={`bg-white/60 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/80 shadow-sm`}
              >
                <p
                  className={`text-right font-extrabold leading-[2.2] text-base sm:text-lg ${data.textColor}`}
                  style={{ fontFamily: "'Cairo', sans-serif" }}
                >
                  {verse}
                </p>
                {data.verses.length > 1 && (
                  <span className={`text-[10px] font-black opacity-50 ${data.textColor} mt-1 block text-left`}>
                    الآية {i + 1}
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={onDone}
              className={`w-full py-4 rounded-2xl font-black text-base sm:text-lg text-white shadow-lg transition-all duration-200 cursor-pointer ${
                data.borderColor.replace('border-', 'bg-')
              } hover:opacity-90 active:scale-[0.98]`}
              style={{ backgroundColor: data.textColor.replace('text-[', '').replace(']', '') }}
            >
              ✅ تمت القراءة!
            </motion.button>

            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer text-center"
            >
              إغلاق بدون عدّ
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
