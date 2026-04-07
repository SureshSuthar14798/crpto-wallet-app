import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Search, Star } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import { marketTrends } from '../data/mockData';
import { useDebounce } from '../hooks/useUtils';

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function MarketPage() {
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState(['bitcoin', 'ethereum']);
  const debouncedSearch = useDebounce(search, 250);

  const filtered = marketTrends.filter(c =>
    c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    c.symbol.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const toggleFav = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const stats = [
    { label: 'Market Cap', value: '$2.84T', change: '+1.2%' },
    { label: '24h Volume', value: '$98.4B', change: '+3.8%' },
    { label: 'BTC Dominance', value: '54.2%', change: '-0.3%' },
    { label: 'Fear & Greed', value: '72', change: 'Greed' },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } }} className="space-y-5">
      <motion.div variants={item}>
        <Input placeholder="Search coins..." icon={Search} value={search} onChange={(e) => setSearch(e.target.value)} />
      </motion.div>

      <motion.div variants={item}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s) => (
            <Card key={s.label} variant="solid" padding="md" hover={false}>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{s.label}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{s.value}</p>
              <p className={`text-xs font-semibold mt-0.5 ${s.change.startsWith('+') ? 'text-emerald-500' : s.change.startsWith('-') ? 'text-red-500' : 'text-amber-500'}`}>{s.change}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card variant="solid" padding="none">
          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            {filtered.map((coin, i) => (
              <motion.div key={coin.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-50/80 dark:hover:bg-dark-50/40 transition-colors">
                <button onClick={() => toggleFav(coin.id)} className="hidden lg:block">
                  <Star size={14} className={favorites.includes(coin.id) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'} />
                </button>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: coin.color }}>{coin.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{coin.name}</p>
                  <p className="text-xs text-gray-400">{coin.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  <div className={`flex items-center justify-end gap-0.5 text-xs font-semibold ${coin.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {coin.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {coin.change >= 0 ? '+' : ''}{coin.change}%
                  </div>
                </div>
                <div className="hidden lg:block text-right min-w-[80px]">
                  <p className="text-xs text-gray-400">MCap</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">${coin.marketCap}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
