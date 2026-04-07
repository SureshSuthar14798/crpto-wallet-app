import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import { ToastProvider } from './components/common/Toast';
import AppLayout from './components/layout/AppLayout';
import MainLoader from './components/common/MainLoader';

// Lazy load pages for smaller chunks
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WalletPage = lazy(() => import('./pages/WalletPage'));
const SendReceive = lazy(() => import('./pages/SendReceive'));
const SwapPage = lazy(() => import('./pages/SwapPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const MarketPage = lazy(() => import('./pages/MarketPage'));
const SecurityPage = lazy(() => import('./pages/SecurityPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const StakingPage = lazy(() => import('./pages/StakingPage'));
const NFTPage = lazy(() => import('./pages/NFTPage'));

// Simple loading fallback
function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-dark-300 z-[9999]">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AuthRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />

        {/* Protected app */}
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="send" element={<SendReceive />} />
          <Route path="receive" element={<SendReceive />} />
          <Route path="swap" element={<SwapPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="market" element={<MarketPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="staking" element={<StakingPage />} />
          <Route path="nft" element={<NFTPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <WalletProvider>
            <ToastProvider>
              <AnimatePresence mode="wait">
                {loading ? (
                  <MainLoader key="loader" />
                ) : (
                  <AppRoutes key="app" />
                )}
              </AnimatePresence>
            </ToastProvider>
          </WalletProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
