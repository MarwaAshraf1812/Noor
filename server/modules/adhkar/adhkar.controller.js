import { logAdhkarSession, getAdhkarList, getAdhkarAnalytics } from './adhkar.service.js';

export const fetchAdhkarByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const list = await getAdhkarList(category);
    res.status(200).json(list);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const submitAdhkarSession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category } = req.body;
    
    if (!category) {
      return res.status(400).json({ error: 'برجاء تحديد نوع الأذكار المراد تسجيلها' });
    }

    const result = await logAdhkarSession(userId, category);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const fetchAdhkarDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const analytics = await getAdhkarAnalytics(userId);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
