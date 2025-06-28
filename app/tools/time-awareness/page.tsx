'use client'
import { useState, useEffect, useRef } from 'react'
import { Layout } from '../../components/Layout'

const BIRTH_YEAR_KEY = 'mymindfulkit_birth_year'
const TIMEZONE_KEY = 'mymindfulkit_timezone'
const LIFETARGETAGE_KEY = 'mymindfulkit_life_target_age'

// 常用时区列表（可根据需要扩展）
const COMMON_TIMEZONES = [
  'local',
  'UTC',
  'America/New_York',
  'Europe/London',
  'Europe/Paris',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Sydney',
]

function getUserDefaultTimezone() {
  if (typeof window !== 'undefined' && window.Intl && Intl.DateTimeFormat) {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  }
  return 'UTC'
}

function getDateInTimezone(timezone: string) {
  try {
    if (timezone === 'local') return new Date()
    // 利用toLocaleString和Date构造兼容性较好
    const now = new Date()
    const locale = 'en-US'
    const parts = new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(now)
    const get = (type: string) => parts.find(p => p.type === type)?.value
    return new Date(`${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`)
  } catch {
    return new Date()
  }
}

const VIEW_CONFIGS = (
  timezone: string, 
  weekViewMode: 'days' | 'hours',
  todayViewMode: 'tenMinutes' | 'hours',
  monthViewMode: 'days' | 'hours',
  lifeViewMode: 'years' | 'months',
  targetAge: number
) => ({
  today: {
    label: 'Today',
    getTitle: () => {
      const now = getDateInTimezone(timezone);
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    totalDots: () => {
      return todayViewMode === 'hours' ? 24 : 24 * 6;
    },
    getActiveDots: () => {
      const now = getDateInTimezone(timezone);
      if (todayViewMode === 'hours') {
        return now.getHours();
      }
      return now.getHours() * 6 + Math.floor(now.getMinutes() / 10);
    },
    getProgressText: () => {
      const now = getDateInTimezone(timezone);
      return `Day is ${((now.getHours() * 60 + now.getMinutes()) / 1440 * 100).toFixed(1)}% complete`;
    },
  },
  week: {
    label: 'Week',
    getTitle: () => 'Week',
    totalDots: () => {
      return weekViewMode === 'hours' ? 7 * 24 : 7;
    },
    getActiveDots: () => {
      const now = getDateInTimezone(timezone);
      const day = now.getDay() === 0 ? 6 : now.getDay() - 1; // Monday=0, Sunday=6
      if (weekViewMode === 'hours') {
        return day * 24 + now.getHours();
      }
      return day;
    },
    getProgressText: () => {
      const now = getDateInTimezone(timezone);
      const day = now.getDay() === 0 ? 6 : now.getDay() - 1;
      const totalHoursInWeek = 7 * 24;
      const currentHourOfWeek = day * 24 + now.getHours();
      return `Week is ${((currentHourOfWeek / totalHoursInWeek) * 100).toFixed(1)}% complete`;
    },
  },
  month: {
    label: 'Month',
    getTitle: () => getDateInTimezone(timezone).toLocaleString('en-US', { month: 'long' }),
    totalDots: () => {
      const now = getDateInTimezone(timezone);
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      return monthViewMode === 'hours' ? daysInMonth * 24 : daysInMonth;
    },
    getActiveDots: () => {
      const now = getDateInTimezone(timezone);
      if (monthViewMode === 'hours') {
        return (now.getDate() - 1) * 24 + now.getHours();
      }
      return now.getDate() - 1;
    },
    getProgressText: () => {
      const now = getDateInTimezone(timezone);
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const totalHoursInMonth = daysInMonth * 24;
      const currentHourOfMonth = (now.getDate() - 1) * 24 + now.getHours();
      return `Month is ${((currentHourOfMonth / totalHoursInMonth) * 100).toFixed(1)}% complete`;
    },
  },
  year: {
    label: 'Year',
    getTitle: () => getDateInTimezone(timezone).getFullYear(),
    totalDots: () => getDaysInYear(getDateInTimezone(timezone).getFullYear()),
    getActiveDots: () => {
      const now = getDateInTimezone(timezone)
      const start = new Date(now.getFullYear(), 0, 0)
      const diff = now.getTime() - start.getTime()
      const oneDay = 1000 * 60 * 60 * 24
      return Math.floor(diff / oneDay) - 1
    },
    getProgressText: () => {
      const now = getDateInTimezone(timezone)
      const start = new Date(now.getFullYear(), 0, 0)
      const diff = now.getTime() - start.getTime()
      const oneDay = 1000 * 60 * 60 * 24
      const dayOfYear = Math.floor(diff / oneDay)
      const totalDays = getDaysInYear(now.getFullYear())
      return `Year is ${(dayOfYear / totalDays * 100).toFixed(1)}% complete`
    },
  },
  life: {
    label: 'Life',
    getTitle: () => 'Life',
    totalDots: () => {
      return lifeViewMode === 'months' ? targetAge * 12 : targetAge;
    },
    getActiveDots: () => {
      if (typeof window === 'undefined') return -1;
      const birthYear = localStorage.getItem(BIRTH_YEAR_KEY);
      if (!birthYear) return -1;
      const now = getDateInTimezone(timezone);
      const age = now.getFullYear() - parseInt(birthYear, 10);
      if (lifeViewMode === 'months') {
        return (age - 1) * 12 + now.getMonth();
      }
      return age - 1;
    },
    getProgressText: () => {
      if (typeof window === 'undefined') return '';
      const birthYear = localStorage.getItem(BIRTH_YEAR_KEY);
      if (!birthYear) return 'Set your birth year to begin.';
      const now = getDateInTimezone(timezone);
      const age = now.getFullYear() - parseInt(birthYear, 10);
      if (lifeViewMode === 'months') {
        const totalMonths = targetAge * 12;
        const currentMonths = (age - 1) * 12 + now.getMonth();
        return `Life is ${((currentMonths / totalMonths) * 100).toFixed(1)}% complete`;
      }
      return `Life is ${((age / targetAge) * 100).toFixed(1)}% complete`;
    },
  },
})

function getDaysInYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) ? 366 : 365
}

