import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Bell, Globe, DollarSign, Moon, Sun, ChevronRight,
  LogOut, HelpCircle, Info,
  CheckCircle2, Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { userProfile } from '../data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
};

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(userProfile.notificationsEnabled);
  const [lang, setLang] = useState(userProfile.language);
  const [currency, setCurrency] = useState(userProfile.currency);
  const [showLang, setShowLang] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);

  const languages = [
    { name: 'English', icon: '🇺🇸' },
    { name: '한국어', icon: '🇰🇷' },
    { name: '日本語', icon: '🇯🇵' },
    { name: '中文', icon: '🇨🇳' },
    { name: 'Español', icon: '🇪🇸' }
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-2xl mx-auto pb-16">

      {/* ===== MINI PROFILE CARD ===== */}
      <motion.div variants={item}>
        <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-violet-600 rounded-[32px] blur-xl opacity-5 group-hover:opacity-15 transition-opacity" />
          <Card variant="solid" padding="md" className="cursor-pointer border-none shadow-xl">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-[22px] gradient-primary flex items-center justify-center text-white text-2xl font-black shadow-lg">
                  {userProfile.name.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white dark:border-dark-100 rounded-lg flex items-center justify-center shadow-md">
                  <CheckCircle2 size={12} className="text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-primary-500 uppercase tracking-widest leading-none mb-1.5">Active Account</p>
                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-none mb-1">{userProfile.name}</h3>
                <p className="text-xs text-gray-400 font-medium truncate">{userProfile.email}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-dark-100 flex items-center justify-center text-gray-400 group-hover:text-primary-500 transition-colors">
                <ChevronRight size={20} />
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* ===== PREFERENCES GROUP ===== */}
      <motion.div variants={item} className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
          <Zap size={16} className="text-primary-500" /> General Preferences
        </h3>
        <Card variant="solid" padding="none">
          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            {/* Appearance Toggle */}
            <div className="flex items-center gap-4 px-6 py-5">
              <div className={`w-11 h-11 rounded-[16px] flex items-center justify-center transition-colors ${isDark ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'}`}>
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1.5">Appearance</p>
                <p className="text-xs text-gray-400 font-medium">Switch between light and dark themes</p>
              </div>
              <button onClick={toggleTheme} className="relative h-6 w-11 shrink-0 rounded-full bg-surface-200 dark:bg-dark-100 transition-colors duration-200 focus:outline-none">
                <div className={`absolute top-1 left-1 h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${isDark ? 'translate-x-5' : ''}`} style={{ backgroundColor: isDark ? '#6366f1' : 'white' }} />
              </button>
            </div>

            {/* Notifications */}
            <div className="w-full flex items-center gap-4 px-6 py-5 hover:bg-surface-50 dark:hover:bg-dark-50/20 transition-all text-left">
              <div className="w-11 h-11 rounded-[16px] bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Bell size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1.5">Smart Notifications</p>
                <p className="text-xs text-gray-400 font-medium">Get price alerts and transfer updates</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setNotifs(!notifs); }} className="relative h-6 w-11 shrink-0 rounded-full bg-surface-200 dark:bg-dark-100 transition-colors duration-200 focus:outline-none">
                <div className={`absolute top-1 left-1 h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${notifs ? 'translate-x-5' : ''}`} style={{ backgroundColor: notifs ? '#f43f5e' : 'white' }} />
              </button>
            </div>

            {/* Language */}
            <button onClick={() => setShowLang(true)} className="w-full flex items-center gap-4 px-6 py-5 hover:bg-surface-50 dark:hover:bg-dark-50/20 transition-all text-left">
              <div className="w-11 h-11 rounded-[16px] bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <Globe size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1.5">Language</p>
                <p className="text-xs text-gray-400 font-medium">{lang}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>

            {/* Currency */}
            <button onClick={() => setShowCurrency(true)} className="w-full flex items-center gap-4 px-6 py-5 hover:bg-surface-50 dark:hover:bg-dark-50/20 transition-all text-left">
              <div className="w-11 h-11 rounded-[16px] bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1.5">Display Currency</p>
                <p className="text-xs text-gray-400 font-medium">{currency}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* ===== SUPPORT & ABOUT ===== */}
      <motion.div variants={item} className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Support & Legals</h3>
        <Card variant="solid" padding="none">
          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            <button className="w-full flex items-center gap-4 px-6 py-5 hover:bg-surface-50 dark:hover:bg-dark-50/20 transition-all text-left">
              <div className="w-11 h-11 rounded-[16px] bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <HelpCircle size={20} />
              </div>
              <span className="flex-1 text-sm font-bold text-gray-900 dark:text-white">Help Center</span>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center gap-4 px-6 py-5 hover:bg-surface-50 dark:hover:bg-dark-50/20 transition-all text-left">
              <div className="w-11 h-11 rounded-[16px] bg-gray-500/10 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                <Info size={20} />
              </div>
              <span className="flex-1 text-sm font-bold text-gray-900 dark:text-white">Legal & Terms</span>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* ===== DANGER ZONE ===== */}
      <motion.div variants={item}>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-5 px-6 rounded-[28px] bg-red-500/[0.03] border border-red-500/10 hover:bg-red-500/5 transition-all group"
        >
          <LogOut size={20} className="text-red-500 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-black text-red-500 uppercase tracking-[0.2em] leading-none">Terminate Session</span>
        </button>
        <p className="text-[10px] text-center text-gray-400 mt-6 font-bold uppercase tracking-widest">CryptoVault v2.4.0 — Secure Architecture</p>
      </motion.div>

      {/* ===== LANGUAGE SELECTOR MODAL ===== */}
      <Modal isOpen={showLang} onClose={() => setShowLang(false)} title="Select Language">
        <div className="space-y-2 pt-2">
          {languages.map(l => (
            <button
              key={l.name}
              onClick={() => { setLang(l.name); setShowLang(false); }}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-[20px] transition-all ${lang === l.name
                  ? 'bg-primary-500/10 border-2 border-primary-500/20'
                  : 'bg-surface-100 dark:bg-dark-100/50 border-2 border-transparent hover:bg-surface-200 dark:hover:bg-dark-100'
                }`}
            >
              <div className="flex items-center gap-4 text-left">
                <span className="text-2xl">{l.icon}</span>
                <span className={`text-sm font-bold ${lang === l.name ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{l.name}</span>
              </div>
              {lang === l.name && <CheckCircle2 size={18} className="text-primary-500" />}
            </button>
          ))}
        </div>
      </Modal>

      {/* ===== CURRENCY SELECTOR MODAL ===== */}
      <Modal isOpen={showCurrency} onClose={() => setShowCurrency(false)} title="Market Currency">
        <div className="space-y-2 pt-2">
          {currencies.map(c => (
            <button
              key={c.code}
              onClick={() => { setCurrency(c.code); setShowCurrency(false); }}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-[20px] transition-all ${currency === c.code
                  ? 'bg-emerald-500/10 border-2 border-emerald-500/20'
                  : 'bg-surface-100 dark:bg-dark-100/50 border-2 border-transparent hover:bg-surface-200 dark:hover:bg-dark-100'
                }`}
            >
              <div className="flex items-center gap-4 text-left">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${currency === c.code ? 'bg-emerald-500 text-white' : 'bg-surface-200 dark:bg-dark-200 text-gray-500'
                  }`}>
                  {c.symbol}
                </div>
                <div>
                  <p className={`text-sm font-bold leading-none mb-1 ${currency === c.code ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{c.code}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{c.name}</p>
                </div>
              </div>
              {currency === c.code && <CheckCircle2 size={18} className="text-emerald-500" />}
            </button>
          ))}
        </div>
      </Modal>

    </motion.div>
  );
}
