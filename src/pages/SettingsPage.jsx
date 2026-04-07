import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Globe, DollarSign, Moon, Sun, ChevronRight, LogOut, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { userProfile } from '../data/mockData';

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(userProfile.notificationsEnabled);
  const [lang, setLang] = useState(userProfile.language);
  const [currency, setCurrency] = useState(userProfile.currency);
  const [showLang, setShowLang] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);

  const languages = ['English', '한국어', '日本語', '中文', 'Español'];
  const currencies = ['USD', 'KRW', 'EUR', 'GBP', 'JPY'];

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }} className="space-y-4 sm:space-y-5">
      {/* Profile Card */}
      <motion.div variants={item}>
        <Card variant="gradient" padding="lg" onClick={() => navigate('/profile')} className="cursor-pointer">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full gradient-primary flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-glow">
              {userProfile.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-white">{userProfile.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{userProfile.email}</p>
              <span className="badge-success text-[10px] mt-1">KYC Verified</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </Card>
      </motion.div>

      {/* Settings List */}
      <motion.div variants={item}>
        <Card variant="solid" padding="none">
          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            {/* Theme */}
            <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-50 dark:hover:bg-dark-50/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                {isDark ? <Moon size={18} className="text-indigo-500" /> : <Sun size={18} className="text-indigo-500" />}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Appearance</p>
                <p className="text-xs text-gray-400">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            {/* Notifications */}
            <button onClick={() => navigate('/notifications')} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-50 dark:hover:bg-dark-50/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center">
                <Bell size={18} className="text-rose-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</p>
                <p className="text-xs text-gray-400">{notifs ? 'Enabled' : 'Disabled'}</p>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            {/* Language */}
            <button onClick={() => setShowLang(true)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-50 dark:hover:bg-dark-50/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/20 flex items-center justify-center">
                <Globe size={18} className="text-sky-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Language</p>
                <p className="text-xs text-gray-400">{lang}</p>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            {/* Currency */}
            <button onClick={() => setShowCurrency(true)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-50 dark:hover:bg-dark-50/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                <DollarSign size={18} className="text-emerald-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Currency</p>
                <p className="text-xs text-gray-400">{currency}</p>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={item}>
        <Card variant="solid" padding="none">
          <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
            <LogOut size={18} className="text-red-500" />
            <span className="text-sm font-semibold text-red-500">Sign Out</span>
          </button>
        </Card>
      </motion.div>

      {/* Language Modal */}
      <Modal isOpen={showLang} onClose={() => setShowLang(false)} title="Language">
        <div className="space-y-1">{languages.map(l => (
          <button key={l} onClick={() => { setLang(l); setShowLang(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${lang === l ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300 hover:bg-surface-100 dark:hover:bg-dark-50'}`}>
            {l}
          </button>
        ))}</div>
      </Modal>

      {/* Currency Modal */}
      <Modal isOpen={showCurrency} onClose={() => setShowCurrency(false)} title="Currency">
        <div className="space-y-1">{currencies.map(c => (
          <button key={c} onClick={() => { setCurrency(c); setShowCurrency(false); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${currency === c ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300 hover:bg-surface-100 dark:hover:bg-dark-50'}`}>
            {c}
          </button>
        ))}</div>
      </Modal>
    </motion.div>
  );
}
