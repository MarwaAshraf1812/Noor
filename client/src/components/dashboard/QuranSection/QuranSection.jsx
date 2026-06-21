import React, { useState, useEffect, useMemo } from 'react';
import useQuranStore from '../../../store/quranStore';
import useAuthStore from '../../../store/authStore';
import QuranCard from './QuranCard';
import QuranLogModal from './QuranLogModal';
import TargetSettings from './TargetSettings';
import WeekTracker from './WeekTracker';
import DayStatusModal from './DayStatusModal';
import TargetSuccessModal from './TargetSuccessModal';
import friendOfQuranImg from '../../../assets/friend_of_quran.png';
import { playPopSound } from '../../../utils/audio';
import { Settings } from 'lucide-react';

export default function QuranSection() {
    const { user } = useAuthStore();
    const { dashboardData, fetchDashboard, updateTargets, loading, error } = useQuranStore();
    const [logModalOpen, setLogModalOpen] = useState(false);
    const [modalDefaultType, setModalDefaultType] = useState('HIFZ');
    const [showSettings, setShowSettings] = useState(false);
    const [hifzTargetInput, setHifzTargetInput] = useState(15);
    const [revisionTargetInput, setRevisionTargetInput] = useState(15);

    // State for active day status popup
    const [activeDayStatus, setActiveDayStatus] = useState(null);

    // State for target update success popup
    const [showTargetSuccess, setShowTargetSuccess] = useState(false);

    useEffect(() => {
        fetchDashboard().catch(e => console.error(e));
    }, [fetchDashboard]);

    useEffect(() => {
        if (dashboardData?.analytics) {
            setHifzTargetInput(dashboardData.analytics.todayHifz?.target || 15);
            setRevisionTargetInput(dashboardData.analytics.todayRevision?.target || 15);
        }
    }, [dashboardData]);

    const handleOpenLog = (type) => {
        playPopSound();
        setModalDefaultType(type);
        setLogModalOpen(true);
    };

    const handleSaveTargets = async (e) => {
        e.preventDefault();
        const hifzVal = Number(hifzTargetInput);
        const revisionVal = Number(revisionTargetInput);
        
        if (isNaN(hifzVal) || isNaN(revisionVal) || hifzVal <= 0 || revisionVal <= 0) {
            alert('الرجاء إدخال أعداد صحيحة أكبر من الصفر للأهداف');
            return;
        }
        if (hifzVal > 1000 || revisionVal > 1000) {
            alert('الحد الأقصى اليومي للأهداف هو 1000 آية');
            return;
        }

        try {
            await updateTargets(hifzVal, revisionVal);
            setShowSettings(false);
            setShowTargetSuccess(true);
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء تحديث الأهداف');
        }
    };

    const handleDayClick = (day) => {
        playPopSound();
        setActiveDayStatus(day);
    };

    const analytics = dashboardData?.analytics;
    const currentSurah = dashboardData?.currentSurah;
    const totalHifz = dashboardData?.analytics?.totalHifz || 0;
    const weeklyActivity = analytics?.weeklyActivity || [];

    const getTodayLocalMidnightInEgypt = () => {
        const offsetMs = 3 * 60 * 60 * 1000;
        const localTime = new Date(new Date().getTime() + offsetMs);
        const year = localTime.getUTCFullYear();
        const month = String(localTime.getUTCMonth() + 1).padStart(2, '0');
        const day = String(localTime.getUTCDate()).padStart(2, '0');
        return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    };

    const weekDays = useMemo(() => {
        const today = getTodayLocalMidnightInEgypt();
        const dayOfWeek = today.getUTCDay(); // 0: Sun, 1: Mon, ..., 6: Sat

        // Calculate distance to Saturday (starts at 6)
        const diffToSaturday = dayOfWeek === 6 ? 0 : -(dayOfWeek + 1);

        const weekDaysArr = [];
        const arabicNames = [
            { name: 'السبت', code: 6 },
            { name: 'الأحد', code: 0 },
            { name: 'الأثنين', code: 1 },
            { name: 'الثلاثاء', code: 2 },
            { name: 'الاربعاء', code: 3 },
            { name: 'الخميس', code: 4 },
            { name: 'الجمعه', code: 5 }
        ];

        for (let i = 0; i < 7; i++) {
            const targetDate = new Date(today);
            targetDate.setUTCDate(today.getUTCDate() + diffToSaturday + i);

            const activeItem = weeklyActivity.find(w => {
                const itemDate = new Date(w.date);
                return itemDate.getTime() === targetDate.getTime();
            });

            weekDaysArr.push({
                dayName: arabicNames[i].name,
                date: targetDate,
                isCompleted: activeItem ? activeItem.active : false,
                isToday: targetDate.getTime() === today.getTime()
            });
        }

        return weekDaysArr;
    }, [weeklyActivity]);

    return (
        <div className="w-full flex flex-col gap-6 select-none" dir="rtl">

            {/* Target Setting / Gear Row */}
            <div className="flex justify-end gap-3 px-1">
                <button
                    onClick={() => { playPopSound(); setShowSettings(!showSettings); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all font-black text-xs cursor-pointer active:scale-95 border border-slate-200/50 shadow-sm"
                >
                    <Settings className="w-4 h-4" />
                    <span>تعديل الأهداف اليومية</span>
                </button>
            </div>

            {/* Target Setting Panel */}
            {showSettings && (
                <TargetSettings
                    hifzTargetInput={hifzTargetInput}
                    setHifzTargetInput={setHifzTargetInput}
                    revisionTargetInput={revisionTargetInput}
                    setRevisionTargetInput={setRevisionTargetInput}
                    onSubmit={handleSaveTargets}
                    onCancel={() => setShowSettings(false)}
                />
            )}

            {/* Detail Cards Row */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 border border-red-200 p-5 rounded-2xl text-center font-bold">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto items-stretch mt-2">

                    {/* Card 1: Revision (آيات راجعتها) */}
                    <QuranCard
                        type="revision"
                        title="آيات راجعتها"
                        target={analytics?.todayRevision?.target || 15}
                        verseCount={analytics?.todayRevision?.verse_count || 0}
                        progress={analytics?.todayRevision?.progress || 0}
                        remaining={Math.max(0, (analytics?.todayRevision?.target || 15) - (analytics?.todayRevision?.verse_count || 0))}
                        colorTheme="blue"
                        onAction={() => handleOpenLog('REVISION')}
                    />

                    {/* Card 2: Total Stats (آيات حفظتها) */}
                    <QuranCard
                        type="total_stats"
                        title="آيات حفظتها"
                        value={totalHifz}
                        mascot={friendOfQuranImg}
                        colorTheme="yellow"
                    />

                    {/* Card 3: Hifz Target (تاج الحافظ) */}
                    <QuranCard
                        type="hifz"
                        title="تاج الحافظ"
                        subtitle={currentSurah ? `أنت الآن بطل سورة ${currentSurah.surahName}` : 'أنت الآن بطل سورة النَّبَأَ'}
                        target={analytics?.todayHifz?.target || 15}
                        verseCount={analytics?.todayHifz?.verse_count || 0}
                        progress={analytics?.todayHifz?.progress || 0}
                        remaining={Math.max(0, (analytics?.todayHifz?.target || 15) - (analytics?.todayHifz?.verse_count || 0))}
                        colorTheme="green"
                        onAction={() => handleOpenLog('HIFZ')}
                    />

                </div>
            )}

            {/* Week Tracker Panel */}
            <WeekTracker
                user={user}
                weekDays={weekDays}
                handleDayClick={handleDayClick}
                handleOpenLog={handleOpenLog}
            />

            {/* Interactive Day Status Popup */}
            <DayStatusModal
                isOpen={Boolean(activeDayStatus)}
                onClose={() => setActiveDayStatus(null)}
                dayStatus={activeDayStatus}
            />

            {/* Interactive Quran Log Modal */}
            <QuranLogModal
                isOpen={logModalOpen}
                onClose={() => setLogModalOpen(false)}
                defaultType={modalDefaultType}
            />

            {/* Target Success Popup Modal with custom gradient */}
            <TargetSuccessModal
                isOpen={showTargetSuccess}
                onClose={() => setShowTargetSuccess(false)}
            />

        </div>
    );
}