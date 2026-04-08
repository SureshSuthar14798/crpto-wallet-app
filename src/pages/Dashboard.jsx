import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, Send, Download, CreditCard, ArrowLeftRight,
  TrendingUp, TrendingDown, ChevronRight, Sparkles, Clock,
  ArrowUpRight, ArrowDownLeft, Repeat, Wallet, Star, Flame, Zap,
  Search, Bell, Plus, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import PortfolioChart from '../components/charts/PortfolioChart';
import SparkLine from '../components/charts/SparkLine';
import Button from '../components/common/Button';
import { useWallet } from '../context/WalletContext';
import { portfolioHistory, transactions, marketTrends } from '../data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
};

/* ─── tiny donut ─── */
function AllocationDonut({ assets, size = 120 }) {
  const total = assets.reduce((s, a) => s + a.value, 0);
  const r = (size - 9) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="relative flex items-center justify-center p-1">
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-sm">
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
              strokeWidth={8}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 3px ${asset.color}40)` }}
            />
          );
          offset += dash;
          return seg;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Stock</span>
        <span className="text-lg font-black text-gray-900 dark:text-white leading-none">{assets.length}</span>
      </div>
    </div>
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
  const [performanceChartType, setPerformanceChartType] = useState('area'); // 'area' | 'bar'

  const greeting = useMemo(() => getGreeting(), []);
  const todayStr = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }), []);

  const quickActions = [
    { icon: Send, label: 'Send', gradient: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-500/25', path: '/send' },
    { icon: Download, label: 'Receive', gradient: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/25', path: '/receive' },
    { icon: ArrowLeftRight, label: 'Swap', gradient: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/25', path: '/swap' },
    { icon: CreditCard, label: 'Buy', gradient: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/25', path: '/swap' },
  ];

  const recentTx = useMemo(() => (txHistory || transactions).slice(0, 4), [txHistory]);

  const topMovers = useMemo(() =>
    [...marketTrends].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 6),
  []);

  const filteredHistory = useMemo(() => {
    switch (chartPeriod) {
      case '1W': return portfolioHistory.slice(-7);
      case '1M': return portfolioHistory.slice(-30);
      case '3M': return portfolioHistory;
      default: return portfolioHistory;
    }
  }, [chartPeriod]);

  const changeNum = Number(totalChange);
  const changePositive = changeNum >= 0;

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="space-y-6 pb-24 lg:pb-12"
    >
      {/* ════════════════ TOP APP BAR ════════════════ */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            {greeting}, <span className="text-primary-500">Suresh</span>
          </h1>
          <p className="text-xs text-gray-400 font-medium">{todayStr}</p>
        </div>
      </motion.div>

      {/* ════════════════ HERO BALANCE CARD ════════════════ */}
      <motion.div variants={item} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-[2.5rem] blur-2xl opacity-20 transition-opacity group-hover:opacity-30" />
        <div className="relative overflow-hidden rounded-[2rem] p-6 sm:p-8 bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#a78bfa] shadow-2xl overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/15 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-indigo-300/10 rounded-full blur-2xl animate-pulse-soft" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <p className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Wallet size={12} />
                    Net Worth
                  </p>
                </div>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  {balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              <div className="space-y-1">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={balanceVisible ? 'visible' : 'hidden'}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-4xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight"
                  >
                    {balanceVisible ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••'}
                  </motion.h2>
                </AnimatePresence>
                
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold leading-none ${
                    changePositive ? 'bg-emerald-400/20 text-emerald-100' : 'bg-red-400/20 text-red-100'
                  }`}>
                    {changePositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {changePositive ? '+' : ''}{totalChange}%
                  </div>
                  <span className="text-white/50 text-xs font-medium">+$2,482.10 past month</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
                <PortfolioChart data={portfolioHistory.slice(-10)} height={80} width={200} hideAxis color="#ffffff" id="hero" />
                <p className="text-center text-white/70 text-[10px] uppercase font-black tracking-widest mt-2 px-1">7D Growth Curve</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ════════════════ QUICK ACTIONS ════════════════ */}
      <motion.div variants={item} className="grid grid-cols-4 gap-3 sm:gap-6 px-1">
        {quickActions.map(({ icon: Icon, label, gradient, glow, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-3 transition-transform hover:-translate-y-1 active:scale-95 group"
          >
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[1.5rem] bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${glow} transition-all group-hover:shadow-xl relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Icon size={24} className="text-white relative z-10" />
            </div>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-primary-500 transition-colors leading-none tracking-tight">
              {label}
            </span>
          </button>
        ))}
      </motion.div>

      {/* ════════════════ PORTFOLIO ANALYTICS ════════════════ */}
      <motion.div variants={item}>
        <Card variant="glass" padding="none" className="overflow-hidden border-none shadow-sm dark:shadow-white/5">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-sm">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Portfolio Performance</h3>
                  <p className="text-xs text-gray-400 font-medium tracking-tight">Real-time growth analytics</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                <div className="flex bg-surface-100/80 dark:bg-white/5 rounded-xl p-1 shadow-inner shrink-0">
                  {['area', 'bar'].map(type => (
                    <button
                      key={type}
                      onClick={() => setPerformanceChartType(type)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all capitalize whitespace-nowrap ${
                        performanceChartType === type
                          ? 'bg-white dark:bg-dark-100 text-primary-600 dark:text-primary-400 shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                    >
                      {type === 'area' ? 'Curve' : 'Columns'}
                    </button>
                  ))}
                </div>
                <div className="flex bg-surface-100/80 dark:bg-white/5 rounded-xl p-1 shadow-inner shrink-0">
                  {['1W', '1M', '3M', 'ALL'].map(p => (
                    <button
                      key={p}
                      onClick={() => setChartPeriod(p)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        chartPeriod === p
                          ? 'bg-white dark:bg-dark-100 text-primary-600 dark:text-primary-400 shadow-sm'
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-surface-50/50 dark:bg-white/[0.02] rounded-[2.5rem] p-4 sm:p-6 border border-surface-200/50 dark:border-white/5 relative overflow-hidden group mb-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <PortfolioChart data={filteredHistory} height={300} type={performanceChartType} />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 py-2 px-1">
              {/* Leader Section (Donut) */}
              <div className="flex-shrink-0 relative group flex items-center gap-4 border-b sm:border-b-0 sm:border-r border-surface-200/50 dark:border-white/5 pb-4 sm:pb-0 sm:pr-6 w-full sm:w-auto justify-center sm:justify-start">
                <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <AllocationDonut assets={assets} size={70} />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Portfolio Mix</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white leading-none">Healthy Mix</p>
                </div>
              </div>

              {/* Assets Grid/Wrap Section */}
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {assets.map(asset => (
                  <div 
                    key={asset.id} 
                    className="flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-xl bg-white dark:bg-white/[0.03] border border-surface-200/60 dark:border-white/10 shadow-sm hover:shadow-md hover:border-primary-500/20 transition-all cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-surface-50 dark:bg-white/5 p-1 border border-surface-100 dark:border-white/5 group-hover:scale-105 transition-transform flex-shrink-0">
                      <img src={asset.icon} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter">{asset.symbol}</span>
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: asset.color }} />
                      </div>
                      <p className="text-[11px] font-black text-gray-900 dark:text-white leading-none">
                        {((asset.value / totalBalance) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ════════════════ TOP MOVERS ════════════════ */}
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Flame size={18} className="text-orange-500 fill-orange-500" />
              Hot Market
            </h3>
            <button 
              onClick={() => navigate('/market')} 
              className="text-xs font-bold text-primary-500 hover:underline flex items-center gap-0.5"
            >
              Market <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {topMovers.map((coin) => (
              <Card 
                key={coin.id} 
                variant="glass" 
                padding="sm" 
                className="hover:-translate-y-1 transition-transform cursor-pointer group"
                onClick={() => navigate('/market')}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-white/5 p-2 shadow-sm border border-surface-200 dark:border-white/10 group-hover:scale-110 transition-transform">
                    <img src={coin.icon} alt={coin.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase">{coin.symbol}</p>
                    <p className="text-[10px] font-medium text-gray-400 truncate mt-0.5">Vol: {coin.volume}</p>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-[13px] font-bold text-gray-900 dark:text-white">
                    ${coin.price >= 1 ? coin.price.toLocaleString() : coin.price.toFixed(4)}
                  </p>
                  <div className={`text-[10px] font-black leading-none ${coin.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {coin.change > 0 && '+'}{coin.change}%
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* ════════════════ RECENT ACTIVITY ════════════════ */}
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <Clock size={18} className="text-primary-500" />
              Recent Logs
            </h3>
            <button 
              onClick={() => navigate('/history')} 
              className="text-xs font-bold text-primary-500 hover:underline flex items-center gap-0.5"
            >
              Full History <ChevronRight size={14} />
            </button>
          </div>
          <Card variant="solid" padding="none" className="overflow-hidden">
            <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
              {recentTx.map((tx, idx) => {
                const isReceive = tx.type === 'receive';
                return (
                  <motion.div
                    key={tx.id}
                    layoutId={tx.id}
                    className="flex items-center gap-4 p-4 hover:bg-surface-50/50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      isReceive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary-500/10 text-primary-500'
                    }`}>
                      {isReceive ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-extrabold text-gray-900 dark:text-white leading-none">
                        {isReceive ? 'From' : 'To'} {tx.assetName || tx.asset}
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium mt-1">
                        {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[13px] font-black ${isReceive ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                        {isReceive ? '+' : '-'}${tx.value.toLocaleString()}
                      </p>
                      <div className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md inline-block mt-1 ${
                        tx.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 shadow-sm shadow-emerald-500/10' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {tx.status}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ════════════════ ASSET ALLOCATION LIST ════════════════ */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Zap size={18} className="text-yellow-500 fill-yellow-500" />
            Wallet Portfolio
          </h3>
          <Button variant="outline" size="sm" onClick={() => navigate('/wallet')} className="!px-3 !py-1 text-xs">
            Manage
          </Button>
        </div>
        <Card variant="glass" padding="none" className="overflow-hidden border-none">
          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            {assets.map((asset, index) => (
              <motion.button
                key={asset.id}
                onClick={() => navigate('/wallet')}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.05] transition-colors group"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-lg border border-surface-200/50 dark:border-white/10 group-hover:scale-110 transition-transform overflow-hidden">
                    <img src={asset.icon} alt={asset.name} className="w-7 h-7 object-contain" />
                  </div>
                  {index === 0 && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 rounded-full border-2 border-surface-50 dark:border-dark-300 flex items-center justify-center">
                      <Star size={10} className="text-white fill-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-black text-gray-900 dark:text-white truncate uppercase tracking-tight">{asset.name}</p>
                    <span className="text-[10px] text-gray-400 font-bold">{asset.symbol}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-gray-400 font-medium">
                      {balanceVisible ? `${asset.holdings} ${asset.symbol}` : '••••'}
                    </p>
                    {asset.change24h !== undefined && (
                      <div className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                        asset.change24h >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {asset.change24h}% 24h
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[15px] font-black text-gray-900 dark:text-white leading-none">
                    {balanceVisible ? `$${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••'}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-tighter">
                    {asset.price ? `$${asset.price.toLocaleString()}` : ''}
                  </p>
                </div>
                
                <ChevronRight size={18} className="text-gray-300 dark:text-gray-700 ml-1 group-hover:text-primary-500 transition-colors" />
              </motion.button>
            ))}
          </div>
          <button 
            onClick={() => navigate('/wallet')}
            className="w-full py-4 text-xs font-black text-primary-500 hover:bg-surface-50 dark:hover:bg-white/5 transition-colors uppercase tracking-widest border-t border-surface-200/50 dark:border-white/5 flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Add New Asset
          </button>
        </Card>
      </motion.div>
    </motion.div>
  );
}
