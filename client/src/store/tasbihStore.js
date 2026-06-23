import { create } from 'zustand';
import tasbihServices from '../services/tasbihServices';
import useAuthStore from './authStore';

const useTasbihStore = create((set, get) => ({
  dashboardData: null,
  loading: false,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await tasbihServices.getDashboard();
      set({ dashboardData: response.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'حدث خطأ أثناء جلب بيانات التسبيح.', loading: false });
    }
  },

  submitSession: async (tasbihName, tasbihCount, completed) => {
    set({ loading: true, error: null });
    try {
      const response = await tasbihServices.submitSession(tasbihName, tasbihCount, completed);

      await Promise.all([
        useAuthStore.getState().checkAuth(),
        get().fetchDashboard()
      ]);

      set({ loading: false });
      return response.data;
    } catch (err) {
      set({ error: err.response?.data?.error || 'حدث خطأ أثناء تسجيل التسبيح.', loading: false });
      throw err;
    }
  }
}));

export default useTasbihStore;
