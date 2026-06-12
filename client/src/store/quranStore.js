import { create } from 'zustand';
import quranServices from '../services/quranServices';
import useAuthStore from './authStore';

const useQuranStore = create((set, get) => ({
  dashboardData: null,
  surahsList: [],
  loading: false,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await quranServices.getDashboard();
      set({ dashboardData: response.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'حدث خطأ أثناء جلب بيانات القرآن.', loading: false });
    }
  },

  fetchSurahs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await quranServices.getSurahs();
      set({ surahsList: response.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'حدث خطأ أثناء جلب قائمة السور.', loading: false });
    }
  },

  submitSession: async (surahName, verseCount, type) => {
    set({ loading: true, error: null });
    try {
      const response = await quranServices.submitSession({
        surah_name: surahName,
        verse_count: Number(verseCount),
        type // "HIFZ" or "REVISION"
      });

      // Refresh user level, gems, and dashboard after submitting the session
      await useAuthStore.getState().checkAuth();
      await get().fetchDashboard();

      set({ loading: false });
      return response.data;
    } catch (err) {
      set({ error: err.response?.data?.error || 'حدث خطأ أثناء حفظ الجلسة.', loading: false });
      throw err;
    }
  },

  updateTargets: async (dailyHifzTarget, dailyRevisionTarget) => {
    set({ loading: true, error: null });
    try {
      const response = await quranServices.updateTargets({
        daily_hifz_target: Number(dailyHifzTarget),
        daily_revision_target: Number(dailyRevisionTarget)
      });

      // Refresh dashboard analytics to align with new targets
      await get().fetchDashboard();

      set({ loading: false });
      return response.data;
    } catch (err) {
      set({ error: err.response?.data?.error || 'حدث خطأ أثناء تحديث الأهداف اليومية.', loading: false });
      throw err;
    }
  }
}));

export default useQuranStore;
