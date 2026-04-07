import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Copy, ExternalLink, Check, Shield, Key, QrCode, ChevronRight } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useWallet } from '../context/WalletContext';
import { useCopyToClipboard } from '../hooks/useUtils';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function WalletPage() {
  const { userWallets, assets, balanceVisible, activeWallet, setActiveWallet } = useWallet();
  const { copied, copy } = useCopyToClipboard();
  const [showImport, setShowImport] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');

  const formatAddress = (addr) => `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 sm:space-y-5">
      {/* ===== WALLET SELECTOR ===== */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">My Wallets</h3>
          <Button variant="ghost" size="sm" icon={Plus} onClick={() => setShowImport(true)}>
            Add Wallet
          </Button>
        </div>

        <div className="space-y-3">
          {userWallets.map((wallet) => (
            <Card
              key={wallet.id}
              variant={wallet.id === activeWallet.id ? 'gradient' : 'solid'}
              padding="md"
              onClick={() => setActiveWallet(wallet)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    wallet.type === 'hardware'
                      ? 'bg-amber-100 dark:bg-amber-900/30'
                      : 'bg-primary-100 dark:bg-primary-900/30'
                  }`}>
                    {wallet.type === 'hardware' ? (
                      <Shield size={18} className="text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Key size={18} className="text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white truncate">{wallet.name}</p>
                    <p className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 font-mono truncate">
                      {formatAddress(wallet.address)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-[13px] sm:text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    {balanceVisible ? `$${wallet.balance.toLocaleString()}` : '••••'}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); copy(wallet.address); }}
                    className="p-1.5 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 text-gray-400 transition-colors"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {wallet.isDefault && (
                <div className="mt-2">
                  <span className="badge-info text-[10px]">Default</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </motion.div>

      {/* ===== ASSETS IN ACTIVE WALLET ===== */}
      <motion.div variants={item}>
        <Card variant="solid" padding="none">
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Assets in {activeWallet.name}
            </h3>
          </div>
          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3 sm:py-3.5">
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white dark:bg-dark-50 shadow-sm border border-surface-200/50 dark:border-white/5 flex-shrink-0 overflow-hidden"
                >
                  <img 
                    src={asset.icon} 
                    alt={asset.name} 
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain" 
                    onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white">{asset.name}</p>
                  <p className="text-xs text-gray-400">{asset.holdings} {asset.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white">
                    {balanceVisible ? `$${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••'}
                  </p>
                  <p className={`text-xs font-medium ${asset.change24h >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ===== QR / ADDRESS ===== */}
      <motion.div variants={item}>
        <Card variant="solid" padding="lg">
          <div className="flex items-center gap-3 mb-4">
            <QrCode size={18} className="text-primary-500" />
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Wallet Address</h3>
          </div>
          <div className="bg-surface-100 dark:bg-dark-50 rounded-xl p-4">
            <p className="text-[11px] sm:text-xs font-mono text-gray-600 dark:text-gray-400 break-all leading-relaxed">
              {activeWallet.address}
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
            <Button variant="secondary" size="sm" icon={Copy} fullWidth onClick={() => copy(activeWallet.address)}>
              {copied ? 'Copied!' : 'Copy Address'}
            </Button>
            <Button variant="secondary" size="sm" icon={ExternalLink} fullWidth>
              Share
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* ===== IMPORT WALLET MODAL ===== */}
      <Modal isOpen={showImport} onClose={() => setShowImport(false)} title="Import Wallet">
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your 12 or 24 word seed phrase to import an existing wallet.
          </p>
          <textarea
            value={seedPhrase}
            onChange={(e) => setSeedPhrase(e.target.value)}
            placeholder="Enter seed phrase separated by spaces..."
            className="w-full px-4 py-3.5 bg-surface-100 dark:bg-dark-50 border border-surface-300/50 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all resize-none h-32 text-sm font-mono"
          />
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-500/20 rounded-xl p-3">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
              ⚠️ Never share your seed phrase with anyone. CryptoVault will never ask for it outside this import flow.
            </p>
          </div>
          <Button fullWidth icon={Plus}>
            Import Wallet
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
}
