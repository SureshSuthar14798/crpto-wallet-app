import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[60] space-y-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-glass-lg backdrop-blur-xl border ${
                toast.type === 'success'
                  ? 'bg-emerald-50/90 dark:bg-emerald-900/30 border-emerald-200/50 dark:border-emerald-500/20'
                  : toast.type === 'error'
                  ? 'bg-red-50/90 dark:bg-red-900/30 border-red-200/50 dark:border-red-500/20'
                  : 'bg-blue-50/90 dark:bg-blue-900/30 border-blue-200/50 dark:border-blue-500/20'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : toast.type === 'error' ? (
                <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              ) : (
                <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
