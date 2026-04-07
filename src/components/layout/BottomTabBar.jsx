import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Wallet, ArrowLeftRight, 
  History, BarChart3, PieChart 
} from 'lucide-react';

const tabs = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/wallet', icon: Wallet, label: 'Wallet' },
  { path: '/staking', icon: PieChart, label: 'Earn' },
  { path: '/market', icon: BarChart3, label: 'Market' },
  { path: '/history', icon: History, label: 'Activity' },
];

export default function BottomTabBar() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-[100]">
      {/* Floating Dock Container */}
      <div className="relative bg-white/70 dark:bg-dark-100/70 backdrop-blur-3xl border border-white/20 dark:border-white/5 rounded-[28px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)] px-3 py-2 flex items-center justify-between">
        
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <NavLink
              key={path}
              to={path}
              className="relative flex flex-col items-center justify-center py-2 px-1 transition-all duration-300 w-[64px]"
            >
              {/* Sliding Active Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="activeTabDockPill"
                  className="absolute inset-0 bg-primary-500/10 dark:bg-primary-500/20 rounded-[18px] border border-primary-500/10 dark:border-primary-500/5 shadow-inner"
                  transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-1.5 translate-y-0.5">
                 <motion.div
                   animate={isActive ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
                   transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                 >
                   <Icon 
                     size={20} 
                     className={`transition-colors duration-300 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`} 
                     strokeWidth={isActive ? 2.5 : 1.8} 
                   />
                 </motion.div>
                 
                 <span className={`text-[9.5px] font-black uppercase tracking-widest transition-all duration-300 ${
                   isActive ? 'text-primary-600 dark:text-primary-400 opacity-100 scale-100' : 'text-gray-400 dark:text-gray-500 opacity-70 scale-95'
                 }`}>
                   {label}
                 </span>
                 
                 {/* Tiny active dot */}
                 <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                      />
                    )}
                 </AnimatePresence>
              </div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
