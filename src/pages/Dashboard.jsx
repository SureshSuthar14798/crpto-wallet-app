import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Send, Download, CreditCard, ArrowLeftRight,
  TrendingUp, TrendingDown, ChevronRight, Sparkles, Clock,
  ArrowUpRight, ArrowDownLeft, Repeat, Wallet, Star, Flame, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import PortfolioChart from '../components/charts/PortfolioChart';
import SparkLine from '../components/charts/SparkLine';
import { useWallet } from '../context/WalletContext';
import { portfolioHistory, transactions, marketTrends } from '../data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

/* ─── tiny donut ─── */
function AllocationDonut({ assets, size = 120 }) {
  const total = assets.reduce((s, a) => s + a.value, 0);
  const r = (size - 12) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width={size} height={size} className="drop-shadow-lg">
      {assets.map((asset, i) => {
        const pct = asset.value / total;
        const dash = pct * circumference;
        const gap = circumference - dash;
        const seg = (
          <circle
            key={asset.id}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={asset.color}
            strokeWidth={10}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            className="transition-all duration-700"
            style={{ filter: `drop-shadow(0 0 4px ${asset.color}40)` }}
          />
        );
        offset += dash;
        return seg;
      })}
      {/* centre label */}
      <text x={cx} y={cy - 4} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="9" fontWeight="500">Assets</text>
      <text x={cx} y={cy + 10} textAnchor="middle" className="fill-gray-900 dark:fill-white" fontSize="14" fontWeight="700">{assets.length}</text>
    </svg>
  );
}

