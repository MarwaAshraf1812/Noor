import api from './api';

const quranServices = {
  getDashboard() {
    return api.get('/quran/dashboard');
  },
  getSurahs() {
    return api.get('/quran/surahs');
  },
  submitSession(data) {
    
    return api.post('/quran/session', data);
  },
  updateTargets(data) {
    
    return api.put('/quran/targets', data);
  }
};

export default quranServices;
