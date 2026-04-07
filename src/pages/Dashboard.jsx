import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Send, Download, CreditCard, ArrowLeftRight, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import PortfolioChart from '../components/charts/PortfolioChart';
import SparkLine from '../components/charts/SparkLine';
import { useWallet } from '../context/WalletContext';
import { portfolioHistory } from '../data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Dashboard() {
  const { assets, totalBalance, totalChange, balanceVisible, setBalanceVisible } = useWallet();
  const navigate = useNavigate();
  const [chartPeriod, setChartPeriod] = useState('1M');

  const quickActions = [
    { icon: Send, label: 'Send', color: 'bg-blue-500', path: '/send' },
    { icon: Download, label: 'Receive', color: 'bg-emerald-500', path: '/receive' },
    { icon: CreditCard, label: 'Buy', color: 'bg-violet-500', path: '/swap' },
    { icon: ArrowLeftRight, label: 'Swap', color: 'bg-amber-500', path: '/swap' },
  ];

  const periods = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 sm:space-y-5">
      {/* ======= BALANCE CARD ======= */}
      <motion.div variants={item}>
        <Card variant="gradient" padding="lg" hover={false} className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-accent-lavender/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</span>
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/5 text-gray-400 transition-colors"
              >
                {balanceVisible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">
              {balanceVisible ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••'}
            </h2>

            <div className="flex items-center gap-1.5">
              {Number(totalChange) >= 0 ? (
                <TrendingUp size={13} className="text-emerald-500" />
              ) : (
                <TrendingDown size={13} className="text-red-500" />
              )}
              <span className={`text-xs sm:text-sm font-semibold ${Number(totalChange) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {Number(totalChange) >= 0 ? '+' : ''}{totalChange}%
              </span>
              <span className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500">past 30d</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ======= QUICK ACTIONS ======= */}
      <motion.div variants={item}>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {quickActions.map(({ icon: Icon, label, color, path }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1.5 sm:gap-2 py-2 sm:py-3"
            >
              <div className={`w-11 h-11 sm:w-12 sm:h-12 ${color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <Icon size={18} className="text-white sm:w-5 sm:h-5" />
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ======= PORTFOLIO CHART ======= */}
      <motion.div variants={item}>
        <Card variant="solid" padding="md">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">Portfolio</h3>
            <div className="flex bg-surface-100/80 dark:bg-dark-50/80 rounded-lg sm:rounded-xl p-0.5 sm:p-1">
              {periods.map(p => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={`px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold rounded-md sm:rounded-lg transition-all duration-200 ${
                    chartPeriod === p
                      ? 'bg-white dark:bg-dark-100 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <PortfolioChart data={portfolioHistory} height={160} />
        </Card>
      </motion.div>

      {/* ======= CRYPTO ASSETS LIST ======= */}
      <motion.div variants={item}>
        <Card variant="solid" padding="none">
          <div className="flex items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-2 sm:pb-3">
            <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">Your Assets</h3>
            <button
              onClick={() => navigate('/wallet')}
              className="text-[11px] sm:text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-0.5"
            >
              View All <ChevronRight size={12} />
            </button>
          </div>

          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            {assets.map((asset, index) => (
              <motion.button
                key={asset.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate('/wallet')}
                className="w-full flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-surface-50/80 dark:hover:bg-dark-50/40 transition-colors"
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0"
                  style={{ backgroundColor: asset.color }}
                >
                  {asset.icon}
                </div>

                {/* Name */}
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white truncate">{asset.name}</p>
                  <p className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500">
                    {balanceVisible ? `${asset.holdings} ${asset.symbol}` : '••••'}
                  </p>
                </div>

                {/* Sparkline - hidden on very small screens */}
                <div className="hidden xs:block">
                  <SparkLine
                    data={asset.sparkline}
                    color={asset.change24h >= 0 ? '#22c55e' : '#ef4444'}
                    width={48}
                    height={20}
                  />
                </div>

                {/* Value */}
                <div className="text-right flex-shrink-0">
                  <p className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white">
                    {balanceVisible ? `$${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••'}
                  </p>
                  <div className={`flex items-center justify-end gap-0.5 text-[11px] sm:text-xs font-semibold ${
                    asset.change24h >= 0 ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {asset.change24h >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
