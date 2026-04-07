import { motion } from 'framer-motion';

/**
 * Glass-morphism card with Korean minimal aesthetics
 * Mobile-optimized with tighter paddings
 */
export default function Card({
  children,
  variant = 'glass',
  padding = 'md',
  hover = true,
  className = '',
  animate = true,
  onClick,
  ...props
}) {
  const variants = {
    glass: 'bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-white/20 dark:border-white/[0.08]',
    solid: 'bg-white dark:bg-dark-50 border border-surface-200/50 dark:border-white/5',
    gradient: 'bg-gradient-to-br from-primary-500/10 via-primary-600/5 to-transparent dark:from-primary-500/10 dark:via-primary-600/5 backdrop-blur-xl border border-primary-200/30 dark:border-primary-500/10',
    flat: 'bg-surface-100/80 dark:bg-dark-50/80',
  };

  // Mobile-first paddings: smaller on mobile, original on md+
  const paddings = {
    none: '',
    sm: 'p-2.5 sm:p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-4 sm:p-6',
    xl: 'p-5 sm:p-8',
  };

  const Comp = animate ? motion.div : 'div';
  const animProps = animate ? {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  } : {};

  return (
    <Comp
      className={`rounded-2xl shadow-glass transition-all duration-300 ${variants[variant]} ${paddings[padding]} ${hover ? 'hover:shadow-glass-lg' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...animProps}
      {...props}
    >
      {children}
    </Comp>
  );
}
