import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Wallet, ArrowLeftRight, History, BarChart3 } from 'lucide-react';

const tabs = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/wallet', icon: Wallet, label: 'Wallet' },
  { path: '/swap', icon: ArrowLeftRight, label: 'Swap' },
  { path: '/history', icon: History, label: 'History' },
  { path: '/market', icon: BarChart3, label: 'Market' },
];

export default function BottomTabBar() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-dark-200/90 backdrop-blur-2xl border-t border-surface-200/60 dark:border-white/[0.06]">
      <div className="flex items-center justify-around h-[60px]">
        {tabs.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-all duration-200 w-[56px] ${
                isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="bottomTab"
                    className="absolute -top-[1px] w-8 h-[3px] rounded-full bg-primary-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className={`text-[10px] leading-none font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      {/* Safe area spacer for notched phones */}
      <div className="h-[env(safe-area-inset-bottom,0px)] bg-white/90 dark:bg-dark-200/90" />
    </nav>
  );
}
