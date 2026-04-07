import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Bottom-sheet on mobile, centered modal on desktop
 * With proper safe-area and touch handling
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`relative w-full ${sizes[size]} bg-white dark:bg-dark-200 rounded-t-3xl md:rounded-2xl shadow-2xl z-10 max-h-[80vh] md:max-h-[85vh] overflow-hidden flex flex-col`}
          >
            {/* Mobile drag indicator */}
            <div className="flex justify-center pt-2 md:hidden">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>

            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between px-5 sm:px-6 pt-4 sm:pt-6 pb-1 sm:pb-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-2 -mr-2 rounded-xl hover:bg-surface-100 dark:hover:bg-dark-50 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}
            {/* Content */}
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 overflow-y-auto" style={{ paddingBottom: `max(1.25rem, env(safe-area-inset-bottom, 1.25rem))` }}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
