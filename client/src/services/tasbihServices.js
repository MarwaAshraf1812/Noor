import api from './api';

const tasbihServices = {
  getDashboard() {
    return api.get('/tasbih/dashboard');
  },
  submitSession(tasbihName, tasbihCount, completed) {
    return api.post('/tasbih/session', {
      tasbih_name: tasbihName,
      tasbih_count: Number(tasbihCount),
      completed: !!completed
    });
  }
};

export default tasbihServices;
