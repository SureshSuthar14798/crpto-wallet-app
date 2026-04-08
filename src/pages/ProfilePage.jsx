import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, Calendar, Shield, ChevronRight, User, 
  Settings, Bell, ShieldCheck, Globe, Star, Zap,
  Camera, Edit3, CheckCircle2, Crown, 
  Lock, ArrowRight, Share2, LogOut, Info
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { userProfile } from '../data/mockData';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 200 }
  }
};

export default function ProfilePage() {
  const { logout } = useAuth();
  const [showEdit, setShowEdit] = useState(false);

  const accountInfo = [
    { icon: Mail, label: 'Email Address', value: userProfile.email, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Phone, label: 'Phone Number', value: userProfile.phone, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { icon: Calendar, label: 'Joined Date', value: userProfile.joinDate, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  const badges = [
    { name: 'Early Adopter', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Verified', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Top Tier', icon: Crown, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-3xl mx-auto space-y-8 pb-16"
    >
      {/* ===== PREMIUM HEADER ===== */}
      <motion.div variants={itemVariants} className="relative pt-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary-500/20 blur-[60px] rounded-full -z-10" />
        
        <div className="flex flex-col items-center">
           {/* Avatar with Ring */}
           <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-primary-500 via-violet-500 to-fuchsia-500 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative w-32 h-32 rounded-[36px] bg-white dark:bg-dark-200 p-1.5 shadow-2xl">
                 <div className="w-full h-full rounded-[30px] gradient-primary flex items-center justify-center text-white text-5xl font-black relative overflow-hidden">
                    {userProfile.name.charAt(0)}
                    {/* Hover Camera Icon */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                       <Camera size={28} className="text-white" />
                    </div>
                 </div>
              </div>
              {/* Verified Badge Overlay */}
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 border-4 border-white dark:border-dark-300 rounded-2xl flex items-center justify-center shadow-lg">
                 <ShieldCheck size={20} className="text-white" />
              </div>
           </div>

           <div className="mt-6 text-center">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{userProfile.name}</h2>
              <div className="mt-2 flex items-center justify-center gap-3">
                 <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-500/20">Verified User</span>
                 <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{userProfile.kycStatus} Tier</p>
              </div>
           </div>

           <div className="flex gap-3 mt-8">
              <Button variant="secondary" size="md" icon={Edit3} onClick={() => setShowEdit(true)}>Edit Profile</Button>
              <Button variant="secondary" size="md" icon={Share2}>Share Code</Button>
           </div>
        </div>
      </motion.div>

      {/* ===== BADGES / ACHIEVEMENTS ===== */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
         {badges.map((badge) => (
           <Card key={badge.name} variant="solid" padding="sm" className="flex flex-col items-center text-center gap-2 group">
              <div className={`w-10 h-10 rounded-xl ${badge.bg} ${badge.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                 <badge.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{badge.name}</span>
           </Card>
         ))}
      </motion.div>

      {/* ===== DATA SECTIONS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
         {/* Account Info */}
         <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Account Info</h3>
            <Card variant="solid" padding="none">
               <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
                  {accountInfo.map((item) => (
                     <div key={item.label} className="p-5 flex items-center gap-4 group cursor-pointer hover:bg-surface-50 dark:hover:bg-dark-50/50 transition-colors">
                        <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                           <item.icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{item.label}</p>
                           <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.value}</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                     </div>
                  ))}
               </div>
            </Card>
         </motion.div>

         {/* Preferences & Misc */}
         <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Quick Settings</h3>
            <Card variant="solid" padding="none">
               <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
                  <div className="p-5 flex items-center gap-4 group cursor-pointer hover:bg-surface-50 dark:hover:bg-dark-50/50 transition-colors">
                     <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center shrink-0">
                        <Globe size={18} />
                     </div>
                     <div className="flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Language</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{userProfile.language}</p>
                     </div>
                     <ChevronRight size={16} className="text-gray-300" />
                  </div>
                  <div className="p-5 flex items-center gap-4 group cursor-pointer hover:bg-surface-50 dark:hover:bg-dark-50/50 transition-colors">
                     <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                        <Bell size={18} />
                     </div>
                     <div className="flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Notifications</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Push & Local Enabled</p>
                     </div>
                     <ChevronRight size={16} className="text-gray-300" />
                  </div>
               </div>
            </Card>
             <div className="px-1">
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                   <LogOut size={16} /> Logout from Secure Session
                </button>
             </div>
         </motion.div>

      </div>

      {/* ===== EDIT PROFILE MODAL ===== */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Personal Settings">
         <div className="space-y-6 pt-2">
            <div className="flex flex-col items-center pb-2">
               <div className="relative group cursor-pointer">
                  <div className="w-20 h-20 rounded-[28px] gradient-primary flex items-center justify-center text-white text-3xl font-black">
                     {userProfile.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-dark-100 rounded-xl shadow-md flex items-center justify-center border border-surface-200 dark:border-white/10">
                     <Camera size={14} className="text-primary-500" />
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Display Name</label>
                  <input type="text" defaultValue={userProfile.name} className="w-full bg-surface-50 dark:bg-dark-50 border border-surface-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
               </div>
               <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                  <input type="email" defaultValue={userProfile.email} className="w-full bg-surface-50 dark:bg-dark-50 border border-surface-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
               </div>
            </div>

            <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10 flex gap-4">
               <Info size={20} className="text-amber-500 shrink-0 mt-0.5" />
               <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                  Changing your display name will update how you appear in transaction receipts and the address book.
               </p>
            </div>

            <Button fullWidth size="lg" className="h-14 rounded-[22px]" onClick={() => setShowEdit(false)}>
               Apply Changes
            </Button>
         </div>
      </Modal>

    </motion.div>
  );
}
