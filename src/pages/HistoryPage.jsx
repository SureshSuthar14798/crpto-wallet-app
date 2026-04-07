import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, CreditCard, Filter, ChevronRight, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import Card from '../components/common/Card';
import Tabs from '../components/common/Tabs';
import { EmptyState } from '../components/common/States';
import { useWallet } from '../context/WalletContext';
import { marketTrends, cryptoAssets } from '../data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const typeConfig = {
  send: { icon: ArrowUpRight, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20', label: 'Sent' },
  receive: { icon: ArrowDownLeft, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/20', label: 'Received' },
  swap: { icon: ArrowLeftRight, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20', label: 'Swapped' },
  buy: { icon: CreditCard, color: 'text-violet-500', bg: 'bg-violet-100 dark:bg-violet-900/20', label: 'Bought' },
};

const statusConfig = {
  success: { icon: CheckCircle, color: 'text-emerald-500', label: 'Success' },
  pending: { icon: Loader, color: 'text-amber-500', label: 'Pending' },
  failed: { icon: XCircle, color: 'text-red-500', label: 'Failed' },
};

export default function HistoryPage() {
  const { txHistory } = useWallet();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'send', label: 'Sent' },
    { id: 'receive', label: 'Received' },
    { id: 'swap', label: 'Swapped' },
    { id: 'buy', label: 'Bought' },
  ];

  const filtered = filter === 'all' ? txHistory : txHistory.filter(tx => tx.type === filter);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 sm:space-y-5">
      {/* Filter tabs */}
      <motion.div variants={item}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                filter === f.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-surface-100 dark:bg-dark-50 text-gray-500 dark:text-gray-400 hover:bg-surface-200 dark:hover:bg-dark-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Transaction list */}
      {filtered.length === 0 ? (
        <EmptyState title="No Transactions" message="No transactions match the selected filter." />
      ) : (
        <motion.div variants={item}>
          <Card variant="solid" padding="none">
            <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
              {filtered.map((tx, index) => {
                const type = typeConfig[tx.type];
                const status = statusConfig[tx.status];
                const TypeIcon = type.icon;
                const StatusIcon = status.icon;

                return (
                  <motion.button
                    key={tx.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => setSelected(selected === tx.id ? null : tx.id)}
                    className="w-full text-left px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-surface-50/80 dark:hover:bg-dark-50/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white dark:bg-dark-50 shadow-sm border border-surface-200/50 dark:border-white/5 flex-shrink-0 overflow-hidden">
                        <img 
                          src={marketTrends.find(m => m.symbol === tx.asset)?.icon || cryptoAssets.find(c => c.symbol === tx.asset)?.icon || 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'} 
                          alt={tx.asset} 
                          className="w-5 h-5 sm:w-6 sm:h-6 object-contain" 
                          onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {type.label} {tx.asset}
                          </p>
                          <StatusIcon size={14} className={`${status.color} ${tx.status === 'pending' ? 'animate-spin' : ''}`} />
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDate(tx.date)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-[13px] sm:text-sm font-semibold ${tx.type === 'send' ? 'text-red-500' : 'text-emerald-500'}`}>
                          {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.asset}
                        </p>
                        <p className="text-xs text-gray-400">${tx.value.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {selected === tx.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-3 pt-3 border-t border-surface-200/50 dark:border-white/[0.04] space-y-2"
                      >
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Status</span>
                          <span className={`font-semibold ${status.color}`}>{status.label}</span>
                        </div>
                        {tx.to && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">To</span>
                            <span className="font-mono text-gray-600 dark:text-gray-400">{tx.to}</span>
                          </div>
                        )}
                        {tx.from && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">From</span>
                            <span className="font-mono text-gray-600 dark:text-gray-400">{tx.from}</span>
                          </div>
                        )}
                        {tx.toAsset && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Received</span>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              {tx.toAmount} {tx.toAsset}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Fee</span>
                          <span className="text-gray-600 dark:text-gray-400">${tx.feeValue}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">TX Hash</span>
                          <span className="font-mono text-primary-500 text-[10px] truncate max-w-[120px] sm:max-w-none">{tx.hash}</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
