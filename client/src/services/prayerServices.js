import api from './api';

const prayerServices = {
  getDashboard(latitude, longitude) {
    return api.get('/prayer/dashboard', {
      params: { latitude, longitude }
    });
  },
  record(data) {
    
    return api.post('/prayer/record', data);
  }
};

export default prayerServices;
