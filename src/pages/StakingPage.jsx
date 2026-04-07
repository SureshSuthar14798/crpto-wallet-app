import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Lock, Clock, Coins, ChevronRight } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { stakingOptions } from '../data/mockData';

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function StakingPage() {
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');

  const active = stakingOptions.filter(s => s.status === 'active');
  const available = stakingOptions.filter(s => s.status === 'available');

  const totalRewards = active.reduce((sum, s) => sum + s.yourRewards, 0);

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }} className="space-y-4 sm:space-y-5">
      {/* Rewards Overview */}
      <motion.div variants={item}>
        <Card variant="gradient" padding="lg" hover={false}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center">
              <Coins size={24} className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Rewards Earned</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                ${(totalRewards * 3245.80).toFixed(2)}
              </p>
              <p className="text-xs text-emerald-500 font-medium">Across {active.length} active stakes</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Active Stakes */}
      {active.length > 0 && (
        <motion.div variants={item}>
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Active Stakes</h3>
          <div className="space-y-3">
            {active.map(s => (
              <Card key={s.id} variant="solid" padding="md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-dark-50 shadow-sm border border-surface-200/50 dark:border-white/5 flex-shrink-0 overflow-hidden">
                    <img 
                      src={s.icon} 
                      alt={s.assetName} 
                      className="w-6 h-6 object-contain" 
                      onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.assetName}</p>
                    <p className="text-xs text-gray-400">{s.lockPeriod} lock</p>
                  </div>
                  <span className="badge-success text-[10px]">{s.apy}% APY</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface-100 dark:bg-dark-50 rounded-xl p-3">
                    <p className="text-[11px] text-gray-400 uppercase">Staked</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{s.yourStake} {s.asset}</p>
                  </div>
                  <div className="bg-surface-100 dark:bg-dark-50 rounded-xl p-3">
                    <p className="text-[11px] text-gray-400 uppercase">Rewards</p>
                    <p className="text-sm font-bold text-emerald-500">{s.yourRewards} {s.asset}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Available */}
      <motion.div variants={item}>
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Available to Stake</h3>
        <div className="space-y-3">
          {available.map(s => (
            <Card key={s.id} variant="solid" padding="md" onClick={() => setSelected(s)} className="cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-dark-50 shadow-sm border border-surface-200/50 dark:border-white/5 flex-shrink-0 overflow-hidden">
                  <img 
                    src={s.icon} 
                    alt={s.assetName} 
                    className="w-6 h-6 object-contain" 
                    onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.assetName}</p>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-[11px] sm:text-xs text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1"><TrendingUp size={10} />{s.apy}% APY</span>
                    <span className="flex items-center gap-1"><Lock size={10} />{s.lockPeriod}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />Min {s.minStake} {s.asset}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Stake Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Stake ${selected?.assetName || ''}`}>
        {selected && (
          <div className="space-y-4">
            <div className="text-center py-3">
              <p className="text-3xl font-bold text-emerald-500">{selected.apy}% APY</p>
              <p className="text-sm text-gray-500 mt-1">Lock period: {selected.lockPeriod}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Amount ({selected.asset})</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Min ${selected.minStake}`}
                className="w-full mt-2 px-4 py-3.5 bg-surface-100 dark:bg-dark-50 border border-surface-300/50 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-lg font-bold" />
            </div>
            {amount && (
              <div className="bg-surface-100 dark:bg-dark-50 rounded-xl p-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Estimated yearly reward</span>
                  <span className="font-semibold text-emerald-500">{(parseFloat(amount) * selected.apy / 100).toFixed(4)} {selected.asset}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Estimated monthly reward</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{(parseFloat(amount) * selected.apy / 100 / 12).toFixed(4)} {selected.asset}</span>
                </div>
              </div>
            )}
            <Button fullWidth disabled={!amount || parseFloat(amount) < selected.minStake}>
              Stake {selected.asset}
            </Button>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
