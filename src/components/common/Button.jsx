import { motion } from 'framer-motion';

/**
 * Reusable Button component with Korean minimal style
 * Variants: primary, secondary, ghost, danger
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary-500/30',
    secondary: 'bg-surface-100 dark:bg-dark-50 hover:bg-surface-200 dark:hover:bg-dark-100 text-gray-700 dark:text-gray-300 border border-surface-300/50 dark:border-white/10',
    ghost: 'hover:bg-surface-100 dark:hover:bg-dark-50 text-gray-600 dark:text-gray-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-sm rounded-xl gap-1.5',
    md: 'px-5 py-3 text-sm rounded-2xl gap-2',
    lg: 'px-7 py-3.5 text-base rounded-2xl gap-2.5',
    xl: 'px-8 py-4 text-lg rounded-2xl gap-3',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 16 : 18} />}
          {children}
          {IconRight && <IconRight size={size === 'sm' ? 16 : 18} />}
        </>
      )}
    </motion.button>
  );
}
