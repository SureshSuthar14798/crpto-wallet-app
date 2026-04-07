import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Copy, ExternalLink, Check, Shield, Key, QrCode, 
  ChevronRight, MoreVertical, CreditCard, ArrowUpRight, 
  ArrowDownLeft, History, Settings, Zap, Info, ShieldCheck
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useWallet } from '../context/WalletContext';
import { useCopyToClipboard } from '../hooks/useUtils';
import SparkLine from '../components/charts/SparkLine';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
};

export default function WalletPage() {
  const { userWallets, assets, balanceVisible, activeWallet, setActiveWallet } = useWallet();
  const { copied, copy } = useCopyToClipboard();
  const [showImport, setShowImport] = useState(false);
  const [importType, setImportType] = useState('hot'); // 'hot' or 'hardware'
  const [seedPhrase, setSeedPhrase] = useState('');

  const formatAddress = (addr) => `${addr.slice(0, 10)}...${addr.slice(-8)}`;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-12">
      
      {/* ===== HORIZONTAL WALLET CARD SLIDER ===== */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">My Wallets</h3>
          <button 
            onClick={() => { setImportType('hot'); setShowImport(true); }}
            className="text-[11px] font-bold text-primary-500 hover:text-primary-600 transition-colors uppercase tracking-wider flex items-center gap-1"
          >
            <Plus size={14} /> Add New
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pt-6 pb-6 -mx-1 px-1 -mt-4">
          {userWallets.map((wallet) => (
            <motion.div
              key={wallet.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="min-w-[280px] sm:min-w-[320px] shrink-0"
              onClick={() => setActiveWallet(wallet)}
            >
              <div 
                className={`relative h-44 rounded-[32px] p-6 overflow-hidden cursor-pointer transition-all duration-500 ${
                  wallet.id === activeWallet.id 
                    ? 'ring-2 ring-primary-500/50 shadow-2xl shadow-primary-500/20' 
                    : 'opacity-70 grayscale-[0.3] hover:grayscale-0 hover:opacity-100 shadow-lg'
                }`}
                style={{
                  background: wallet.id === activeWallet.id 
                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)' 
                    : 'var(--card-bg-solid)'
                }}
              >
                {/* Decoration orbs for active card */}
                {wallet.id === activeWallet.id && (
                  <>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                  </>
                )}

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        wallet.id === activeWallet.id ? 'bg-white/20 backdrop-blur-md' : 'bg-surface-100 dark:bg-dark-100'
                      }`}>
                        {wallet.type === 'hardware' ? (
                          <Shield size={20} className={wallet.id === activeWallet.id ? 'text-white' : 'text-amber-500'} />
                        ) : (
                          <Zap size={20} className={wallet.id === activeWallet.id ? 'text-white' : 'text-primary-500'} />
                        )}
                      </div>
                      <span className={`text-sm font-bold tracking-tight ${wallet.id === activeWallet.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        {wallet.name}
                      </span>
                    </div>
                    {wallet.isDefault && (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        wallet.id === activeWallet.id ? 'bg-white/20 text-white' : 'bg-primary-500/10 text-primary-500'
                      }`}>
                        Primary
                      </span>
                    )}
                  </div>

                  <div>
                    <p className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${wallet.id === activeWallet.id ? 'text-white/60' : 'text-gray-400'}`}>Total Balance</p>
                    <h4 className={`text-2xl font-black ${wallet.id === activeWallet.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {balanceVisible ? `$${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••'}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between">
                    <code className={`text-xs font-mono font-medium ${wallet.id === activeWallet.id ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                      {formatAddress(wallet.address)}
                    </code>
                    <button 
                      onClick={(e) => { e.stopPropagation(); copy(wallet.address); }}
                      className={`p-2 rounded-xl transition-colors ${
                        wallet.id === activeWallet.id ? 'hover:bg-white/10 text-white/80' : 'hover:bg-surface-100 dark:hover:bg-dark-100 text-gray-400'
                      }`}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===== ACTIVE WALLET DETAILS & ACTIONS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Assets List (2/3 width) */}
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Holdings</h3>
            <span className="text-[11px] font-bold text-gray-500">{assets.length} Assets</span>
          </div>
          <Card variant="solid" padding="none">
            <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
              {assets.map((asset, idx) => (
                <div key={asset.id} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-50 dark:hover:bg-dark-50/40 transition-colors group">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white dark:bg-dark-50 shadow-sm border border-surface-200/50 dark:border-white/5 transition-transform group-hover:scale-105 overflow-hidden">
                      <img 
                        src={asset.icon} 
                        alt={asset.name} 
                        className="w-7 h-7 object-contain" 
                        onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{asset.name}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-gray-400 uppercase leading-none">{asset.symbol}</span>
                      <span className="h-0.5 w-0.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                      <span className="text-[11px] font-semibold text-gray-500">{asset.holdings} {asset.symbol}</span>
                    </div>
                  </div>

                  <div className="hidden xs:block px-4">
                    <SparkLine 
                      data={asset.sparkline || [10, 20, 15, 25, 20]} 
                      color={asset.change24h >= 0 ? '#22c55e' : '#ef4444'} 
                      width={60} 
                      height={24} 
                    />
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {balanceVisible ? `$${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••'}
                    </p>
                    <p className={`text-[11px] font-bold ${asset.change24h >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Security & Tools (1/3 width) */}
        <motion.div variants={item} className="space-y-6">
          {/* Security Stats */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Security Score</h3>
            <Card variant="solid" padding="lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full border-4 border-primary-500 flex items-center justify-center relative">
                  <span className="text-lg font-black text-gray-900 dark:text-white">92</span>
                  <div className="absolute inset-0 border-4 border-surface-100 dark:border-white/5 rounded-full" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Excellent Security</h4>
                  <p className="text-xs text-gray-500">Biometrics & 2FA enabled</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-500" /> Key Encrypted</span>
                  <span className="text-green-500 font-bold">Safe</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-500" /> Whitelist On</span>
                  <span className="text-green-500 font-bold">Enabled</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Share / Recieve Area */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Receive Settings</h3>
            <Card variant="solid" padding="lg">
               <div className="bg-surface-50 dark:bg-dark-50/50 rounded-2xl p-5 flex flex-col items-center">
                  <div className="p-3 bg-white rounded-2xl shadow-soft mb-4">
                    <QrCode size={140} className="text-gray-900" />
                  </div>
                  <p className="text-[11px] font-mono font-medium text-gray-500 break-all text-center max-w-[200px]">
                    {activeWallet.address}
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-3 mt-4">
                 <Button variant="secondary" size="md" icon={Copy} fullWidth onClick={() => copy(activeWallet.address)}>
                   {copied ? 'Copied' : 'Address'}
                 </Button>
                 <Button variant="secondary" size="md" icon={ExternalLink} fullWidth>
                   Share
                 </Button>
               </div>
            </Card>
          </div>
        </motion.div>

      </div>

      {/* ===== IMPORT WALLET MODAL ===== */}
      <Modal isOpen={showImport} onClose={() => setShowImport(false)} title="Add New Wallet">
        <div className="space-y-5">
           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setImportType('hot')}
                className={`flex flex-col items-center gap-3 p-5 rounded-[24px] border-2 transition-all duration-300 ${
                  importType === 'hot' 
                    ? 'border-primary-500/50 bg-primary-500/5' 
                    : 'border-transparent bg-surface-100 dark:bg-dark-100/50 hover:bg-surface-200 dark:hover:bg-dark-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${importType === 'hot' ? 'bg-primary-500' : 'bg-gray-400'}`}>
                   <Key size={20} />
                </div>
                <span className={`text-xs font-bold ${importType === 'hot' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>New Hot Wallet</span>
              </button>
              <button 
                onClick={() => setImportType('hardware')}
                className={`flex flex-col items-center gap-3 p-5 rounded-[24px] border-2 transition-all duration-300 ${
                  importType === 'hardware' 
                    ? 'border-amber-500/50 bg-amber-500/5' 
                    : 'border-transparent bg-surface-100 dark:bg-dark-100/50 hover:bg-surface-200 dark:hover:bg-dark-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${importType === 'hardware' ? 'bg-amber-500' : 'bg-gray-400'}`}>
                   <Shield size={20} />
                </div>
                <span className={`text-xs font-bold ${importType === 'hardware' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Hardware Device</span>
              </button>
           </div>
           
           {importType === 'hot' ? (
             <>
               <div className="relative py-2 text-center">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-surface-200 dark:bg-white/5" />
                  <span className="relative z-10 px-4 bg-white dark:bg-dark-200 text-[10px] font-bold text-gray-400 uppercase tracking-widest">or import seed</span>
               </div>
    
              <textarea
                value={seedPhrase}
                onChange={(e) => setSeedPhrase(e.target.value)}
                placeholder="Enter 12 or 24 word mnemonic phrase..."
                className="w-full px-4 py-4 bg-surface-50 dark:bg-dark-50/50 border border-surface-200 dark:border-white/10 rounded-[20px] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all resize-none h-32 text-sm font-mono"
              />
              <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                  Importing a phrase gives full control over your funds. Be absolutely sure you are in a private environment.
                </p>
              </div>
              <Button fullWidth size="lg">
                Restore Wallet
              </Button>
             </>
           ) : (
             <div className="py-6 text-center space-y-4">
                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                   <Shield size={40} className="text-amber-500" />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-gray-900 dark:text-white">Connect Hardware Wallet</h4>
                   <p className="text-xs text-gray-500 mt-1 px-4">Insert your Ledger or Trezor device via USB or connect via Bluetooth to continue.</p>
                </div>
                <Button fullWidth variant="secondary" size="lg">
                   Scan for Devices
                </Button>
             </div>
           )}
        </div>
      </Modal>
    </motion.div>
  );
}