const NAV_VIEWS = ['today', 'week', 'month', 'year', 'life'] as const

type ViewType = typeof NAV_VIEWS[number]

export default function TimeAwarenessPage() {
  const [view, setView] = useState<ViewType>('today')
  const [showModal, setShowModal] = useState(false)
  const [birthYear, setBirthYear] = useState<string>('')
  const [hasStoredBirthYear, setHasStoredBirthYear] = useState<boolean>(false)
  const [_, forceUpdate] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [timezone, setTimezone] = useState('local')
  const [showTzModal, setShowTzModal] = useState(false)
  const [weekViewMode, setWeekViewMode] = useState<'days' | 'hours'>('days')
  const [todayViewMode, setTodayViewMode] = useState<'tenMinutes' | 'hours'>('tenMinutes')
  const [monthViewMode, setMonthViewMode] = useState<'days' | 'hours'>('days')
  const [lifeViewMode, setLifeViewMode] = useState<'years' | 'months'>('years')
  const [targetAge, setTargetAge] = useState<number>(90)
  const [showLifeSettingsModal, setShowLifeSettingsModal] = useState(false)
  const [targetAgeInput, setTargetAgeInput] = useState<string>('90')
  const [birthYearInput, setBirthYearInput] = useState<string>('')

  // 初始化 birthYear 和检查是否已存储
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(BIRTH_YEAR_KEY)
      if (stored) {
        setBirthYear(stored)
        setHasStoredBirthYear(true)
      }
    }
  }, [])

  // 初始化时区
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(TIMEZONE_KEY)
      if (stored) {
        setTimezone(stored)
      } else {
        const detected = getUserDefaultTimezone()
        setTimezone(detected)
        localStorage.setItem(TIMEZONE_KEY, detected)
      }
    }
  }, [])

  // 切换视图时处理 modal - 只在切换视图时检查，不在输入时关闭
  useEffect(() => {
    if (view === 'life' && !hasStoredBirthYear) {
      setShowLifeSettingsModal(true)
    }
  }, [view, hasStoredBirthYear])

  // 定时刷新
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => forceUpdate(v => v + 1), 10000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [view])

  // useEffect for targetAge initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LIFETARGETAGE_KEY);
      if (stored) {
        setTargetAge(Number(stored));
      }
    }
  }, []);

  // When settings modal opens, sync inputs with current state
  useEffect(() => {
    if (showLifeSettingsModal) {
      setTargetAgeInput(String(targetAge));
      setBirthYearInput(birthYear);
    }
  }, [showLifeSettingsModal, targetAge, birthYear]);

  // 保存出生年份
  const handleSaveBirthYear = () => {
    if (!birthYear || +birthYear < 1920 || +birthYear > new Date().getFullYear()) {
      alert('Please enter a valid year.')
      return
    }
    localStorage.setItem(BIRTH_YEAR_KEY, birthYear)
    setHasStoredBirthYear(true)
    setShowModal(false)
    setView('life')
    forceUpdate(v => v + 1)
  }

  // 关闭 modal
  const handleCloseModal = () => {
    setShowModal(false)
    // 如果没有存储过出生年份，切换回 today 视图
    if (!hasStoredBirthYear) {
      setView('today')
    }
  }

  // 获取当前时区的 now
  const getNow = () => getDateInTimezone(timezone)

  // 渲染 dot grid
  const renderDots = () => {
    const config = VIEW_CONFIGS(timezone, weekViewMode, todayViewMode, monthViewMode, lifeViewMode, targetAge)[view]
    const totalDots = typeof config.totalDots === 'function' ? config.totalDots() : config.totalDots
    const activeDots = config.getActiveDots()
    const dots = []
    for (let i = 0; i < totalDots; i++) {
      let dotClass = 'bg-[#EAE8E3] dark:bg-[#23272e]'
      if (i < activeDots) dotClass = 'bg-[#3A3532] dark:bg-[#F8F7F4]'
      if (i === activeDots) dotClass = 'bg-[#FFC700]'
      dots.push(
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 flex-shrink-0 ${dotClass}`}
        />
      )
    }
    return (
      <div className="flex flex-wrap gap-2 justify-start align-top items-start">
        {dots}
      </div>
    )
  }

  // 渲染导航 tabs
  const renderTabs = () => (
    <div className="flex gap-5 text-base font-medium text-[#706C69] dark:text-[#9CA3AF]">
      {NAV_VIEWS.map(v => (
        <button
          key={v}
          className={`nav-tab pb-2 border-b-2 transition-colors ${view === v ? 'text-[#3A3532] dark:text-[#F8F7F4] font-bold border-[#FFC700]' : 'border-transparent'}`}
          onClick={() => setView(v)}
        >
          {VIEW_CONFIGS(timezone, weekViewMode, todayViewMode, monthViewMode, lifeViewMode, targetAge)[v].label}
        </button>
      ))}
    </div>
  )

  const handleRefreshClick = () => {
    if (view === 'today') {
      setTodayViewMode(prev => (prev === 'tenMinutes' ? 'hours' : 'tenMinutes'));
    } else if (view === 'week') {
      setWeekViewMode(prev => (prev === 'days' ? 'hours' : 'days'));
    } else if (view === 'month') {
      setMonthViewMode(prev => (prev === 'days' ? 'hours' : 'days'));
    } else if (view === 'life') {
      setLifeViewMode(prev => (prev === 'years' ? 'months' : 'years'));
    } else {
      forceUpdate(v => v + 1);
    }
  };

  const getButtonTitle = () => {
    if (view === 'today') return 'Toggle View (10-Min/Hours)';
    if (view === 'week') return 'Toggle View (Days/Hours)';
    if (view === 'month') return 'Toggle View (Days/Hours)';
    if (view === 'life') return 'Toggle View (Years/Months)';
    return 'Refresh';
  };

  const handleResetBirthYear = () => {
    localStorage.removeItem(BIRTH_YEAR_KEY);
    setBirthYear('');
    setHasStoredBirthYear(false);
    setShowLifeSettingsModal(false);
    if (view === 'life') {
      setView('today'); 
    }
  };

  const handleSaveLifeSettings = () => {
    const age = Number(targetAgeInput);
    if (age <= 20 || age >= 200) {
      alert("Please enter a reasonable target age (e.g., between 20 and 200).");
      return;
    }
    if (!birthYearInput || +birthYearInput < 1920 || +birthYearInput > new Date().getFullYear()) {
      alert('Please enter a valid birth year.');
      return;
    }
    // 始终覆盖保存出生年份
    localStorage.setItem(BIRTH_YEAR_KEY, birthYearInput);
    setBirthYear(birthYearInput);
    setHasStoredBirthYear(true);
    localStorage.setItem(LIFETARGETAGE_KEY, String(age));
    setTargetAge(age);
    setShowLifeSettingsModal(false);
    forceUpdate(v => v + 1);
  };

  const handleOpenSettings = () => {
    setShowLifeSettingsModal(true);
  };

  return (
    <Layout>
      {/* 时区设置区块，放在主卡片上方 */}
      <div className="max-w-lg mx-auto mt-8 mb-2 flex items-center justify-end gap-2">
        <span className="text-sm text-[#706C69] dark:text-[#9CA3AF]">Timezone:</span>
        <button
          className="px-3 py-1 rounded bg-[#F8F7F4] dark:bg-[#23272e] border border-[#EAE8E3] dark:border-[#23272e] text-[#1ABC9C] font-medium hover:bg-[#e0f7f4] dark:hover:bg-[#374151] transition-colors"
          onClick={() => setShowTzModal(true)}
        >
          {timezone === 'local' ? 'Local' : timezone}
        </button>
        {/* Settings Button - 齿轮图标 */}
        <button
          className="p-2 rounded bg-[#F8F7F4] dark:bg-[#23272e] border border-[#EAE8E3] dark:border-[#23272e] text-[#3A3532] dark:text-[#9CA3AF] hover:bg-[#e0f7f4] dark:hover:bg-[#374151] transition-colors"
          onClick={handleOpenSettings}
          title="Life View Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l2.12 2.12"/><path d="M19.07 4.93l-2.12 2.12"/><path d="M4.93 19.07l2.12-2.12"/><path d="M19.07 19.07l-2.12-2.12"/><path d="M12 8v4l3 3"/></svg>
        </button>
      </div>

      {/* 时区选择弹窗 */}
      {showTzModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={e => { if (e.target === e.currentTarget) setShowTzModal(false) }}>
          <div className="bg-white dark:bg-[#18181b] p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4 text-[#3A3532] dark:text-[#F8F7F4]">Select Timezone</h2>
            <select
              className="w-full p-3 mb-6 rounded border border-[#EAE8E3] dark:border-[#23272e] bg-[#F8F7F4] dark:bg-[#18181b] text-[#3A3532] dark:text-[#F8F7F4]"
              value={timezone}
              onChange={e => {
                setTimezone(e.target.value)
                localStorage.setItem(TIMEZONE_KEY, e.target.value)
                setShowTzModal(false)
              }}
            >
              {COMMON_TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz === 'local' ? 'Local (Auto)' : tz}</option>
              ))}
            </select>
            <button
              className="w-full p-3 rounded-lg bg-[#1ABC9C] text-white font-bold text-lg hover:bg-[#16a085] transition-colors"
              onClick={() => setShowTzModal(false)}
            >Close</button>
          </div>
        </div>
      )}

      {/* Unified Life Settings Modal */}
      {showLifeSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setShowLifeSettingsModal(false)}>
          <div className="bg-white dark:bg-[#18181b] p-8 rounded-2xl shadow-lg max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-6 text-[#3A3532] dark:text-[#F8F7F4]">Life View Settings</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-[#706C69] dark:text-[#9CA3AF]">Your Birth Year</label>
              <input 
                type="number"
                className="w-full p-3 text-lg font-bold text-center border-2 border-[#EAE8E3] dark:border-[#23272e] rounded-lg bg-[#F8F7F4] dark:bg-[#18181b] focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20"
                placeholder="e.g., 1990"
                value={birthYearInput}
                onChange={e => setBirthYearInput(e.target.value)}
                autoFocus
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-[#706C69] dark:text-[#9CA3AF]">Target Age</label>
              <input 
                type="number"
                className="w-full p-3 text-lg font-bold text-center border-2 border-[#EAE8E3] dark:border-[#23272e] rounded-lg bg-[#F8F7F4] dark:bg-[#18181b] focus:outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/20"
                value={targetAgeInput}
                onChange={e => setTargetAgeInput(e.target.value)}
              />
            </div>
            <button
              className="w-full p-3 rounded-lg bg-[#1ABC9C] text-white font-bold text-lg hover:bg-[#16a085] transition-colors"
              onClick={handleSaveLifeSettings}
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* 工具主区 */}
      <div className="max-w-lg mx-auto mt-12">
        <div className="bg-white dark:bg-[#18181b] rounded-3xl p-8 border border-[#EAE8E3] dark:border-[#23272e] shadow-lg">
          <div className="flex flex-wrap items-baseline gap-6 mb-8">
            <div className="text-5xl font-bold leading-none" id="main-title">
              {VIEW_CONFIGS(timezone, weekViewMode, todayViewMode, monthViewMode, lifeViewMode, targetAge)[view].getTitle()}
            </div>
            {renderTabs()}
          </div>
          <div className="pr-2 mb-2">
            {renderDots()}
          </div>
          <div className="flex justify-between items-center text-sm text-[#706C69] dark:text-[#9CA3AF] pt-6 mt-6 border-t border-[#EAE8E3] dark:border-[#23272e]">
            <button
              title={getButtonTitle()}
              className="p-2 text-[#706C69] dark:text-[#9CA3AF] hover:text-[#1ABC9C] dark:hover:text-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleRefreshClick}
              disabled={view === 'year'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
            </button>
            <div className="text-right">
              {view === 'life' && hasStoredBirthYear ? (
                (() => {
                  const birthYear = Number(localStorage.getItem(BIRTH_YEAR_KEY));
                  const now = getDateInTimezone(timezone);
                  const age = now.getFullYear() - birthYear;
                  return <div className="text-lg font-bold text-[#3A3532] dark:text-[#F8F7F4]">{age} years old</div>;
                })()
              ) : (
                <div>{VIEW_CONFIGS(timezone, weekViewMode, todayViewMode, monthViewMode, lifeViewMode, targetAge)[view].getProgressText()}</div>
              )}
              {(() => {
                const config = VIEW_CONFIGS(timezone, weekViewMode, todayViewMode, monthViewMode, lifeViewMode, targetAge)[view];
                const activeDots = config.getActiveDots();
                const totalDots = typeof config.totalDots === 'function' ? config.totalDots() : config.totalDots;
                if (activeDots < 0) return null;
                return (
                  <div className="text-xs text-[#A8A5A2] dark:text-[#6b7280] mt-1">
                    {`${activeDots + 1} / ${totalDots}`}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="max-w-3xl mx-auto mt-16 px-4">
        <section className="mb-16 leading-8">
          <h2 className="text-3xl font-bold text-center mb-12">Making Time Tangible</h2>
          <p className="mb-10 text-lg text-[#706C69] dark:text-[#9CA3AF]">For many neurodivergent minds, time doesn't feel like a linear progression. It's either "now" or "not now," a phenomenon often called 'Time Blindness'. This tool is designed to counteract that by transforming the abstract concept of time into a simple, visual, and tangible format.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#18181b] p-8 rounded-2xl border border-[#EAE8E3] dark:border-[#23272e] shadow-md text-center transition-all duration-300 hover:shadow-xl hover:border-[#1ABC9C] dark:hover:border-[#1ABC9C] hover:-translate-y-1">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#3A3532] dark:text-[#F8F7F4]">See Your Day</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF] leading-relaxed">Instead of just numbers, you see the day as a finite collection of dots, helping you to grasp its scope and structure.</p>
            </div>
            <div className="bg-white dark:bg-[#18181b] p-8 rounded-2xl border border-[#EAE8E3] dark:border-[#23272e] shadow-md text-center transition-all duration-300 hover:shadow-xl hover:border-[#1ABC9C] dark:hover:border-[#1ABC9C] hover:-translate-y-1">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600 dark:text-teal-400">
                    <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"></path>
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M12 12v-2"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#3A3532] dark:text-[#F8F7F4]">Feel the Flow</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF] leading-relaxed">Watching the dots fill up provides a calm, constant, and non-distracting awareness of time passing, reducing anxiety.</p>
            </div>
            <div className="bg-white dark:bg-[#18181b] p-8 rounded-2xl border border-[#EAE8E3] dark:border-[#23272e] shadow-md text-center transition-all duration-300 hover:shadow-xl hover:border-[#1ABC9C] dark:hover:border-[#1ABC9C] hover:-translate-y-1">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400">
                    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#3A3532] dark:text-[#F8F7F4]">Stay Grounded</h3>
              <p className="text-[#706C69] dark:text-[#9CA3AF] leading-relaxed">The visual progress acts as a mental anchor, gently pulling you back to the present moment and what you need to focus on right now.</p>
            </div>
          </div>
        </section>

        <section className="mb-16 leading-8">
          <h2 className="text-3xl font-bold text-center mb-12">Ways to Use Your Time Visualizer</h2>
          <ul className="space-y-8 max-w-2xl mx-auto text-lg text-[#706C69] dark:text-[#9CA3AF]">
            <li>
              <span className="font-semibold text-[#1ABC9C] dark:text-[#1ABC9C]">As a Focus Anchor:</span> Keep it open on a second monitor while working or studying. The silent progression of dots can help maintain your focus bubble.
            </li>
            <li>
              <span className="font-semibold text-[#1ABC9C] dark:text-[#1ABC9C]">For Task Transitioning:</span> Use the "Today" view to decide when to wrap up one task and start another. When you see you're entering a new 10-minute block, it's a gentle cue to switch gears.
            </li>
            <li>
              <span className="font-semibold text-[#1ABC9C] dark:text-[#1ABC9C]">For Long-Term Perspective:</span> Check the "Year" or "Life" view once a week. Seeing your life visualized can be a powerful motivator to prioritize what truly matters.
            </li>
          </ul>
        </section>

        <section className="mb-16" itemScope itemType="https://schema.org/FAQPage">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-white dark:bg-[#18181b] border border-[#EAE8E3] dark:border-[#23272e] rounded-xl shadow-md" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="flex justify-between items-center cursor-pointer px-6 py-5 text-lg font-bold text-[#3A3532] dark:text-[#F8F7F4]">
                <span itemProp="name">Is my birth year information private?</span>
                <span className="ml-4"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
              </summary>
              <div className="px-6 pb-6 text-[#706C69] dark:text-[#9CA3AF]" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text">Yes, 100%. Your birth year is saved <b>only</b> in your browser's local storage and never leaves your device. We cannot see or access it.</p>
              </div>
            </details>
            <details className="bg-white dark:bg-[#18181b] border border-[#EAE8E3] dark:border-[#23272e] rounded-xl shadow-md" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="flex justify-between items-center cursor-pointer px-6 py-5 text-lg font-bold text-[#3A3532] dark:text-[#F8F7F4]">
                <span itemProp="name">Why is visualizing time helpful for ADHD?</span>
                <span className="ml-4"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
              </summary>
              <div className="px-6 pb-6 text-[#706C69] dark:text-[#9CA3AF]" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text">It helps combat 'time blindness' by making the abstract concept of time concrete. Seeing the "shape" of your day or week can reduce anxiety and improve planning skills.</p>
              </div>
            </details>
            <details className="bg-white dark:bg-[#18181b] border border-[#EAE8E3] dark:border-[#23272e] rounded-xl shadow-md" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="flex justify-between items-center cursor-pointer px-6 py-5 text-lg font-bold text-[#3A3532] dark:text-[#F8F7F4]">
                <span itemProp="name">Can I use this on my phone?</span>
                <span className="ml-4"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
              </summary>
              <div className="px-6 pb-6 text-[#706C69] dark:text-[#9CA3AF]" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text">Absolutely. The tool is designed to be fully responsive and works beautifully on both desktop and mobile browsers.</p>
              </div>
            </details>
          </div>
        </section>
      </div>
    </Layout>
  )
} 