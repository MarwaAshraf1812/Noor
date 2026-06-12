import api from './api';

const quranServices = {
  getDashboard() {
    return api.get('/quran/dashboard');
  },
  getSurahs() {
    return api.get('/quran/surahs');
  },
  submitSession(data) {
    // data structure: { surah_name, verse_count, type }
    return api.post('/quran/session', data);
  },
  updateTargets(data) {
    // data structure: { daily_hifz_target, daily_revision_target }
    return api.put('/quran/targets', data);
  }
};

export default quranServices;
