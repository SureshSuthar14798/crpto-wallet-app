import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, QrCode, AlertCircle, ChevronDown, Fuel, Check } from 'lucide-react';
import QRCode from 'react-qr-code';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Tabs from '../components/common/Tabs';
import Modal from '../components/common/Modal';
import { useWallet } from '../context/WalletContext';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function SendReceive() {
  const { assets, activeWallet } = useWallet();
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
    { id: 'send', label: 'Send' },
    { id: 'receive', label: 'Receive' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 sm:space-y-5">
      {/* Tab Switcher */}
      <motion.div variants={item}>
        <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      </motion.div>

      {tab === 'send' ? (
        /* ===== SEND ===== */
        <>
          {/* Asset selector */}
          <motion.div variants={item}>
            <Card variant="solid" padding="lg">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Asset</label>
              <button
                onClick={() => setShowAssetPicker(true)}
                className="w-full flex items-center gap-3 mt-2 p-3 rounded-xl bg-surface-100 dark:bg-dark-50 hover:bg-surface-200 dark:hover:bg-dark-100 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-dark-50 shadow-sm border border-surface-200/50 dark:border-white/5 flex-shrink-0 overflow-hidden"
                >
                  <img 
                    src={selectedAsset.icon} 
                    alt={selectedAsset.name} 
                    className="w-6 h-6 object-contain" 
                    onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedAsset.name}</p>
                  <p className="text-xs text-gray-400">Balance: {selectedAsset.holdings} {selectedAsset.symbol}</p>
                </div>
                <ChevronDown size={18} className="text-gray-400" />
              </button>
            </Card>
          </motion.div>

          {/* Address */}
          <motion.div variants={item}>
            <Card variant="solid" padding="lg">
              <Input
                label="Recipient Address"
                placeholder="0x... or ENS name"
                icon={QrCode}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Card>
          </motion.div>

          {/* Amount */}
          <motion.div variants={item}>
            <Card variant="solid" padding="lg">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Amount</label>
              <div className="mt-2 relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-2xl sm:text-3xl font-bold bg-transparent text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none"
                />
                <p className="text-sm text-gray-400 mt-1">
                  ≈ ${amount ? (parseFloat(amount) * selectedAsset.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'} USD
                </p>
              </div>
              <button
                onClick={() => setAmount(String(selectedAsset.holdings))}
                className="mt-3 text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
              >
                MAX
              </button>
            </Card>
          </motion.div>

          {/* Gas Fee */}
          <motion.div variants={item}>
            <Card variant="flat" padding="md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Fuel size={14} />
                  <span>Estimated Gas Fee</span>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {gasFee} {selectedAsset.symbol} (${gasFeeUsd})
                </span>
              </div>
            </Card>
          </motion.div>

          {/* Send button */}
          <motion.div variants={item}>
            <Button
              fullWidth
              size="lg"
              icon={ArrowUp}
              onClick={handleSend}
              disabled={!amount || !address}
            >
              Review Transaction
            </Button>
          </motion.div>
        </>
      ) : (
        /* ===== RECEIVE ===== */
        <>
          <motion.div variants={item}>
            <Card variant="solid" padding="xl" className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-5">
                Scan QR code to send crypto to this wallet
              </p>
              <div className="inline-flex p-3 sm:p-4 bg-white rounded-2xl shadow-soft mb-4 sm:mb-5">
                <QRCode
                  value={activeWallet.address}
                  size={150}
                  bgColor="#ffffff"
                  fgColor="#1f2937"
                  level="M"
                />
              </div>
              <div className="bg-surface-100 dark:bg-dark-50 rounded-xl p-3 mb-4">
                <p className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
                  {activeWallet.address}
                </p>
              </div>
              <Button variant="secondary" fullWidth>
                Copy Address
              </Button>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-500/20">
              <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Only send compatible tokens to this address. Sending unsupported tokens may result in permanent loss.
              </p>
            </div>
          </motion.div>
        </>
      )}

      {/* ===== ASSET PICKER MODAL ===== */}
      <Modal isOpen={showAssetPicker} onClose={() => setShowAssetPicker(false)} title="Select Asset">
        <div className="space-y-1">
          {assets.map((asset) => (
            <button
              key={asset.id}
              onClick={() => { setSelectedAsset(asset); setShowAssetPicker(false); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-100 dark:hover:bg-dark-50 transition-colors"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-dark-50 shadow-sm border border-surface-200/50 dark:border-white/5 flex-shrink-0 overflow-hidden"
              >
                <img 
                  src={asset.icon} 
                  alt={asset.name} 
                  className="w-5 h-5 object-contain" 
                  onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{asset.name}</p>
                <p className="text-xs text-gray-400">{asset.holdings} {asset.symbol}</p>
              </div>
              {selectedAsset.id === asset.id && (
                <Check size={18} className="text-primary-500" />
              )}
            </button>
          ))}
        </div>
      </Modal>

      {/* ===== CONFIRMATION MODAL ===== */}
      <Modal isOpen={showConfirm} onClose={() => !sending && setShowConfirm(false)} title="Confirm Transaction">
        {sent ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-6"
          >
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transaction Sent!</h3>
            <p className="text-sm text-gray-500 mt-1">Your transaction is being processed</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Asset</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedAsset.name}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-surface-200/50 dark:border-white/[0.04]">
                <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {amount} {selectedAsset.symbol}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t border-surface-200/50 dark:border-white/[0.04]">
                <span className="text-sm text-gray-500 dark:text-gray-400">To</span>
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                  {address.slice(0, 10)}...{address.slice(-6)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t border-surface-200/50 dark:border-white/[0.04]">
                <span className="text-sm text-gray-500 dark:text-gray-400">Network Fee</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">${gasFeeUsd}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-surface-200/50 dark:border-white/[0.04]">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  ${(parseFloat(amount || 0) * selectedAsset.price + parseFloat(gasFeeUsd)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <Button fullWidth loading={sending} onClick={confirmSend}>
              Confirm & Send
            </Button>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
