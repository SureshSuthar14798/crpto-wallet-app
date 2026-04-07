import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomTabBar from './BottomTabBar';

/**
 * Main application layout
 * Desktop: Sidebar + Content
 * Mobile: Navbar + Content + Bottom Tab
 */
export default function AppLayout() {
  return (
    <div className="flex h-screen bg-surface-50 dark:bg-dark-300 overflow-hidden text-gray-900 dark:text-gray-100 font-sans">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 pb-24 lg:pb-12 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <BottomTabBar />
    </div>
  );
}
