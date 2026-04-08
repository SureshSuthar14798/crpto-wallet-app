import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp, QrCode, AlertCircle, ChevronDown, Fuel, Check,
  Copy, ExternalLink, User, Contact, ShieldCheck, Zap,
  ArrowRight, Search, Wallet
} from 'lucide-react';
import QRCode from 'react-qr-code';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Tabs from '../components/common/Tabs';
import Modal from '../components/common/Modal';
import { useWallet } from '../context/WalletContext';
import { useCopyToClipboard } from '../hooks/useUtils';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
};

export default function SendReceive() {
  const { assets, activeWallet } = useWallet();
  const { copied, copy } = useCopyToClipboard();
  const [tab, setTab] = useState('send');
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const gasFee = selectedAsset.symbol === 'ETH' ? 0.0021 : selectedAsset.symbol === 'BTC' ? 0.00012 : 0.001;
  const gasFeeUsd = (gasFee * selectedAsset.price).toFixed(2);

  const handleSend = () => {
    if (!amount || !address) return;
    setShowConfirm(true);
  };

  const confirmSend = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 2000));
    setSending(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setShowConfirm(false);
      setAmount('');
      setAddress('');
    }, 2000);
  };

  const tabs = [
    { id: 'send', label: 'Send Crypto' },
    { id: 'receive', label: 'Receive Assets' },
  ];

  const recentContacts = [
    { name: 'Minjun (Me)', address: '0x8a2f...3d4e' },
    { name: 'Exchange', address: '0x3b7c...9f2a' },
    { name: 'Hardware', address: '0x9c4d...2e5f' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-2xl mx-auto pb-10">

      {/* ===== PREMIUM SLIDING TABS ===== */}
      <motion.div variants={item}>
        <div className="bg-surface-100/80 dark:bg-dark-100/50 p-1.5 rounded-2xl flex relative overflow-hidden backdrop-blur-md border border-surface-200/50 dark:border-white/5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-all duration-300 ${tab === t.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
                }`}
            >
              {tab === t.id && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-white dark:bg-dark-50 rounded-xl shadow-sm border border-surface-200/50 dark:border-white/5"
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {tab === 'send' ? (
        /* ===== SEND FLOW ===== */
        <>
          {/* Asset Selection Card */}
          <motion.div variants={item}>
            <Card variant="solid" padding="none">
              <button
                onClick={() => setShowAssetPicker(true)}
                className="w-full h-24 sm:h-28 flex items-center gap-4 px-6 sm:px-8 group text-left transition-all"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-surface-100 dark:bg-dark-100 flex items-center justify-center p-3 relative group-hover:scale-105 transition-transform overflow-hidden shadow-sm">
                  <img
                    src={selectedAsset.icon}
                    alt={selectedAsset.name}
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-primary-500 uppercase tracking-widest mb-1.5">Asset to Send</p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">{selectedAsset.name}</h3>
                    <ChevronDown size={18} className="text-gray-400 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Available: {selectedAsset.holdings} {selectedAsset.symbol}</p>
                </div>
              </button>
            </Card>
          </motion.div>

          {/* Recipient & Amount Combined View */}
          <motion.div variants={item} className="space-y-4">
            <Card variant="solid" padding="none">
              <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
                {/* Address Input Area */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Recipient</label>
                    <button className="text-[10px] font-bold text-primary-500 hover:text-primary-600 transition-colors uppercase flex items-center gap-1">
                      <Contact size={12} /> Address Book
                    </button>
                  </div>
                  <div className="relative group">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="0x... or ENS name"
                      className="w-full bg-surface-50 dark:bg-dark-50 border-2 border-transparent focus:border-primary-500/30 dark:focus:border-primary-500/10 rounded-2xl px-5 py-4 text-sm sm:text-base font-medium text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 transition-all focus:ring-4 focus:ring-primary-500/[0.03]"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <QrCode size={20} className="text-gray-400 cursor-pointer hover:text-primary-500 transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Amount Input Area */}
                <div className="p-6 sm:p-8 bg-surface-50/50 dark:bg-dark-50/20">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Amount</label>
                    <div className="flex gap-2">
                      {['25%', '50%', 'MAX'].map((btn) => (
                        <button
                          key={btn}
                          onClick={() => btn === 'MAX' ? setAmount(String(selectedAsset.holdings)) : setAmount(String(selectedAsset.holdings * (parseInt(btn) / 100 || 0)))}
                          className="px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-dark-100 text-[10px] font-bold text-gray-500 hover:text-primary-500 hover:bg-primary-500/10 transition-all uppercase"
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative w-full text-center">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full text-4xl sm:text-5xl font-black bg-transparent text-gray-900 dark:text-white placeholder-gray-200 dark:placeholder-gray-700 focus:outline-none text-center"
                      />
                      <div className="mt-2 flex items-center justify-center gap-1.5">
                        <p className="text-sm font-bold text-gray-400">≈ ${amount ? (parseFloat(amount) * selectedAsset.price).toLocaleString() : '0.00'}</p>
                        <span className="text-xs font-black text-primary-500 uppercase bg-primary-500/10 px-1.5 py-0.5 rounded-md self-center">{selectedAsset.symbol}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Estimated Stats */}
          <motion.div variants={item} className="grid grid-cols-2 gap-4 px-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Fuel size={12} className="text-amber-500" /> Network Fee</span>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">${gasFeeUsd} <span className="text-[11px] text-gray-400 ml-1">({gasFee} {selectedAsset.symbol})</span></p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Zap size={12} className="text-primary-500" /> Speed</span>
              <p className="text-sm font-bold text-primary-500">Fast <span className="text-[11px] text-gray-400 ml-1 tracking-normal font-medium">(~30s)</span></p>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div variants={item} className="pt-2">
            <Button
              fullWidth
              size="lg"
              icon={ArrowUp}
              onClick={handleSend}
              disabled={!amount || !address}
              className="h-16 rounded-[24px] shadow-xl shadow-primary-500/20"
            >
              Review and Send Asset
            </Button>
          </motion.div>
        </>
      ) : (
        /* ===== RECEIVE FLOW ===== */
        <>
          <motion.div variants={item}>
            <Card variant="solid" padding="xl" className="text-center overflow-hidden">
              {/* Background Flare */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-primary-500/10 blur-[40px] rounded-full" />

              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Personal Receiving Address</p>

              <div className="relative inline-flex p-5 bg-white rounded-[32px] shadow-2xl mb-8 group overflow-hidden">
                <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <QRCode
                  value={activeWallet.address}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q"
                />
                {/* Small logo overlay in center of QR */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl shadow-lg border border-surface-100 flex items-center justify-center">
                  <Wallet size={20} className="text-primary-500" />
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-violet-500 rounded-2xl blur opacity-0 group-hover:opacity-15 transition-opacity duration-500" />
                  <div className="relative bg-surface-100 dark:bg-dark-50 rounded-2xl p-4 border border-surface-200/50 dark:border-white/5 transition-colors group-hover:border-primary-500/30">
                    <p className="text-[11px] sm:text-xs font-mono font-black text-gray-700 dark:text-gray-300 break-all tracking-wider leading-relaxed">
                      {activeWallet.address}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Button variant="secondary" size="lg" icon={Copy} fullWidth onClick={() => copy(activeWallet.address)}>
                    {copied ? 'Copied' : 'Copy Address'}
                  </Button>
                  <Button variant="secondary" size="lg" icon={ExternalLink} fullWidth>
                    Get Payment Link
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <div className="flex items-start gap-4 p-5 rounded-[24px] bg-sky-50 dark:bg-sky-500/5 border border-sky-200/40 dark:border-sky-500/20">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={20} className="text-sky-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-sky-900 dark:text-sky-400">Security Guard Active</h4>
                <p className="text-xs text-sky-700 dark:text-sky-400/70 mt-1">
                  Transactions are monitored for potential risks. Only share this address with trusted entities or verifiable decentralized exchanges.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* ===== ASSET PICKER MODAL ===== */}
      <Modal isOpen={showAssetPicker} onClose={() => setShowAssetPicker(false)} title="Select Asset">
        <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar pt-2">
          {assets.map((asset) => (
            <button
              key={asset.id}
              onClick={() => { setSelectedAsset(asset); setShowAssetPicker(false); }}
              className={`w-full flex items-center gap-4 p-4 rounded-[20px] transition-all group border-2 ${selectedAsset.id === asset.id
                  ? 'bg-primary-50/50 dark:bg-primary-500/10 border-primary-500/20 shadow-sm'
                  : 'bg-transparent border-transparent hover:bg-surface-100 dark:hover:bg-white/[0.03]'
                }`}
            >
              {selectedAsset.id === asset.id && <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white dark:bg-dark-50 shadow-sm border border-surface-200/50 dark:border-white/5 overflow-hidden transition-transform group-hover:scale-105">
                <img
                  src={asset.icon}
                  alt={asset.name}
                  className="w-7 h-7 object-contain"
                  onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1.5">{asset.name}</p>
                <p className="text-xs text-gray-400 font-medium">{asset.holdings} {asset.symbol}</p>
              </div>
              <div className="text-right flex items-center gap-4">
                <div className="hidden xs:block">
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1">${(asset.value).toLocaleString()}</p>
                  <p className={`text-[10px] font-bold ${asset.change24h >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{asset.change24h}%</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      {/* ===== CONFIRMATION MODAL ===== */}
      <Modal isOpen={showConfirm} onClose={() => !sending && setShowConfirm(false)} title="Security Check">
        {sent ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-10"
          >
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
              <Check size={48} className="text-emerald-500 relative z-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Success!</h3>
            <p className="text-sm text-gray-500 mt-2">Assets are being transferred safely.</p>
            <Button className="mt-8 px-10" onClick={() => setShowConfirm(false)}>Done</Button>
          </motion.div>
        ) : (
          <div className="space-y-6 pt-2">
            <Card variant="outline" padding="lg" className="bg-surface-50 dark:bg-dark-50/20 border-surface-200 dark:border-white/5">
              <div className="flex flex-col items-center py-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Total Amount to Send</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-dark-50 shadow-sm flex items-center justify-center overflow-hidden">
                    <img src={selectedAsset.icon} className="w-6 h-6 object-contain" />
                  </div>
                  <h4 className="text-3xl font-black text-gray-900 dark:text-white">{amount} {selectedAsset.symbol}</h4>
                </div>
                <p className="text-sm font-bold text-primary-500 mt-2">≈ ${(parseFloat(amount || 0) * selectedAsset.price).toLocaleString()} USD</p>
              </div>
            </Card>

            <div className="space-y-4 px-1">
              <div className="flex justify-between items-center group">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Network Speed</span>
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-primary-500" />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Fast (Instant)</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-surface-100 dark:border-white/5 pt-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recipient</span>
                <span className="text-xs font-mono font-bold text-gray-600 dark:text-gray-400">
                  {address.slice(0, 10)}...{address.slice(-8)}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-surface-100 dark:border-white/5 pt-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estimated Fee</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">${gasFeeUsd}</span>
              </div>
            </div>

            <div className="bg-amber-500/10 p-4 rounded-2xl flex gap-3 border border-amber-500/15">
              <AlertCircle size={18} className="text-amber-500 shrink-0" />
              <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 leading-normal">Please verify the recipient address again. Transactions cannot be reversed once confirmed on the blockchain.</p>
            </div>

            <Button fullWidth size="lg" loading={sending} onClick={confirmSend} className="h-14">
              Confirm Broadcast
            </Button>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
