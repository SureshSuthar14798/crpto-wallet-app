import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Star, 
  ChevronRight, 
  Activity, 
  BarChart3, 
  Zap,
  Globe
} from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Tabs from '../components/common/Tabs';
import Button from '../components/common/Button';
import SparkLine from '../components/charts/SparkLine';
import { marketTrends, cryptoAssets } from '../data/mockData';
import { useDebounce } from '../hooks/useUtils';

const item = { 
  hidden: { opacity: 0, y: 20 }, 
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } 
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function MarketPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState(['bitcoin', 'ethereum', 'solana']);
  const debouncedSearch = useDebounce(search, 250);

  // Enhance market trends with sparklines from cryptoAssets
  const enrichedMarketData = useMemo(() => {
    return marketTrends.map(trend => {
      const asset = cryptoAssets.find(a => a.id === trend.id);
      return {
        ...trend,
        sparkline: asset?.sparkline || [40, 45, 42, 48, 46, 52, 50, 55], // fallback dummy data
      };
    });
  }, []);

  const tabs = [
    { id: 'all', label: 'All Assets' },
    { id: 'gainers', label: 'Gainers' },
    { id: 'losers', label: 'Losers' },
    { id: 'favorites', label: 'Favorites' },
  ];

  const filtered = useMemo(() => {
    let result = enrichedMarketData.filter(c =>
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.symbol.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    if (activeTab === 'gainers') {
      result = result.filter(c => c.change > 0).sort((a, b) => b.change - a.change);
    } else if (activeTab === 'losers') {
      result = result.filter(c => c.change < 0).sort((a, b) => a.change - b.change);
    } else if (activeTab === 'favorites') {
      result = result.filter(c => favorites.includes(c.id));
    }

    return result;
  }, [debouncedSearch, activeTab, favorites, enrichedMarketData]);

  const toggleFav = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const stats = [
    { label: 'Market Cap', value: '$2.84T', change: '+1.2%', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: '24h Volume', value: '$98.4B', change: '+3.8%', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Dominance', value: '54.2%', change: '-0.3%', icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Sentiment', value: 'Greed', change: '72/100', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden" 
      animate="show" 
      className="space-y-6 pb-20 lg:pb-10"
    >
      {/* Header Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Market Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Global market cap is up <span className="text-emerald-500 font-semibold">1.2%</span> in the last 24h
          </p>
        </div>
        <div className="w-full md:w-72">
          <Input 
            placeholder="Search coins..." 
            icon={Search} 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="!py-2.5"
          />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} variant="glass" padding="md" hover={true} className="relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</p>
                <p className={`text-xs font-bold mt-1.5 flex items-center gap-1 ${
                  s.change.startsWith('+') ? 'text-emerald-500' : s.change.startsWith('-') ? 'text-red-500' : 'text-blue-500'
                }`}>
                  {s.change.startsWith('+') && <TrendingUp size={12} />}
                  {s.change.startsWith('-') && <TrendingDown size={12} />}
                  {s.change}
                </p>
              </div>
              <div className={`p-2 rounded-xl ${s.bg} ${s.color} transition-transform group-hover:scale-110 duration-300`}>
                <s.icon size={20} />
              </div>
            </div>
            {/* Background Accent */}
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full ${s.bg} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />
          </Card>
        ))}
      </motion.div>

      {/* Tabs Filter */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
          className="w-full sm:w-auto"
        />
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 font-medium">
          <span>Sort by:</span>
          <select className="bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white cursor-pointer font-bold">
            <option>Market Cap</option>
            <option>Price</option>
            <option>24h Change</option>
          </select>
        </div>
      </motion.div>

      {/* Market List */}
      <motion.div variants={item}>
        <Card variant="glass" padding="none" className="overflow-hidden">
          {/* Table Header (Desktop Only) */}
          <div className="hidden md:grid grid-cols-[48px_1fr_120px_140px_140px_100px] gap-4 px-6 py-4 border-b border-surface-200/50 dark:border-white/[0.04] text-xs font-bold text-gray-500 uppercase tracking-widest">
            <div className="text-center">#</div>
            <div>Asset</div>
            <div className="text-right">Price</div>
            <div className="text-right">24h Change</div>
            <div className="flex justify-center">Last 7 Days</div>
            <div className="text-right">Action</div>
          </div>

          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                filtered.map((coin, i) => (
                  <motion.div 
                    key={coin.id} 
                    layout
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group flex flex-col md:grid md:grid-cols-[48px_1fr_120px_140px_140px_100px] items-center gap-4 px-5 md:px-6 py-4 hover:bg-surface-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    {/* Index & Fav */}
                    <div className="hidden md:flex items-center justify-center">
                      <button 
                        onClick={(e) => toggleFav(coin.id, e)}
                        className="p-1 hover:text-amber-400 transition-colors"
                      >
                        <Star 
                          size={16} 
                          className={favorites.includes(coin.id) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'} 
                        />
                      </button>
                    </div>

                    {/* Asset Info */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-dark-50 shadow-sm border border-surface-200/50 dark:border-white/5 flex-shrink-0 overflow-hidden p-1.5">
                        <img 
                          src={coin.icon} 
                          alt={coin.name} 
                          className="w-full h-full object-contain" 
                          onError={(e) => { e.target.src = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/generic.png'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{coin.name}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-100 dark:bg-white/5 text-gray-500 font-bold uppercase">{coin.symbol}</span>
                        </div>
                        <p className="text-xs text-gray-500 md:hidden mt-0.5">MCap: ${coin.marketCap}</p>
                        <p className="hidden md:block text-[11px] text-gray-400 mt-0.5 tracking-tight font-medium">MCap: ${coin.marketCap}</p>
                      </div>
                      
                      {/* Mobile Price & Change indicator */}
                      <div className="text-right md:hidden">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        <div className={`text-[11px] font-bold mt-0.5 ${coin.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {coin.change >= 0 ? '+' : ''}{coin.change}%
                        </div>
                      </div>
                    </div>

                    {/* Price (Desktop) */}
                    <div className="hidden md:block text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      <p className="text-[10px] text-gray-400 font-medium">0.00042 BTC</p>
                    </div>

                    {/* 24h Change (Desktop) */}
                    <div className="hidden md:flex justify-end items-center">
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        coin.change >= 0 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {coin.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {coin.change >= 0 ? '+' : ''}{coin.change}%
                      </div>
                    </div>

                    {/* Sparkline (Desktop) */}
                    <div className="hidden md:flex justify-center items-center">
                      <SparkLine 
                        data={coin.sparkline} 
                        color={coin.change >= 0 ? '#10b981' : '#f43f5e'} 
                        width={100} 
                        height={32} 
                      />
                    </div>

                    {/* Action (Desktop) */}
                    <div className="hidden md:flex justify-end">
                      <Button variant="outline" size="sm" className="!px-3 !py-1.5 text-xs opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                        Trade
                      </Button>
                    </div>

                    {/* Mobile Detail Indicator */}
                    <div className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <ChevronRight size={18} />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-16 h-16 bg-surface-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <Search size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">No results found</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                    We couldn't find any assets matching "{search}". Try searching for something else.
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-4" 
                    onClick={() => { setSearch(''); setActiveTab('all'); }}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

