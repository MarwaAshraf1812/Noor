import { create } from 'zustand';
import prayerServices from '../services/prayerServices';
import useAuthStore from './authStore';

const DEFAULT_LAT = 30.0444;
const DEFAULT_LNG = 31.2357;

const usePrayerStore = create((set, get) => ({
  dashboardData: null,
  loading: false,
  error: null,
  userLat: null,
  userLng: null,

  fetchDashboard: async (lat, lng) => {
    set({ loading: true, error: null });

    let latitude = lat;
    let longitude = lng;

    if (!latitude || !longitude) {
      latitude = get().userLat;
      longitude = get().userLng;
    }

    if (!latitude || !longitude) {
      if (navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          latitude = pos.coords.latitude;
          longitude = pos.coords.longitude;
        } catch (error) {
          console.warn('Geolocation error or denied. Using default location.');
          latitude = DEFAULT_LAT;
          longitude = DEFAULT_LNG;
        }
      } else {
        latitude = DEFAULT_LAT;
        longitude = DEFAULT_LNG;
      }
    }

    set({ userLat: latitude, userLng: longitude });

    try {
      const response = await prayerServices.getDashboard(latitude, longitude);
      set({ dashboardData: response.data.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'حدث خطأ أثناء جلب بيانات الصلاة.', loading: false });
    }
  },

  recordPrayer: async (prayerName, status, location, dateStr = null, lat = null, lng = null) => {
    set({ loading: true, error: null });
    const latitude = lat ?? get().userLat ?? DEFAULT_LAT;
    const longitude = lng ?? get().userLng ?? DEFAULT_LNG;
    try {
      const response = await prayerServices.record({
        prayerName,
        status,
        location: location || 'منزل',
        dateStr,
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
