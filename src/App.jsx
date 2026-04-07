import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import { ToastProvider } from './components/common/Toast';
import AppLayout from './components/layout/AppLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WalletPage from './pages/WalletPage';
import SendReceive from './pages/SendReceive';
import SwapPage from './pages/SwapPage';
import HistoryPage from './pages/HistoryPage';
import MarketPage from './pages/MarketPage';
import SecurityPage from './pages/SecurityPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import StakingPage from './pages/StakingPage';
import NFTPage from './pages/NFTPage';

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
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <WalletProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </WalletProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
