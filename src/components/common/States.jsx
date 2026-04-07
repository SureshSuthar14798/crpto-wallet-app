import { motion } from 'framer-motion';
import { Inbox, WifiOff, AlertTriangle } from 'lucide-react';
import Button from './Button';

/**
 * Empty state illustration
 */
export function EmptyState({ icon: Icon = Inbox, title, message, action, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-surface-100 dark:bg-dark-50 flex items-center justify-center mb-5">
        <Icon size={32} className="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{message}</p>
      {action && (
        <Button variant="primary" size="sm" className="mt-6" onClick={onAction}>
          {action}
        </Button>
      )}
    </motion.div>
  );
}

/**
 * Error state
 */
export function ErrorState({ title = 'Something went wrong', message = 'Please try again later.', onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-5">
        <AlertTriangle size={32} className="text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" className="mt-6" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </motion.div>
  );
}

/**
 * Offline state
 */
export function OfflineState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center mb-5">
        <WifiOff size={32} className="text-yellow-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">No Connection</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
        Please check your internet connection and try again.
      </p>
    </motion.div>
  );
}
