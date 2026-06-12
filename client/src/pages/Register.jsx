import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import authServices from '../services/authServices';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

import noorRegisterImg from '../assets/noor_register.png';
import noorRegisterChildImg from '../assets/noor_register_child.png';

import avatarGreenBoy from '../assets/avatar_green_boy.png';
import avatarBlueBoy from '../assets/avtar_blue_boy.png';
import avatarYellowBoy from '../assets/avatar_yellow_boy.png';
import avatarGreenGirl from '../assets/avtar_green_girl.png';
import avatarBlueGirl from '../assets/avatar_blue_girl.png';
import avatarYellowGirl from '../assets/avatar_yellow_girl.png';

export default function Register() {
  const [step, setStep] = useState(1);
  
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [childName, setChildName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarGreenBoy);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const avatarsList = [
    { id: 'green_boy', img: avatarGreenBoy },
    { id: 'blue_boy', img: avatarBlueBoy },
    { id: 'yellow_boy', img: avatarYellowBoy },
    { id: 'green_girl', img: avatarGreenGirl },
    { id: 'blue_girl', img: avatarBlueGirl },
    { id: 'yellow_girl', img: avatarYellowGirl },
  ];

  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }
    if (password.length < 6) {
      setError('كلمة المرور ضعيفة، اختر ٦ رموز على الأقل.');
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const absoluteAvatarUri = window.location.origin + selectedAvatar;
      const response = await authServices.register({
        name: childName,
        email,
        password,
        avatar_url: absoluteAvatarUri
      });
      
      setUser(response.data.user);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white" dir="rtl">
      
      {/* Right Column: Form Area (55% Width on Desktop) */}
      <div className="w-full md:w-[55%] flex items-center justify-center p-8 sm:p-12 lg:p-16 md:border-l md:border-slate-200/80">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center md:text-right">
                  <h2 className="text-3xl sm:text-4xl font-black text-[#3b82f6] leading-tight mb-2">
                    انضم لعائلة <span className="text-[#f59e0b]">نور</span>!
                  </h2>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-100 text-red-600 font-bold text-sm rounded-2xl text-right">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleNextStep} className="space-y-4">
                  <Input
                    label="البريد الإلكتروني"
                    id="email"
                    type="email"
                    placeholder="ادخل البريد الالكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <Input
                    label="كلمة المرور"
                    id="password"
                    type="password"
                    placeholder="اختر كلمة مرور قوية"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <Input
                    label="تأكيد كلمة المرور"
                    id="confirmPassword"
                    type="password"
                    placeholder="أعد كتابة كلمة المرور"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  <div className="pt-2">
                    <Button type="submit" className="w-full py-3.5 text-base sm:text-lg">
                      نتعرف على بطلنا
                    </Button>
                  </div>
                </form>

                <div className="text-center font-bold text-sm sm:text-base text-slate-500 pt-2">
                  <span>لديك حساب بالفعل؟ </span>
                  <Link to="/auth/login" className="text-[#3b82f6] hover:underline">
                    تسجيل الدخول
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center md:text-right">
                  <h2 className="text-3xl sm:text-4xl font-black text-[#3b82f6] leading-tight mb-2">
                    مرحباً بك يا بطل!
                  </h2>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-100 text-red-600 font-bold text-sm rounded-2xl text-right">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="اكتب اسمك البطولي"
                    id="childName"
                    type="text"
                    placeholder="مثلاً: البطل عمر"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    required
                  />

                  <div className="space-y-3">
                    <label className="text-[#1e3a8a] font-bold text-sm block">
                      اختر رفيقك في الرحلة *
                    </label>
                    <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto justify-items-center">
                      {avatarsList.map((avatar) => (
                        <motion.button
                          key={avatar.id}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar.img)}
                          className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 cursor-pointer focus:outline-none transition-all duration-200 ${
                            selectedAvatar === avatar.img 
                              ? 'border-blue-500 ring-4 ring-blue-100 scale-105' 
                              : 'border-transparent hover:scale-105'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img 
                            src={avatar.img} 
                            alt="رفيق الرحلة" 
                            className="w-full h-full object-cover select-none"
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="flex-1 py-3.5 text-base sm:text-lg"
                    >
                      {loading ? 'جاري التحميل...' : 'هيا بنا لدخول المغامره'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="px-4 py-3.5 border-slate-200 text-slate-500"
                    >
                      رجوع
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Left Column: Gradient & Illustration (45% Width on Desktop) */}
      <div className="hidden md:flex md:w-[45%] bg-gradient-to-b from-[#a9d8ff] via-[#eff6ff] to-white relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-200/50 rounded-full blur-3xl"></div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.img 
              key="mascotStep1"
              src={noorRegisterImg} 
              alt="بطل نور والمنطاد" 
              className="absolute bottom-0 right-0 w-[105%] max-w-[560px] h-auto object-contain z-10 select-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.img 
              key="mascotStep2"
              src={noorRegisterChildImg} 
              alt="بطل نور والمنطاد الصغير" 
              className="absolute bottom-0 right-0 w-[105%] max-w-[560px] h-auto object-contain z-10 select-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}