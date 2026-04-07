import { motion } from 'framer-motion';
import { Send, ArrowDownLeft, Bell, Shield, Gift, Check } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useWallet } from '../context/WalletContext';

const iconMap = { send: Send, receive: ArrowDownLeft, alert: Bell, security: Shield, promo: Gift };
const colorMap = {
  transaction: 'bg-blue-100 dark:bg-blue-900/20 text-blue-500',
  receive: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-500',
  price_alert: 'bg-amber-100 dark:bg-amber-900/20 text-amber-500',
  security: 'bg-red-100 dark:bg-red-900/20 text-red-500',
  promo: 'bg-violet-100 dark:bg-violet-900/20 text-violet-500',
};

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function NotificationsPage() {
  const { notifications, markNotifRead, markAllNotifsRead, unreadCount } = useWallet();

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } }} className="space-y-4 sm:space-y-5">
      {unreadCount > 0 && (
        <motion.div variants={item} className="flex justify-end">
          <Button variant="ghost" size="sm" icon={Check} onClick={markAllNotifsRead}>
            Mark all read
          </Button>
        </motion.div>
      )}

      <motion.div variants={item}>
        <Card variant="solid" padding="none">
          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            {notifications.map((notif, i) => {
              const Icon = iconMap[notif.icon] || Bell;
              const color = colorMap[notif.type] || colorMap.promo;
              return (
                <motion.button
                  key={notif.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => markNotifRead(notif.id)}
                  className={`w-full flex items-start gap-2.5 sm:gap-3 px-4 sm:px-5 py-3.5 sm:py-4 text-left transition-colors hover:bg-surface-50 dark:hover:bg-dark-50/40 ${!notif.read ? 'bg-primary-50/30 dark:bg-primary-500/[0.03]' : ''}`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white">{notif.title}</p>
                      {!notif.read && <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{notif.time}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
