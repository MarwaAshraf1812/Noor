import { create } from 'zustand';
import authServices from '../services/authServices';

const getCachedUser = () => {
  try {
    const cached = localStorage.getItem('noor_user');
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: getCachedUser(),

  loading: !getCachedUser(), 
  
  setUser: (user) => {
    if (user) {
      localStorage.setItem('noor_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('noor_user');
    }
    set({ user });
  },
  
  checkAuth: async () => {
    try {
      const response = await authServices.me();
      if (response.data && response.data.success) {
        const user = response.data.user;
        localStorage.setItem('noor_user', JSON.stringify(user));
        set({ user, loading: false });
      } else {
        localStorage.removeItem('noor_user');
        localStorage.removeItem('token');
        set({ user: null, loading: false });
      }
    } catch (error) {
      
      localStorage.removeItem('noor_user');
      localStorage.removeItem('token');
      set({ user: null, loading: false });
    }
  },

  logout: async () => {
    try {
      await authServices.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      
      localStorage.removeItem('noor_user');
      localStorage.removeItem('token');
      set({ user: null });
    }
  }
}));

export default useAuthStore;
