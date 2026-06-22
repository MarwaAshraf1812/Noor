import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md" 
      dir="rtl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 w-full max-w-[92%] sm:max-w-md shadow-2xl border-4 border-blue-100 relative select-none text-right overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-100/30 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex justify-between items-center mb-5 sm:mb-6 relative z-10">
          <h2 className="text-xl sm:text-2xl font-black text-[#3b82f6]">
            تعديل بيانات البطل ✏️
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer text-xl sm:text-2xl font-bold bg-slate-50 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 border-2 border-red-100 text-red-600 font-bold text-sm rounded-2xl relative z-10">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 sm:space-y-6 relative z-10">
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
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xs sm:max-w-sm mx-auto justify-items-center">
              {avatarsList.map((avatar) => (
                <motion.button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.img)}
                  className={`w-14 h-14 xs:w-16 sm:w-20 h-14 xs:h-16 sm:h-20 rounded-full overflow-hidden border-4 cursor-pointer focus:outline-none transition-all duration-200 ${
                    selectedAvatar === avatar.img 
                      ? 'border-blue-500 ring-4 ring-blue-100 scale-105 shadow-md shadow-blue-100' 
                      : 'border-white hover:border-slate-100 hover:scale-105 shadow-sm'
                  }`}
                >
                  <img src={avatar.img} alt={avatar.id} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="w-full py-3.5 text-sm sm:text-base border-slate-200 text-slate-500 hover:bg-slate-50 font-bold rounded-2xl shadow-sm"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-sm sm:text-base font-bold rounded-2xl shadow-md shadow-blue-200/50"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
}
