import React from 'react';
import { playPopSound } from '../../../utils/audio';
import { X, Save, BookOpen, RefreshCw } from 'lucide-react';

export default function TargetSettings({
  hifzTargetInput,
  setHifzTargetInput,
  revisionTargetInput,
  setRevisionTargetInput,
  onSubmit,
  onCancel
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm  z-50 flex items-center justify-center p-4 select-none animate-fadeIn" dir="rtl">
      <div className="bg-gradient-to-b from-[#FFFFFF] to-[#FFFDF0] w-full max-w-md rounded-[32px] border-4 border-amber-300/40 shadow-2xl p-6 relative overflow-visible">
        
        {}
        <button 
          onClick={() => { playPopSound(); onCancel(); }}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all active:scale-90 cursor-pointer border border-slate-200/20"
        >
          <X className="w-5 h-5" />
        </button>

        {}
        <div className="text-center mb-6 px-6">
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center justify-center gap-2">
            🎯 اضبط أهدافك اليومية للقرآن
          </h3>
          <p className="text-xs sm:text-sm font-extrabold text-slate-400 mt-1">
            حدد عدد الآيات التي تريد حفظها ومراجعتها يومياً! 🌟
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4">
            
            {}
            <div className="bg-emerald-50/50 border border-emerald-100/60 p-4 rounded-2xl flex flex-col gap-2">
              <label className="text-sm font-black text-emerald-800 flex items-center gap-1.5">
                <BookOpen className="w-4.5 h-4.5 text-emerald-600" />
                <span>هدف الحفظ اليومي (آيات):</span>
              </label>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setHifzTargetInput(Math.max(1, hifzTargetInput - 1)); playPopSound(); }}
                  className="w-11 h-11 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-lg flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={hifzTargetInput}
                  onChange={(e) => setHifzTargetInput(Math.max(1, Number(e.target.value)))}
                  className="flex-1 py-2.5 px-3 rounded-xl border-2 border-emerald-200/80 focus:outline-none focus:border-emerald-500 bg-white font-black text-center text-slate-800 text-lg transition-all"
                />
                <button
                  type="button"
                  onClick={() => { setHifzTargetInput(hifzTargetInput + 1); playPopSound(); }}
                  className="w-11 h-11 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-lg flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            {}
            <div className="bg-blue-50/50 border border-blue-100/60 p-4 rounded-2xl flex flex-col gap-2">
              <label className="text-sm font-black text-blue-800 flex items-center gap-1.5">
                <RefreshCw className="w-4.5 h-4.5 text-blue-600 animate-spin-slow" />
                <span>هدف المراجعة اليومي (آيات):</span>
              </label>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setRevisionTargetInput(Math.max(1, revisionTargetInput - 1)); playPopSound(); }}
                  className="w-11 h-11 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-black text-lg flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={revisionTargetInput}
                  onChange={(e) => setRevisionTargetInput(Math.max(1, Number(e.target.value)))}
                  className="flex-1 py-2.5 px-3 rounded-xl border-2 border-blue-200/80 focus:outline-none focus:border-blue-500 bg-white font-black text-center text-slate-800 text-lg transition-all"
                />
                <button
                  type="button"
                  onClick={() => { setRevisionTargetInput(revisionTargetInput + 1); playPopSound(); }}
                  className="w-11 h-11 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-black text-lg flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {}
          <div className="flex items-center gap-3 mt-2">
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-base shadow-lg shadow-amber-200/50 hover:shadow-xl hover:shadow-amber-300/50 transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>حفظ الأهداف الجديدة</span>
            </button>
            <button
              type="button"
              onClick={() => { playPopSound(); onCancel(); }}
              className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm transition-all active:scale-95 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
