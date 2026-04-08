import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Clean tab switcher with sliding indicator
 */
export default function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={`flex items-center gap-1 bg-surface-100/80 dark:bg-dark-50/80 rounded-2xl p-1.5 overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative min-w-fit px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 whitespace-nowrap overflow-hidden ${
              isActive
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-white/5'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 bg-white dark:bg-dark-100 rounded-xl shadow-soft border border-surface-200/50 dark:border-white/5"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
