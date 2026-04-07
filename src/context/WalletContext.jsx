import { createContext, useContext, useState } from 'react';
import { cryptoAssets, wallets, transactions, notifications as notifData } from '../data/mockData';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [assets] = useState(cryptoAssets);
  const [userWallets] = useState(wallets);
  const [txHistory] = useState(transactions);
  const [activeWallet, setActiveWallet] = useState(wallets[0]);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [notifs, setNotifs] = useState(notifData);

  const totalBalance = assets.reduce((sum, a) => sum + a.value, 0);
  const totalChange = ((totalBalance - 60200) / 60200 * 100).toFixed(2);

  const markNotifRead = (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotifsRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <WalletContext.Provider value={{
      assets,
      userWallets,
      txHistory,
      activeWallet,
      setActiveWallet,
      balanceVisible,
      setBalanceVisible,
      totalBalance,
      totalChange,
      notifications: notifs,
      markNotifRead,
      markAllNotifsRead,
      unreadCount,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
};
