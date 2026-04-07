import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, ArrowRight, Wallet, Shield } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Login() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      login(id, password);
      addToast({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome back to CryptoVault!',
        duration: 4000,
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Login Failed',
        message: err.message,
        duration: 4000,
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-surface-50 via-primary-50/30 to-accent-lavender/20 dark:from-dark-300 dark:via-primary-900/20 dark:to-accent-lavender/10 px-4 py-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary-500/10 rounded-full blur-[80px] sm:blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-accent-lavender/10 rounded-full blur-[80px] sm:blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-500/5 to-transparent rounded-full blur-[120px]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={item} className="text-center mb-8 sm:mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow animate-float">
            <Wallet size={28} className="text-white sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">CryptoVault</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Secure your crypto assets</p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          variants={item}
          onSubmit={handleSubmit}
          className="glass-card p-6 sm:p-8 space-y-5 sm:space-y-6"
        >
          <div className="text-center mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter your credentials to access your wallet</p>
          </div>

          {/* ID Input */}
          <Input
            label="User ID"
            type="text"
            placeholder="Enter your user ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            icon={User}
            required
            className="text-base"
          />

          {/* Password Input */}
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
              className="text-base pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button fullWidth loading={loading} type="submit" size="lg">
            Sign In
            <ArrowRight size={18} className="ml-2" />
          </Button>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-4">
            <Shield size={14} />
            <span>Secure login with end-to-end encryption</span>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
