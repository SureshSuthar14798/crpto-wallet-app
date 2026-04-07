import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, Shield, ChevronRight, User, Settings, Bell, ShieldCheck, Globe } from 'lucide-react';
import Card from '../components/common/Card';
import { userProfile } from '../data/mockData';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 200 }
  }
};

export default function ProfilePage() {
  const accountInfo = [
    { icon: Mail, label: 'Email', value: userProfile.email },
    { icon: Phone, label: 'Phone', value: userProfile.phone },
    { icon: Calendar, label: 'Member Since', value: userProfile.joinDate },
  ];

  const preferences = [
    { icon: Globe, label: 'Language', value: userProfile.language },
    { icon: Bell, label: 'Notifications', value: userProfile.notificationsEnabled ? 'Enabled' : 'Disabled' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-10"
    >
      {/* Profile Header */}
      <motion.div variants={itemVariants} className="flex flex-col items-center pt-2 pb-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-3xl gradient-primary flex items-center justify-center text-white text-4xl font-bold shadow-2xl relative overflow-hidden group">
            {userProfile.name.charAt(0)}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <User size={32} />
            </div>
          </div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-white dark:border-dark-300 rounded-full flex items-center justify-center"
          >
            <ShieldCheck size={14} className="text-white" />
          </motion.div>
        </div>
        <h2 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{userProfile.name}</h2>
        <div className="mt-1 flex items-center gap-2">
          <span className="badge-success text-[10px] uppercase tracking-wider font-bold">{userProfile.kycStatus}</span>
          <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Personal Account</p>
        </div>
      </motion.div>

      {/* Account Details */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Account Information</h3>
        <Card variant="solid" padding="none">
          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            {accountInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-50 dark:hover:bg-dark-50/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-dark-100 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Preferences</h3>
        <Card variant="solid" padding="none">
          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            {preferences.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-50 dark:hover:bg-dark-50/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-dark-100 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
