import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import authServices from '../../services/authServices';
import Button from './Button';
import Input from './Input';

import avatarGreenBoy from '../../assets/avatar_green_boy.png';
import avatarBlueBoy from '../../assets/avtar_blue_boy.png';
import avatarYellowBoy from '../../assets/avatar_yellow_boy.png';
import avatarGreenGirl from '../../assets/avtar_green_girl.png';
import avatarBlueGirl from '../../assets/avatar_blue_girl.png';
import avatarYellowGirl from '../../assets/avatar_yellow_girl.png';

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarGreenBoy);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const avatarsList = [
    { id: 'green_boy', img: avatarGreenBoy },
    { id: 'blue_boy', img: avatarBlueBoy },
    { id: 'yellow_boy', img: avatarYellowBoy },
    { id: 'green_girl', img: avatarGreenGirl },
    { id: 'blue_girl', img: avatarBlueGirl },
    { id: 'yellow_girl', img: avatarYellowGirl },
  ];

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      // Match current avatar_url with one of the local assets
      if (user.avatar_url) {
        const found = avatarsList.find(a => user.avatar_url.includes(a.img));
        if (found) {
          setSelectedAvatar(found.img);
        }
      }
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى إدخال اسم البطل');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const absoluteAvatarUri = window.location.origin + selectedAvatar;
      const response = await authServices.updateProfile({
        name: name.trim(),
        avatar_url: absoluteAvatarUri,
      });

      if (response.data && response.data.success) {
        setUser(response.data.user);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء حفظ التعديلات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative z-10 select-none text-right"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#3b82f6]">
              تعديل بيانات البطل ✏️
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer text-2xl font-bold"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-red-50 border border-red-100 text-red-600 font-bold text-sm rounded-xl">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <Input
              label="اسم البطل"
              id="heroName"
              type="text"
              placeholder="مثلاً: البطل عمر"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="space-y-3">
              <label className="text-[#1e3a8a] font-bold text-sm block">
                اختر رفيقك في الرحلة 💫
              </label>
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto justify-items-center">
                {avatarsList.map((avatar) => (
                  <motion.button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.img)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 cursor-pointer focus:outline-none transition-all duration-200 ${
                      selectedAvatar === avatar.img 
                        ? 'border-blue-500 ring-4 ring-blue-100 scale-105' 
                        : 'border-transparent hover:scale-105'
                    }`}
                  >
                    <img src={avatar.img} alt={avatar.id} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-base"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                className="w-full py-3 text-base border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
