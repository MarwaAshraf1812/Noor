export const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getLastSevenDays = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days;
};

export const formatDateToYYYYMMDD = (date) => {
  return date.toISOString().split('T')[0];
};

export const getCurrentMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};
