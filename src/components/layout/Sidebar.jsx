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
    <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 bg-white/80 dark:bg-dark-200/80 backdrop-blur-2xl border-r border-surface-200/60 dark:border-white/[0.06] px-4 py-6 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
          <Wallet size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">CryptoVault</h1>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">Premium Wallet</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50/80 dark:bg-primary-500/[0.08]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-surface-100/80 dark:hover:bg-dark-50/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute left-0 w-[3px] h-5 rounded-r-full bg-primary-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon size={18} className={isActive ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="mt-4 pt-4 border-t border-surface-200/60 dark:border-white/[0.06] space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-surface-100/80 dark:hover:bg-dark-50/60 transition-all duration-200"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
