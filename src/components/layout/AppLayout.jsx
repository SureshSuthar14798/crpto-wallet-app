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
    <div className="flex min-h-screen min-h-[100dvh] bg-surface-50 dark:bg-dark-300 overflow-x-hidden">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen min-h-[100dvh] w-full overflow-x-hidden">
        <Navbar />
        <main className="flex-1 pb-24 lg:pb-6 px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <BottomTabBar />
    </div>
  );
}
