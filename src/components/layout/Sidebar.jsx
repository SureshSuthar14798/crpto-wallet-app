import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Wallet, ArrowUpDown, History, BarChart3,
  Shield, Settings, Layers, PiggyBank, Sun, Moon, LogOut
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/wallet', icon: Wallet, label: 'Wallets' },
  { path: '/send', icon: ArrowUpDown, label: 'Send / Receive' },
  { path: '/swap', icon: Layers, label: 'Swap' },
  { path: '/history', icon: History, label: 'History' },
  { path: '/market', icon: BarChart3, label: 'Market' },
  { path: '/staking', icon: PiggyBank, label: 'Staking' },
  { path: '/security', icon: Shield, label: 'Security' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-full bg-white dark:bg-dark-200 border-r border-surface-200/50 dark:border-white/[0.04] px-4 py-6">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Wallet size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">CryptoVault</h1>
          <p className="text-[10px] text-primary-500 dark:text-primary-400 font-bold uppercase tracking-wider mt-1.5">Elite Wallet</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="space-y-1.5 overflow-y-auto no-scrollbar pb-6">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/[0.08] shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-surface-50 dark:hover:bg-dark-50/40'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute left-0 w-1.5 h-6 rounded-r-full bg-primary-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={19} className={isActive ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors'} />
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="mt-auto pt-6 flex flex-col gap-1">
        <button
          onClick={toggleTheme}
          className="group w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-surface-50 dark:hover:bg-dark-50/40 transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-xl bg-surface-100 dark:bg-dark-50 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-dark-100 shadow-sm transition-all">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </div>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={logout}
          className="group w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
            <LogOut size={16} />
          </div>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
