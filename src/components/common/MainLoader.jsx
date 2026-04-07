import { motion } from 'framer-motion';

export default function MainLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-dark-300"
    >
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-500/10 rounded-full blur-[80px]" />
      
      <div className="relative flex flex-col items-center">
        {/* Simple & Clean Spinner */}
        <div className="relative w-16 h-16">
          {/* Animated rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-surface-100 dark:border-white/5 border-t-primary-500"
          />
          
          {/* Static center logo/icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
