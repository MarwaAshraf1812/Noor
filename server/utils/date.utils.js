export const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const getStartOfToday = (timezone = 'Africa/Cairo') => {
  const nowStr = new Date().toLocaleString("en-US", { timeZone: timezone });
  const today = new Date(nowStr);
  today.setHours(0, 0, 0, 0);
  return today;
};

export const getLastSevenDays = (timezone = 'Africa/Cairo') => {
  const days = [];
  const nowStr = new Date().toLocaleString("en-US", { timeZone: timezone });
  for (let i = 6; i >= 0; i--) {
    const d = new Date(nowStr);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days;
};

export const formatDateToYYYYMMDD = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getCurrentMinutes = (timezone = 'Africa/Cairo') => {
  const nowStr = new Date().toLocaleString("en-US", { timeZone: timezone, hour12: false, hour: '2-digit', minute: '2-digit' });
  const [hours, minutes] = nowStr.split(':').map(Number);
  return (hours % 24) * 60 + minutes;
};

