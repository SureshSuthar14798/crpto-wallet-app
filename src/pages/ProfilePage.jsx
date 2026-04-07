import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Shield, ChevronRight } from 'lucide-react';
import Card from '../components/common/Card';
import { userProfile } from '../data/mockData';

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function ProfilePage() {
  const fields = [
    { icon: Mail, label: 'Email', value: userProfile.email },
    { icon: Phone, label: 'Phone', value: userProfile.phone },
    { icon: Calendar, label: 'Member Since', value: userProfile.joinDate },
    { icon: Shield, label: 'KYC Status', value: userProfile.kycStatus, badge: true },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }} className="space-y-5">
      {/* Avatar */}
      <motion.div variants={item} className="flex flex-col items-center py-6">
        <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-glow-lg mb-4">
          {userProfile.name.charAt(0)}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{userProfile.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{userProfile.email}</p>
      </motion.div>

      {/* Info */}
      <motion.div variants={item}>
        <Card variant="solid" padding="none">
          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            {fields.map(({ icon: Icon, label, value, badge }) => (
              <div key={label} className="flex items-center gap-3 px-5 py-3.5">
                <Icon size={18} className="text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400">{label}</p>
                  {badge ? (
                    <span className="badge-success text-xs capitalize">{value}</span>
                  ) : (
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
