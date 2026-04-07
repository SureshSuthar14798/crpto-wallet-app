import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Lock, Clock, Coins, ChevronRight, 
  Zap, Flame, ShieldCheck, Info, ArrowUpRight, 
  PieChart, Wallet, Calendar, AlertCircle
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { stakingOptions } from '../data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
};

export default function StakingPage() {
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');

  const active = stakingOptions.filter(s => s.status === 'active');
  const available = stakingOptions.filter(s => s.status === 'available');

  const totalRewards = active.reduce((sum, s) => sum + s.yourRewards, 0);
  const totalStakedUsd = active.reduce((sum, s) => sum + (s.yourStake * 3245.80), 0); // Mock price

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-12 max-w-4xl mx-auto">
      
      {/* ===== REWARDS & STATS HERO ===== */}
      <motion.div variants={item}>
        <div className="relative group">
          {/* Background Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-[32px] blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
          
          <Card variant="solid" padding="none" className="overflow-hidden border-none shadow-2xl">
            <div className="relative p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white dark:bg-dark-200">
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full w-fit">
                   <Zap size={14} className="text-amber-500" />
                   <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Rewards Dashboard</span>
                </div>
                <div>
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-0.5">Estimated Earnings</p>
                   <div className="flex items-baseline gap-2">
                      <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                        ${(totalRewards * 3245.80).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h2>
                      <span className="text-sm font-bold text-emerald-500 flex items-center gap-0.5"><ArrowUpRight size={14} />+12%</span>
                   </div>
                </div>
                <div className="flex items-center gap-6 pt-1">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Stakes</span>
                      <span className="text-lg font-black text-gray-900 dark:text-white leading-none mt-1">{active.length} Assets</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Staked Value</span>
                      <span className="text-lg font-black text-gray-900 dark:text-white leading-none mt-1">${totalStakedUsd.toLocaleString()}</span>
                   </div>
                </div>
              </div>

              {/* Visual Decorative Element */}
              <div className="hidden md:flex relative shrink-0">
                 <div className="w-32 h-32 rounded-3xl bg-amber-500/10 flex items-center justify-center rotate-12 relative overflow-hidden">
                    <Coins size={64} className="text-amber-500/30" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent" />
                 </div>
                 <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center -rotate-12 border border-white/20 backdrop-blur-md">
                    <TrendingUp size={28} className="text-orange-500" />
                 </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* ===== ACTIVE STAKES SECTION ===== */}
      {active.length > 0 && (
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Current Active Stakes</h3>
            <span className="text-[10px] font-bold text-gray-500 bg-surface-100 dark:bg-dark-100 px-2 py-1 rounded-md">Real-time Yielding</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map(s => (
              <Card key={s.id} variant="solid" padding="lg" hover={true}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white dark:bg-dark-100 shadow-sm border border-surface-200/50 dark:border-white/5 overflow-hidden transition-transform group-hover:scale-105">
                      <img 
                        src={s.icon} 
                        alt={s.assetName} 
                        className="w-8 h-8 object-contain" 
                        onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white leading-none mb-1">{s.assetName}</p>
                      <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{s.asset}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge-success text-[10px] font-black uppercase tracking-widest">{s.apy}% APY</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Staked</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{s.yourStake} {s.asset}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Earnings</p>
                    <p className="text-sm font-black text-emerald-500">+{s.yourRewards} {s.asset}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-surface-100 dark:border-white/5 flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                   <span className="flex items-center gap-1.5"><Clock size={12} /> {s.lockPeriod} Left</span>
                   <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
                   <span className="text-primary-500">Auto-compound Active</span>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* ===== HIGH YIELD POOLS SECTION ===== */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Flame size={16} className="text-orange-500" />
            High Yield Pools
          </h3>
          <button className="text-[11px] font-bold text-primary-500 hover:text-primary-600 transition-colors">Explore All</button>
        </div>
        <Card variant="solid" padding="none">
          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            {available.map(s => (
              <button 
                key={s.id} 
                onClick={() => setSelected(s)}
                className="w-full flex items-center gap-4 px-6 sm:px-8 py-5 sm:py-6 hover:bg-surface-50 dark:hover:bg-dark-50/40 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-[18px] flex items-center justify-center bg-white dark:bg-dark-50 shadow-sm border border-surface-200/50 dark:border-white/5 overflow-hidden transition-transform group-hover:scale-105">
                  <img 
                    src={s.icon} 
                    alt={s.assetName} 
                    className="w-8 h-8 object-contain" 
                    onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-black text-gray-900 dark:text-white leading-none mb-2">{s.assetName}</p>
                  <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                    <span className="flex items-center gap-1.5 text-primary-500"><Lock size={12} /> {s.lockPeriod}</span>
                    <span className="hidden xs:flex items-center gap-1.5"><Calendar size={12} /> Min {s.minStake} {s.asset}</span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-4">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-gray-400 uppercase">APY</p>
                    <p className="text-lg font-black text-orange-500 leading-none">{s.apy}%</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-surface-100 dark:bg-dark-100 flex items-center justify-center text-gray-400 group-hover:bg-primary-500 group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ===== STAKING CALCULATOR / INFO ===== */}
      <motion.div variants={item}>
         <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-primary-500/10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500 shrink-0">
               <Info size={28} />
            </div>
            <div className="flex-1 text-center md:text-left">
               <h4 className="text-lg font-bold text-gray-900 dark:text-white">Why Stake with CryptoVault?</h4>
               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                 We select only the most secure and high-performing validation nodes to ensure your assets are protected while maximizing yield. Rewards are distributed every 24 hours.
               </p>
            </div>
            <Button variant="secondary" size="md" className="shrink-0">Learn More</Button>
         </div>
      </motion.div>

      {/* ===== STAKE MODAL ===== */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`New ${selected?.assetName || ''} Stake`}>
        {selected && (
          <div className="space-y-6 pt-2">
            <div className="bg-orange-500/5 p-6 rounded-[24px] border border-orange-500/10 text-center">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2 block">Pool Yield</span>
              <h4 className="text-4xl font-black text-orange-500 leading-none mb-2">{selected.apy}% APY</h4>
              <p className="text-xs font-bold text-gray-500">Funds locked for {selected.lockPeriod}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between px-1">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stake Amount ({selected.asset})</label>
                 <span className="text-[10px] font-bold text-primary-500">Available: 4.23 {selected.asset}</span>
              </div>
              <div className="relative group">
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder={`Min ${selected.minStake}`}
                  className="w-full px-6 py-5 bg-surface-50 dark:bg-dark-50 border-2 border-transparent focus:border-orange-500/20 rounded-2xl text-2xl font-black text-gray-900 dark:text-white focus:outline-none transition-all" 
                />
                <button 
                  onClick={() => setAmount('4.23')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-surface-100 dark:bg-dark-100 text-[10px] font-black text-gray-500 hover:text-orange-500 transition-colors uppercase"
                >
                  MAX
                </button>
              </div>
            </div>

            <AnimatePresence>
              {amount && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <Card variant="outline" padding="lg" className="bg-surface-50/50 dark:bg-dark-50/20 border-surface-200 dark:border-white/5 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-bold uppercase tracking-wider">Yearly Earnings</span>
                      <span className="font-black text-emerald-500 text-sm">+{(parseFloat(amount) * selected.apy / 100).toFixed(4)} {selected.asset}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-3 border-t border-surface-100 dark:border-white/5">
                      <span className="text-gray-400 font-bold uppercase tracking-wider">Monthly Profit</span>
                      <span className="font-black text-gray-700 dark:text-gray-300 text-sm">+{(parseFloat(amount) * selected.apy / 100 / 12).toFixed(4)} {selected.asset}</span>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 p-4 bg-primary-500/5 rounded-2xl border border-primary-500/10">
               <ShieldCheck size={18} className="text-primary-500 shrink-0" />
               <p className="text-[11px] font-medium text-primary-700 dark:text-primary-400/80 leading-relaxed">
                 Assets will be locked for {selected.lockPeriod}. Early withdrawal is not permitted in this high-yield pool.
               </p>
            </div>

            <Button 
               fullWidth 
               size="lg" 
               disabled={!amount || parseFloat(amount) < selected.minStake}
               className="h-16 rounded-[24px]"
            >
              Confirm 12-Month Stake
            </Button>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
