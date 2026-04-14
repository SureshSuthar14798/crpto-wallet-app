import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, ArrowRight, Wallet, Shield, Mail, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useToast } from '../components/common/Toast';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Register() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Dummy registration
    setTimeout(() => {
      setLoading(false);
      addToast({
        type: 'success',
        title: 'Registration Successful',
        message: 'Welcome to CryptoVault! Please log in.',
        duration: 4000,
      });
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-surface-50 dark:bg-dark-300">
      {/* Abstract Background Elements (Premium Style) */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-primary-500/20 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none opacity-50"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-accent-lavender/20 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-500/5 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card backdrop-blur-3xl border border-white/20 dark:border-white/5 p-6 sm:p-10 rounded-[40px] shadow-2xl overflow-hidden">
          {/* Logo Section - Compact but Premium */}
          <motion.div variants={item} className="text-center mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 gradient-primary rounded-[20px] shadow-xl shadow-primary-500/20 flex items-center justify-center mx-auto mb-3 animate-float">
               <Wallet className="text-white" size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">Create Account</h1>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1">Join the future of finance</p>
          </motion.div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block px-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
              <Input 
                type="email" 
                placeholder="email@example.com" 
                className="!py-3 !rounded-[18px] text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block px-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nickname</label>
                <Input 
                  type="text" 
                  placeholder="CryptoUser" 
                  className="!py-3 !rounded-[18px] text-sm"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-1">
                <label className="block px-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</label>
                <Input 
                  type="tel" 
                  placeholder="+1..." 
                  className="!py-3 !rounded-[18px] text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block px-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
              <div className="relative group">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••" 
                  className="!py-3 !rounded-[18px] text-sm pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <Button type="submit" loading={loading} fullWidth className="!py-4 !rounded-[20px] text-xs font-black uppercase tracking-[2px] shadow-lg shadow-primary-500/20 mt-4 active:scale-95 transition-all">
              Create Account
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Already member? {' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-black outline-none">Login here</Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-6 text-[10px] font-bold text-gray-400/50 uppercase tracking-widest">
            Secure Protocol • End-to-End Encryption
        </p>
      </motion.div>
    </div>
  );
}
