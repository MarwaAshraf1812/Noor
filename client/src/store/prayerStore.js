import { create } from 'zustand';
import prayerServices from '../services/prayerServices';
import useAuthStore from './authStore';

const DEFAULT_LAT = 30.0444;
const DEFAULT_LNG = 31.2357;

const usePrayerStore = create((set, get) => ({
  dashboardData: null,
  loading: false,
  error: null,

  fetchDashboard: async (lat, lng) => {
    set({ loading: true, error: null });
    const latitude = lat ?? DEFAULT_LAT;
    const longitude = lng ?? DEFAULT_LNG;
    try {
      const response = await prayerServices.getDashboard(latitude, longitude);
      set({ dashboardData: response.data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'حدث خطأ أثناء جلب بيانات الصلاة.', loading: false });
    }
  },

  recordPrayer: async (prayerName, status, location, lat, lng) => {
    set({ loading: true, error: null });
    const latitude = lat ?? DEFAULT_LAT;
    const longitude = lng ?? DEFAULT_LNG;
    try {
      const response = await prayerServices.record({
        prayerName,
        status,
        location: location || 'منزل',
        latitude,
        longitude
      });
      
      // Refresh user gems & levels after recording a prayer
      await useAuthStore.getState().checkAuth();
      
      // Refresh the dashboard data
      await get().fetchDashboard(latitude, longitude);
      
      set({ loading: false });
      return response.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'حدث خطأ أثناء تسجيل الصلاة.', loading: false });
      throw err;
    }
  }
}));

export default usePrayerStore;
