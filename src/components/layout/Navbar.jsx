import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, ChevronLeft, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useWallet } from '../../context/WalletContext';

// Page titles mapping
const pageTitles = {
  '/': 'Dashboard',
  '/wallet': 'Wallets',
  '/send': 'Send',
  '/receive': 'Receive',
  '/swap': 'Swap',
  '/history': 'History',
  '/market': 'Market',
  '/staking': 'Staking',
  '/nft': 'NFT Gallery',
  '/security': 'Security',
  '/settings': 'Settings',
  '/profile': 'Profile',
  '/notifications': 'Notifications',
};

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const title = pageTitles[location.pathname] || 'CryptoVault';

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-300/80 backdrop-blur-2xl border-b border-surface-200/40 dark:border-white/[0.04]">
      <div className="flex items-center justify-between h-[52px] sm:h-14 lg:h-16 px-3 sm:px-4 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="lg:hidden p-1.5 sm:p-2 -ml-1 rounded-xl hover:bg-surface-100 dark:hover:bg-dark-50 text-gray-600 dark:text-gray-400 transition-colors flex-shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <motion.h2
            key={title}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate"
          >
            {title}
          </motion.h2>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          {/* Theme toggle (mobile) */}
          <button
            onClick={toggleTheme}
            className="lg:hidden p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-dark-50 text-gray-500 dark:text-gray-400 transition-all duration-200"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Search */}
          <button
            onClick={() => navigate('/market')}
            className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-dark-50 text-gray-500 dark:text-gray-400 transition-all duration-200"
          >
            <Search size={18} />
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-dark-50 text-gray-500 dark:text-gray-400 transition-all duration-200"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
