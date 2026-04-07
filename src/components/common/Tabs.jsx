import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Clean tab switcher with sliding indicator
 */
export default function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={`flex bg-surface-100/80 dark:bg-dark-50/80 rounded-2xl p-1.5 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200 ${
            activeTab === tab.id
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white dark:bg-dark-100 rounded-xl shadow-soft"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
