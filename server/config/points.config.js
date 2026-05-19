export const POINTS_CONFIG = {
  PRAYER: {
    MOSQUE: 20,
    HOME: 10,
    CONGREGATION: 15, // صلاة جماعة في البيت
    ON_TIME_BONUS: 5,
    QADAA_PENALTY: 5, // less than normal
  },
  TASBIH: {
    COMPLETED_SESSION: 10, // مثلاً بعد ما يخلص الـ 33
    PER_HUNDRED: 5,
  },
  AZKAR: {
    MORNING: 15,
    EVENING: 15,
    SLEEP: 10,
  },
  QURAN: {
    HIFZ_PER_AYAH: 2,
    HIFZ_BONUS: 10,
    REVISION_PER_AYAH: 1,
    REVISION_BONUS: 5,
    READING_PER_AYAH: 0.5,
    GOAL_BONUS: 50,
  },

  STREAK_BONUS: {
    DAY_7: 50,
    DAY_30: 200,
  },
  LEVELS: {
    THRESHOLD_PER_LEVEL: 500, // كل 500 جوهرة بيطلع لفل
  },
};