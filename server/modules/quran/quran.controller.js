import { logQuranSession, getQuranAnalytics, getQuranHistory, getCurrentSurahProgress } from './quran.service.js';
import { getQuranData } from '../../utils/quranSurah.js';

export const submitQuranSession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const sessionData = req.body;
    
    if (!sessionData.surah_name || !sessionData.verse_count || !sessionData.type) {
      return res.status(400).json({ error: "البيانات غير مكتملة، برجاء التأكد من إدخال اسم السورة وعدد الآيات ونوع الجلسة" });
    }

    const result = await logQuranSession(userId, sessionData);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const fetchQuranDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const analytics = await getQuranAnalytics(userId);
    const history = await getQuranHistory(userId, 10);
    const currentSurah = await getCurrentSurahProgress(userId);

    res.status(200).json({
      analytics,
      history,
      currentSurah
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateQuranTargets = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { daily_hifz_target, daily_revision_target } = req.body;

    const { updateDailyTargets } = await import('./quran.service.js');
    
    const updatedUser = await updateDailyTargets(userId, daily_hifz_target, daily_revision_target);
    
    res.status(200).json({
      message: "تم تحديث الهدف اليومي بنجاح",
      targets: updatedUser
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const fetchSurahList = async (req, res) => {
  try {
    const list = await getQuranData();
    res.status(200).json(list);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
