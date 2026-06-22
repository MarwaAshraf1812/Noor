import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import authServices from '../services/authServices';
import { getBaseURL } from '../services/api';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import noorLoginImg from '../assets/noor_login.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    /* global google */
    if (typeof google !== 'undefined') {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "741420309323-b29fptg10lt95h2bcr1q7284n8r8jb2b.apps.googleusercontent.com",
        scope: 'openid email profile',
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            setLoading(true);
            setEmailError('');
            setPasswordError('');
            try {
              const res = await authServices.googleLogin(tokenResponse.access_token, false);
              setUser(res.data.user);
              if (res.data.token) {
                localStorage.setItem('token', res.data.token);
              }
              navigate('/dashboard');
            } catch (err) {
              console.error("Google login failed:", err);
              const msg = err.response?.data?.message || 'فشل تسجيل الدخول باستخدام جوجل';
              setEmailError(msg);
            } finally {
              setLoading(false);
            }
          }
        },
      });
      client.requestAccessToken();
    } else {
      setEmailError("تعذر الاتصال بخدمة جوجل حالياً. تأكدي من اتصالك بالإنترنت أو أعد المحاولة.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setLoading(true);
    
    try {
      const response = await authServices.login({ email, password });
      setUser(response.data.user);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      
      if (msg.includes('البريد') || msg.includes('الحساب') || msg.includes('موجود') || msg.includes('registered')) {
        setEmailError('البريد الالكتروني غير مرتبط بحساب او تأكد من كتابة البريد بشكل صحيح. او يمكنك إنشاء حساب جديد الآن.');
      } else if (msg.includes('المرور') || msg.includes('password') || msg.includes('incorrect') || msg.includes('صح') || msg.includes('خطأ')) {
        setPasswordError('كلمة المرور غير صحيحه و يرجو اعادة كتابتها بشكل صحيح مره اخري');
      } else {
        setEmailError('البريد الالكتروني غير مرتبط بحساب او تأكد من كتابة البريد بشكل صحيح. او يمكنك إنشاء حساب جديد الآن.');
        setPasswordError('كلمة المرور غير صحيحه و يرجو اعادة كتابتها بشكل صحيح مره اخري');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white" dir="rtl">
      
      {/* Right Column: Form (55% Width on Desktop) */}
      <div className="w-full md:w-[55%] flex items-center justify-center p-8 sm:p-12 lg:p-16 md:border-l md:border-slate-200/80">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center md:text-right">
            <h2 className="text-3xl sm:text-4xl font-black text-[#3b82f6] leading-tight mb-2">
              أهلاً بعودتك يا بطل!
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="البريد الإلكتروني"
              id="email"
              type="email"
              placeholder="ادخل البريد الالكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              required
            />

            <Input
              label="كلمة المرور"
              id="password"
              type="password"
              placeholder="ادخل البريد الالكتروني"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              required
            />

            <div className="flex items-center justify-between text-sm sm:text-base select-none font-bold">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-2 border-slate-200 text-[#3b82f6] focus:ring-blue-500/30 cursor-pointer"
                />
                <span>تذكرني</span>
              </label>

              <Link to="/auth/forgot-password" className="text-[#3b82f6]/80 hover:text-[#3b82f6] hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-base sm:text-lg"
              >
                {loading ? 'جاري الدخول...' : 'دخول المغامره'}
              </Button>

              <Button
                variant="outline"
                type="button"
                disabled={loading}
                onClick={handleGoogleLogin}
                className="w-full py-3.5 border-slate-200 text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all rounded-xl font-bold"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.486 0-6.313-2.827-6.313-6.313s2.827-6.313 6.313-6.313c1.554 0 2.972.56 4.078 1.488l3.125-3.126C18.91 1.95 15.82 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c5.83 0 10.74-4.22 10.74-11 0-.67-.06-1.345-.19-1.928H12.24z"
                  />
                </svg>
                <span>تسجيل الدخول بجوجل</span>
              </Button>
            </div>
          </form>

          <div className="text-center font-bold text-sm sm:text-base text-slate-500 pt-4">
            <span>ليس لديك حساب؟ </span>
            <Link to="/auth/register" className="text-[#3b82f6] hover:underline">
              انشاء حساب
            </Link>
          </div>

        </div>
      </div>

      {/* Left Column: Gradient & Mascot Illustration (45% Width on Desktop) */}
      <div className="hidden md:flex md:w-[45%] bg-gradient-to-b from-[#a9d8ff] via-[#eff6ff] to-white relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-200/50 rounded-full blur-3xl"></div>

        <img 
          src={noorLoginImg} 
          alt="بطل نور والباب الذهبي" 
          className="absolute bottom-0 right-0 w-[105%] max-w-[560px] h-auto object-contain z-10 select-none" 
        />
      </div>

    </div>
  );
}