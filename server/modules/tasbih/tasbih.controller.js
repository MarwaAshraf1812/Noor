import { logTasbihSession, getTasbihAnalytics } from './tasbih.service.js';

const SUPPORTED_TASBIH_NAMES = [
  "سبحان الله",
  "الحمدلله",
  "الله أكبر",
  "سبحان الله وبحمده"
];

export const submitTasbihSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tasbih_name, tasbih_count, completed } = req.body;

    if (!tasbih_name) {
      return res.status(400).json({ error: "اسم التسبيحة مطلوب" });
    }

    if (!SUPPORTED_TASBIH_NAMES.includes(tasbih_name)) {
      return res.status(400).json({ error: "اسم التسبيحة غير مدعوم، يرجى اختيار تسبيحة من القائمة المدعومة" });
    }

    const parsedCount = parseInt(tasbih_count, 10);
    if (isNaN(parsedCount) || parsedCount < 0) {
      return res.status(400).json({ error: "يجب أن يكون عدد التسبيحات رقماً صحيحاً موجباً" });
    }

    const result = await logTasbihSession(userId, {
      tasbih_name,
      tasbih_count: parsedCount,
      completed: !!completed
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const fetchTasbihDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const analytics = await getTasbihAnalytics(userId);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
