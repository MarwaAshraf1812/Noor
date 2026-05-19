import { logTasbihSession, getTasbihAnalytics } from './tasbih.service.js';

export const submitTasbihSession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const tasbihData = req.body;

    if (!tasbihData.tasbih_name) {
      return res.status(400).json({ error: "اسم التسبيحة مطلوب" });
    }

    const result = await logTasbihSession(userId, tasbihData);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const fetchTasbihDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const analytics = await getTasbihAnalytics(userId);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
