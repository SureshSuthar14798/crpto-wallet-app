import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownUp, ChevronDown, Zap, Percent, CreditCard, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { swapTokens } from '../data/mockData';

/* ─── Token Selector Pill ─── */
function TokenPill({ token, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-full bg-surface-100 dark:bg-dark-100 hover:bg-surface-200/80 dark:hover:bg-dark-50 border border-surface-200/60 dark:border-white/[0.06] pl-1.5 pr-3 py-1.5 transition-all active:scale-[0.96] flex-shrink-0"
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center bg-white dark:bg-dark-50 shadow-sm border border-surface-200/50 dark:border-white/5 flex-shrink-0 overflow-hidden"
      >
        <img 
          src={token.icon} 
          alt={token.symbol} 
          className="w-4 h-4 object-contain" 
          onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
        />
      </div>
      <span className="text-sm font-bold text-gray-900 dark:text-white">{token.symbol}</span>
      <ChevronDown size={13} className="text-gray-400 -ml-0.5" />
    </button>
  );
}

export default function SwapPage() {
  const [tab, setTab] = useState('swap');
  const [fromToken, setFromToken] = useState(swapTokens[1]);
  const [toToken, setToToken] = useState(swapTokens[2]);
  const [fromAmount, setFromAmount] = useState('');
  const [showTokenPicker, setShowTokenPicker] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [buyCrypto, setBuyCrypto] = useState(swapTokens[0]);
  const [slippage, setSlippage] = useState('0.5');

  const toAmount = fromAmount
    ? ((parseFloat(fromAmount) * fromToken.price) / toToken.price).toFixed(
        toToken.symbol === 'BTC' ? 8 : toToken.symbol === 'ETH' ? 6 : 2
      )
    : '';

  const fromUsd = fromAmount
    ? (parseFloat(fromAmount) * fromToken.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';
  const toUsd = toAmount
    ? (parseFloat(toAmount) * toToken.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

  const swapTokensHandler = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount('');
  };

  const selectToken = (token) => {
    if (showTokenPicker === 'from') {
      if (token.symbol === toToken.symbol) setToToken(fromToken);
      setFromToken(token);
    } else {
      if (token.symbol === fromToken.symbol) setFromToken(toToken);
      setToToken(token);
    }
    setShowTokenPicker(null);
  };

  const rateStr = `1 ${fromToken.symbol} = ${(fromToken.price / toToken.price).toFixed(toToken.symbol === 'BTC' ? 8 : 4)} ${toToken.symbol}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-lg mx-auto space-y-4"
    >
      {/* ═══════ TAB SWITCHER ═══════ */}
      <div className="flex bg-surface-100 dark:bg-dark-50/80 rounded-2xl p-1">
        {[
          { id: 'swap', label: 'Swap', icon: ArrowDownUp },
          { id: 'buy', label: 'Buy Crypto', icon: CreditCard },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`relative flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${
              tab === id
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
            }`}
          >
            {tab === id && (
              <motion.div
                layoutId="swapTab"
                className="absolute inset-0 bg-white dark:bg-dark-100 rounded-xl shadow-soft"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <Icon size={15} strokeWidth={2.2} />
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* ═══════ SWAP TAB ═══════ */}
      {tab === 'swap' && (
        <motion.div
          key="swap-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* ── Combined swap card ── */}
          <div className="bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl border border-surface-200/50 dark:border-white/[0.05] rounded-3xl p-2.5 sm:p-3 shadow-glass">

            {/* FROM box */}
            <div className="bg-white dark:bg-dark-50 border border-surface-200/40 dark:border-white/[0.04] rounded-2xl p-4 focus-within:border-primary-400/30 focus-within:ring-2 focus-within:ring-primary-500/10 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">You pay</span>
                <button
                  onClick={() => setFromAmount(String(fromToken.balance))}
                  className="text-xs text-gray-400 hover:text-primary-500 transition-colors"
                >
                  Balance: <span className="font-semibold">{fromToken.balance}</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <TokenPill token={fromToken} onClick={() => setShowTokenPicker('from')} />
                <input
                  type="number"
                  inputMode="decimal"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 text-right text-2xl font-bold bg-transparent text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none min-w-0 tabular-nums"
                />
              </div>
              <p className="text-xs text-gray-400 text-right mt-1.5 tabular-nums">≈ ${fromUsd}</p>
            </div>

            {/* SWAP BUTTON */}
            <div className="flex justify-center -my-[15px] relative z-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.85, rotate: 180 }}
                onClick={swapTokensHandler}
                className="w-10 h-10 bg-primary-500 hover:bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/25 transition-colors ring-[3px] ring-white dark:ring-dark-300"
              >
                <ArrowDownUp size={16} strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* TO box */}
            <div className="bg-surface-50/60 dark:bg-dark-100/60 border border-surface-200/40 dark:border-white/[0.04] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">You receive</span>
                <span className="text-xs text-gray-400">Balance: <span className="font-semibold">{toToken.balance}</span></span>
              </div>
              <div className="flex items-center gap-3">
                <TokenPill token={toToken} onClick={() => setShowTokenPicker('to')} />
                <div className="flex-1 text-right text-2xl font-bold text-gray-900 dark:text-white truncate tabular-nums min-w-0">
                  {toAmount || <span className="text-gray-300 dark:text-gray-600">0.00</span>}
                </div>
              </div>
              <p className="text-xs text-gray-400 text-right mt-1.5 tabular-nums">≈ ${toUsd}</p>
            </div>
          </div>

          {/* ── Rate row (collapsible) ── */}
          <div className="rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between px-4 py-3 bg-surface-50/80 dark:bg-dark-50/40 hover:bg-surface-100/80 dark:hover:bg-dark-50/60 border border-surface-200/30 dark:border-white/[0.03] rounded-2xl transition-all"
            >
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <RefreshCw size={13} className="text-primary-500" />
                <span className="font-medium tabular-nums">{rateStr}</span>
              </div>
              <motion.div animate={{ rotate: showDetails ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} className="text-gray-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 pb-1 space-y-1">
                    {[
                      { l: 'Price Impact', v: '<0.01%', c: 'text-emerald-500' },
                      { l: 'Swap Fee', v: '0.3%', i: Percent },
                      { l: 'Slippage Tolerance', v: `${slippage}%`, i: Zap },
                      { l: 'Min. Received', v: toAmount ? `${(parseFloat(toAmount) * (1 - parseFloat(slippage) / 100)).toFixed(4)} ${toToken.symbol}` : '—' },
                      { l: 'Network', v: 'Ethereum', i: Sparkles },
                    ].map(({ l, v, c, i: I }) => (
                      <div key={l} className="flex items-center justify-between px-4 py-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                          {I && <I size={12} />}
                          <span>{l}</span>
                        </div>
                        <span className={`text-xs font-semibold tabular-nums ${c || 'text-gray-600 dark:text-gray-300'}`}>{v}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 px-4 pt-1 pb-1">
                      <span className="text-xs text-gray-400">Slippage:</span>
                      {['0.1', '0.5', '1.0'].map(s => (
                        <button
                          key={s}
                          onClick={() => setSlippage(s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            slippage === s
                              ? 'bg-primary-500 text-white shadow-sm'
                              : 'bg-surface-100 dark:bg-dark-100 text-gray-500 dark:text-gray-400 hover:bg-surface-200'
                          }`}
                        >
                          {s}%
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Swap CTA ── */}
          <Button fullWidth size="lg" disabled={!fromAmount || parseFloat(fromAmount) <= 0}>
            {fromAmount ? (
              <span className="flex items-center gap-2">
                Swap {fromToken.symbol} → {toToken.symbol}
                <ArrowRight size={16} />
              </span>
            ) : (
              'Enter an amount'
            )}
          </Button>
        </motion.div>
      )}

      {/* ═══════ BUY TAB ═══════ */}
      {tab === 'buy' && (
        <motion.div
          key="buy-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* ── You Pay Card ── */}
          <div className="bg-white dark:bg-dark-50 border border-surface-200/50 dark:border-white/5 rounded-3xl p-5 shadow-glass">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">You pay</span>
            <div className="flex items-baseline gap-1.5 mt-3">
              <span className="text-3xl font-bold text-gray-300 dark:text-gray-600 select-none">$</span>
              <input
                type="number"
                inputMode="decimal"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 text-3xl font-bold bg-transparent text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none min-w-0 tabular-nums"
              />
            </div>
            <div className="flex gap-2 mt-4">
              {[50, 100, 250, 500, 1000].map(v => (
                <button
                  key={v}
                  onClick={() => setBuyAmount(String(v))}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    buyAmount === String(v)
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-surface-100 dark:bg-dark-100 text-gray-500 dark:text-gray-400 hover:bg-surface-200'
                  }`}
                >
                  ${v >= 1000 ? '1K' : v}
                </button>
              ))}
            </div>
          </div>

          {/* ── You Receive Card ── */}
          <div className="bg-white dark:bg-dark-50 border border-surface-200/50 dark:border-white/5 rounded-3xl p-5 shadow-glass">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">You receive</span>
            <button
              onClick={() => setShowTokenPicker('buy')}
              className="w-full flex items-center gap-3 mt-3 p-3 rounded-xl bg-surface-50 dark:bg-dark-100 hover:bg-surface-100 dark:hover:bg-dark-200/50 border border-surface-200/30 dark:border-white/[0.04] transition-all"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-dark-50 shadow-sm border border-surface-200/50 dark:border-white/5 flex-shrink-0 overflow-hidden"
              >
                <img 
                  src={buyCrypto.icon} 
                  alt={buyCrypto.name} 
                  className="w-6 h-6 object-contain" 
                  onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{buyCrypto.name}</p>
                <p className="text-xs text-gray-400">${buyCrypto.price.toLocaleString()}</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            <div className="flex items-baseline justify-end gap-1.5 mt-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                {buyAmount ? (parseFloat(buyAmount) / buyCrypto.price).toFixed(buyCrypto.symbol === 'BTC' ? 8 : 6) : '0.00'}
              </span>
              <span className="text-sm font-semibold text-gray-400">{buyCrypto.symbol}</span>
            </div>
          </div>

          {/* ── Fee breakdown ── */}
          <div className="bg-surface-50/60 dark:bg-dark-50/30 border border-surface-200/30 dark:border-white/[0.03] rounded-2xl px-4 py-3 space-y-1.5">
            {[
              { l: 'Price', v: `1 ${buyCrypto.symbol} = $${buyCrypto.price.toLocaleString()}` },
              { l: 'Processing Fee', v: '1.5%' },
              { l: 'Payment Method', v: 'Credit / Debit Card', i: CreditCard },
            ].map(({ l, v, i: I }) => (
              <div key={l} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  {I && <I size={12} />}
                  <span>{l}</span>
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 tabular-nums">{v}</span>
              </div>
            ))}
          </div>

          {/* ── Buy CTA ── */}
          <Button fullWidth size="lg" disabled={!buyAmount || parseFloat(buyAmount) <= 0}>
            {buyAmount ? (
              <span className="flex items-center gap-2">
                Buy {buyCrypto.symbol}
                <ArrowRight size={16} />
              </span>
            ) : (
              'Enter an amount'
            )}
          </Button>
        </motion.div>
      )}

      {/* ═══════ TOKEN PICKER MODAL ═══════ */}
      <Modal isOpen={!!showTokenPicker} onClose={() => setShowTokenPicker(null)} title="Select Token">
        <div className="space-y-1">
          {swapTokens.map((token) => {
            const isSelected =
              (showTokenPicker === 'from' && token.symbol === fromToken.symbol) ||
              (showTokenPicker === 'to' && token.symbol === toToken.symbol) ||
              (showTokenPicker === 'buy' && token.symbol === buyCrypto.symbol);
            return (
              <button
                key={token.symbol}
                onClick={() => {
                  if (showTokenPicker === 'buy') {
                    setBuyCrypto(token);
                    setShowTokenPicker(null);
                  } else {
                    selectToken(token);
                  }
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-primary-50 dark:bg-primary-500/10 border border-primary-200/50 dark:border-primary-500/20'
                    : 'hover:bg-surface-50 dark:hover:bg-dark-50/60 border border-transparent'
                }`}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-dark-50 shadow-sm border border-surface-200/50 dark:border-white/5 flex-shrink-0 overflow-hidden"
                >
                  <img 
                    src={token.icon} 
                    alt={token.name} 
                    className="w-5 h-5 object-contain" 
                    onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{token.name}</p>
                  <p className="text-xs text-gray-400">{token.symbol} · Bal: {token.balance}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">${token.price.toLocaleString()}</p>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Modal>
    </motion.div>
  );
}
