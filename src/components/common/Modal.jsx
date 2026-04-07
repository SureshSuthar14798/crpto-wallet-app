import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * Premium Portal-based Modal
 * Covers the entire screen including headers, sidebars, and navigation.
 * Renders as a bottom-sheet on mobile and centered on desktop.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
}) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[calc(100vw-2rem)] md:max-w-2xl',
  };

  const modalRoot = document.getElementById('modal-root');

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-4 overflow-hidden pointer-events-none">
          {/* Enhanced Global Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-[5px] pointer-events-auto"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 150, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 150, scale: 0.98 }}
            transition={{ duration: 0.4, type: 'spring', damping: 28, stiffness: 220 }}
            className={`relative w-full ${sizes[size]} bg-white dark:bg-dark-200 rounded-t-[32px] md:rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] z-10 max-h-[85vh] flex flex-col border border-white/20 dark:border-white/5 pointer-events-auto`}
          >
            {/* Mobile drag indicator */}
            <div className="flex justify-center pt-3 md:hidden">
              <div className="w-12 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700/50" />
            </div>

            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between px-6 sm:px-8 pt-5 sm:pt-7 pb-2 sm:pb-3">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">{title}</h3>
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-2 -mr-2 rounded-2xl bg-surface-100 dark:bg-dark-100 hover:bg-surface-200 dark:hover:bg-dark-50 text-gray-500 dark:text-gray-400 transition-all duration-200"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}
            
            {/* Scrollable Content area */}
            <div className="px-6 sm:px-8 pb-8 pt-4 overflow-y-auto no-scrollbar relative" style={{ paddingBottom: `max(2rem, env(safe-area-inset-bottom, 2rem))` }}>
              <div className="relative z-10 text-gray-600 dark:text-gray-300">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    modalRoot || document.body
  );
}
