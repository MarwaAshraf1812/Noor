import { create } from 'zustand';
import adhkarServices from '../services/adhkarServices';
import useAuthStore from './authStore';

const useAdhkarStore = create((set, get) => ({
  dashboardData: null,
  loading: false,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adhkarServices.getDashboard();
      set({ dashboardData: response.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'حدث خطأ أثناء جلب بيانات الأذكار.', loading: false });
    }
  },

  submitSession: async (category) => {
    set({ loading: true, error: null });
    try {
      const response = await adhkarServices.submitSession(category);

      // Refresh level & gems after completing adhkar
      await useAuthStore.getState().checkAuth();
      await get().fetchDashboard();

      set({ loading: false });
      return response.data;
    } catch (err) {
      set({ error: err.response?.data?.error || 'حدث خطأ أثناء تسجيل الأذكار.', loading: false });
      throw err;
    }
  }
}));

export default useAdhkarStore;