/* ─── greeting ─── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function Dashboard() {
  const { assets, totalBalance, totalChange, balanceVisible, setBalanceVisible, txHistory } = useWallet();
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState('1M');

  const greeting = useMemo(() => getGreeting(), []);
  const todayStr = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }), []);

  const quickActions = [
    { icon: Send, label: 'Send', gradient: 'from-blue-500 to-blue-600', glow: 'shadow-blue-500/25', path: '/send' },
    { icon: Download, label: 'Receive', gradient: 'from-emerald-500 to-emerald-600', glow: 'shadow-emerald-500/25', path: '/receive' },
    { icon: CreditCard, label: 'Buy', gradient: 'from-violet-500 to-violet-600', glow: 'shadow-violet-500/25', path: '/swap' },
    { icon: ArrowLeftRight, label: 'Swap', gradient: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/25', path: '/swap' },
  ];

  const periods = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

  const recentTx = useMemo(() => (txHistory || transactions).slice(0, 4), [txHistory]);

  const topMovers = useMemo(() =>
    [...marketTrends].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 4),
  []);

  const txIconMap = {
    send: ArrowUpRight,
    receive: ArrowDownLeft,
    swap: Repeat,
    buy: CreditCard,
  };
  const txColorMap = {
    send: 'text-rose-400 bg-rose-500/10',
    receive: 'text-emerald-400 bg-emerald-500/10',
    swap: 'text-violet-400 bg-violet-500/10',
    buy: 'text-blue-400 bg-blue-500/10',
  };

  const changeNum = Number(totalChange);
  const changePositive = changeNum >= 0;
  const absChange = Math.abs(changeNum);
  const changeValue = Math.abs(totalBalance * changeNum / 100).toFixed(2);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 sm:space-y-6">

      {/* ════════════════ HERO BALANCE CARD ════════════════ */}
      <motion.div variants={item}>
        <div className="relative overflow-hidden rounded-3xl p-5 sm:p-7"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #a78bfa 70%, #818cf8 100%)',
          }}
        >
          {/* animated bg orbs */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-float" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-purple-300/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-pulse-soft" />

          {/* shimmer overlay */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            </div>
          </div>

          <div className="relative z-10">
            {/* greeting */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-xs sm:text-sm font-medium flex items-center gap-1.5">
                  <Sparkles size={13} className="text-yellow-300" />
                  {greeting}
                </p>
                <p className="text-white/50 text-[10px] sm:text-xs mt-0.5">{todayStr}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white/80 transition-all duration-200"
              >
                <AnimatePresence mode="wait">
                  <motion.div key={balanceVisible ? 'show' : 'hide'} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
                    {balanceVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>

            {/* balance */}
            <div className="mb-1">
              <p className="text-white/60 text-[11px] sm:text-xs font-medium tracking-wider uppercase mb-1.5">Total Portfolio</p>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={balanceVisible ? 'visible' : 'hidden'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
                >
                  {balanceVisible ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••'}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* change indicator */}
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                changePositive
                  ? 'bg-emerald-400/20 text-emerald-200'
                  : 'bg-red-400/20 text-red-200'
              }`}>
                {changePositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {changePositive ? '+' : ''}{totalChange}%
              </span>
              <span className="text-white/40 text-[11px] sm:text-xs">
                {balanceVisible ? `${changePositive ? '+' : '-'}$${Number(changeValue).toLocaleString()}` : '••••'} past 30d
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ════════════════ QUICK ACTIONS ════════════════ */}
      <motion.div variants={item}>
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
          {quickActions.map(({ icon: Icon, label, gradient, glow, path }) => (
            <motion.button
              key={label}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-2 sm:gap-2.5 py-2.5 sm:py-3 group"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg ${glow} group-hover:shadow-xl transition-all duration-300`}>
                <Icon size={20} className="text-white sm:w-[22px] sm:h-[22px]" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                {label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ════════════════ PORTFOLIO CHART + ALLOCATION ════════════════ */}
      <motion.div variants={item}>
        <Card variant="solid" padding="none" hover={false}>
          <div className="p-4 sm:p-5 pb-0">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <TrendingUp size={16} className="text-primary-500" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Portfolio</h3>
              </div>
              <div className="flex bg-surface-100/80 dark:bg-dark-100/80 rounded-xl p-1">
                {periods.map(p => (
                  <button
                    key={p}
                    onClick={() => setChartPeriod(p)}
                    className={`px-2 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all duration-200 ${
                      chartPeriod === p
                        ? 'bg-white dark:bg-dark-50 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-2 sm:px-3">
            <PortfolioChart data={portfolioHistory} height={180} />
          </div>

          {/* allocation strip */}
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-surface-200/50 dark:border-white/5">
            <div className="flex items-center gap-4">
              <AllocationDonut assets={assets} size={64} />
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                {assets.slice(0, 5).map(asset => {
                  const pct = ((asset.value / totalBalance) * 100).toFixed(1);
                  return (
                    <div key={asset.id} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: asset.color }} />
                      <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">{asset.symbol}</span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 dark:text-gray-300">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ════════════════ MARKET MOVERS ════════════════ */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <Flame size={16} className="text-orange-500" />
            Top Movers
          </h3>
          <button onClick={() => navigate('/market')} className="text-[11px] sm:text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-0.5">
            See All <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
          {topMovers.map((coin) => (
            <motion.div
              key={coin.id}
              whileHover={{ y: -3 }}
              className="min-w-[130px] sm:min-w-[150px] flex-shrink-0"
            >
              <Card variant="solid" padding="sm" hover className="cursor-pointer" onClick={() => navigate('/market')}>
                <div className="flex items-center gap-2 mb-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-dark-50 shadow-sm overflow-hidden"
                  >
                    <img 
                      src={coin.icon} 
                      alt={coin.name} 
                      className="w-5 h-5 object-contain" 
                      onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white truncate">{coin.symbol}</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 truncate">{coin.name}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-0.5">
                  ${coin.price >= 1 ? coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : coin.price.toFixed(4)}
                </p>
                <span className={`inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold ${
                  coin.change >= 0 ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {coin.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {coin.change >= 0 ? '+' : ''}{coin.change}%
                </span>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ════════════════ RECENT TRANSACTIONS ════════════════ */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <Clock size={16} className="text-primary-400" />
            Recent Activity
          </h3>
          <button onClick={() => navigate('/history')} className="text-[11px] sm:text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-0.5">
            View All <ChevronRight size={12} />
          </button>
        </div>
        <Card variant="solid" padding="none" hover={false}>
          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            {recentTx.map((tx, idx) => {
              const asset = assets.find(a => a.symbol === tx.asset) || marketTrends.find(m => m.symbol === tx.asset);
              const assetIcon = asset?.icon || 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png';
              const dateObj = new Date(tx.date);
              const timeStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-surface-50/80 dark:hover:bg-dark-50/40 transition-colors cursor-pointer"
                  onClick={() => navigate('/history')}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white dark:bg-dark-50 shadow-sm border border-surface-200/50 dark:border-white/5 overflow-hidden`}>
                    <img 
                      src={assetIcon} 
                      alt={tx.asset} 
                      className="w-5 h-5 sm:w-6 sm:h-6 object-contain" 
                      onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white capitalize">{tx.type} {tx.asset}</p>
                    <p className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500">{timeStr}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-[13px] sm:text-sm font-bold ${
                      tx.type === 'receive' ? 'text-emerald-500' : 'text-gray-900 dark:text-white'
                    }`}>
                      {tx.type === 'receive' ? '+' : tx.type === 'send' ? '-' : ''}${tx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      tx.status === 'success' ? 'bg-emerald-500/10 text-emerald-500'
                      : tx.status === 'pending' ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-red-500/10 text-red-500'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* ════════════════ CRYPTO ASSETS LIST ════════════════ */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <Wallet size={16} className="text-violet-400" />
            Your Assets
          </h3>
          <button
            onClick={() => navigate('/wallet')}
            className="text-[11px] sm:text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-0.5"
          >
            View All <ChevronRight size={12} />
          </button>
        </div>
        <Card variant="solid" padding="none" hover={false}>
          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            {assets.map((asset, index) => (
              <motion.button
                key={asset.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.35 }}
                onClick={() => navigate('/wallet')}
                className="w-full flex items-center gap-3 sm:gap-3.5 px-4 sm:px-5 py-3.5 sm:py-4 hover:bg-surface-50/80 dark:hover:bg-dark-50/40 transition-colors group"
              >
                {/* rank */}
                <span className="text-[10px] font-bold text-gray-300 dark:text-gray-600 w-4 flex-shrink-0 text-center">
                  {index + 1}
                </span>

                {/* Icon */}
                <div className="relative">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center bg-white dark:bg-dark-50 flex-shrink-0 shadow-sm border border-surface-200/50 dark:border-white/5 transition-transform duration-200 group-hover:scale-105 overflow-hidden"
                  >
                    <img 
                      src={asset.icon} 
                      alt={asset.name} 
                      className="w-6 h-6 sm:w-7 sm:h-7 object-contain" 
                      onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                    />
                  </div>
                  {/* top asset indicator */}
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
                      <Star size={8} className="text-white fill-white" />
                    </div>
                  )}
                </div>

                {/* Name & holdings */}
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[13px] sm:text-sm font-bold text-gray-900 dark:text-white truncate">{asset.name}</p>
                  <p className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 font-medium">
                    {balanceVisible ? `${asset.holdings} ${asset.symbol}` : '••••'}
                  </p>
                </div>

                {/* Sparkline */}
                <div className="hidden xs:block">
                  <SparkLine
                    data={asset.sparkline}
                    color={asset.change24h >= 0 ? '#22c55e' : '#ef4444'}
                    width={56}
                    height={24}
                  />
                </div>

                {/* Value & change */}
                <div className="text-right flex-shrink-0">
                  <p className="text-[13px] sm:text-sm font-bold text-gray-900 dark:text-white">
                    {balanceVisible ? `$${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••'}
                  </p>
                  <div className={`flex items-center justify-end gap-0.5 text-[11px] sm:text-xs font-bold ${
                    asset.change24h >= 0 ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {asset.change24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* bottom spacer for mobile nav */}
      <div className="h-4" />
    </motion.div>
  );
}
