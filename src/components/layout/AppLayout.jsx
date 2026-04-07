import { useState, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomTabBar from './BottomTabBar';

// Loading fallback for lazy pages
function PageLoader() {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-[3px] border-surface-200 dark:border-white/5 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );
}

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-surface-50 dark:bg-dark-300 overflow-hidden text-gray-900 dark:text-gray-100 font-sans">
      {/* Sidebar with mobile support */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 pb-24 lg:pb-12 max-w-7xl mx-auto w-full">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <BottomTabBar />
    </div>
  );
}
