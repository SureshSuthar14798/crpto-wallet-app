import { forwardRef } from 'react';

/**
 * Clean Korean-style input field
 */
const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  iconRight: IconRight,
  onIconRightClick,
  className = '',
  containerClass = '',
  ...props
}, ref) => {
  return (
    <div className={`space-y-1.5 ${containerClass}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 pl-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3.5 bg-surface-100 dark:bg-dark-50 border border-surface-300/50 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all duration-200 text-sm ${Icon ? 'pl-11' : ''} ${IconRight ? 'pr-11' : ''} ${error ? 'border-red-400 dark:border-red-500/50 focus:ring-red-500/30 focus:border-red-500' : ''} ${className}`}
          {...props}
        />
        {IconRight && (
          <button
            type="button"
            onClick={onIconRightClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <IconRight size={18} />
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 pl-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
