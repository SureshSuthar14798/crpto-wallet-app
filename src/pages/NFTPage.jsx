import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Card from '../components/common/Card';
import Tabs from '../components/common/Tabs';
import { nftCollection } from '../data/mockData';

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function NFTPage() {
  const [tab, setTab] = useState('owned');
  const tabs = [
    { id: 'owned', label: 'Owned' },
    { id: 'activity', label: 'Activity' },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }} className="space-y-4 sm:space-y-5">
      <motion.div variants={item}>
        <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      </motion.div>

      <motion.div variants={item}>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {nftCollection.map((nft, i) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card variant="solid" padding="none" className="overflow-hidden">
                <div className="aspect-square bg-surface-200 dark:bg-dark-50 relative group">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <button className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white">
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-2.5 sm:p-3">
                  <p className="text-[11px] text-gray-400 truncate">{nft.collection}</p>
                  <p className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white truncate">{nft.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-[10px] text-gray-400">Floor</p>
                      <p className="text-[13px] sm:text-sm font-bold text-gray-900 dark:text-white">{nft.price} ETH</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">Last Sale</p>
                      <p className="text-[13px] sm:text-sm font-medium text-gray-600 dark:text-gray-400">{nft.lastSale} ETH</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
