import api from './api';

const adhkarServices = {
  getDashboard() {
    return api.get('/adhkar/dashboard');
  },
  getByCategory(category) {
    return api.get(`/adhkar/category/${category}`);
  },
  submitSession(category) {
    return api.post('/adhkar/session', { category });
  }
};

export default adhkarServices;
