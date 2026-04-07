import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Key, Smartphone, Lock, Fingerprint, ChevronRight, 
  ToggleLeft, ToggleRight, AlertTriangle, Monitor, Tablet,
  ShieldCheck, ShieldAlert, History, MapPin, X, 
  RefreshCw, CheckCircle2, MoreVertical,
  Info
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { userProfile } from '../data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
};

export default function SecurityPage() {
  const [twoFA, setTwoFA] = useState(userProfile.twoFactorEnabled);
  const [bio, setBio] = useState(userProfile.biometricEnabled);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');

  const deviceIcons = { 'iPhone': Smartphone, 'MacBook': Monitor, 'iPad': Tablet };

  const securityEvents = [
    { type: 'login', device: 'iPhone 15 Pro', date: 'Just now', location: 'Seoul, KR', status: 'success' },
    { type: 'security', device: 'System', date: '2 days ago', location: 'Remote', status: 'warning', label: 'PIN Updated' },
    { type: 'login', device: 'Chrome / MacBook', date: 'Apr 03, 11:24', location: 'Tokyo, JP', status: 'success' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-2xl mx-auto pb-12">
      
      {/* ===== SECURITY STATUS HERO ===== */}
      <motion.div variants={item}>
        <div className="relative group">
          {/* Background Flare */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[32px] blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
          
          <Card variant="solid" padding="none" className="overflow-hidden border-none shadow-2xl">
            <div className="relative p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-8 bg-white dark:bg-dark-200">
               {/* Large Circular Score */}
               <div className="relative shrink-0">
                  <svg width="120" height="120" className="rotate-[-90deg]">
                     <circle cx="60" cy="60" r="54" className="stroke-surface-100 dark:stroke-white/5 fill-none" strokeWidth="12" />
                     <motion.circle 
                        cx="60" cy="60" r="54" 
                        className="stroke-emerald-500 fill-none" 
                        strokeWidth="12" 
                        strokeDasharray="339.29"
                        initial={{ strokeDashoffset: 339.29 }}
                        animate={{ strokeDashoffset: 339.29 - (339.29 * 0.92) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                     />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-2xl font-black text-gray-900 dark:text-white leading-none">92</span>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Safety</span>
                  </div>
               </div>

               <div className="flex-1 text-center sm:text-left space-y-4">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Your Assets are Secure</h2>
                    <p className="text-xs text-gray-500 mt-1">Excellent protection level. Your wallet is fortified with institutional-grade encryption.</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                     <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500"><ShieldCheck size={14} /> 2FA Active</span>
                     <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500"><ShieldCheck size={14} /> Biometrics On</span>
                     <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500"><ShieldCheck size={14} /> Encrypted Keys</span>
                  </div>
               </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* ===== CORE PROTECTION SETTINGS ===== */}
      <motion.div variants={item} className="space-y-4">
         <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Protection Layer</h3>
         <Card variant="solid" padding="none">
            <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
               {/* 2nd Factor Auth */}
               <div className="flex items-center gap-4 px-6 py-5 group">
                  <div className="w-12 h-12 rounded-[18px] bg-violet-500/10 flex items-center justify-center text-violet-500 transition-transform group-hover:scale-105">
                     <Lock size={22} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1.5">Two-Factor Authentication</p>
                     <p className="text-xs text-gray-400 font-medium">Require code for sign-ins and large sends</p>
                  </div>
                  <button onClick={() => setTwoFA(!twoFA)} className="relative h-6 w-11 shrink-0 rounded-full bg-surface-200 dark:bg-dark-100 transition-colors duration-200 focus:outline-none">
                     <div className={`absolute top-1 left-1 h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${twoFA ? 'translate-x-5 bg-primary-500' : ''}`} style={{ backgroundColor: twoFA ? '#6366f1' : 'white' }} />
                  </button>
               </div>

               {/* Biometric Toggle */}
               <div className="flex items-center gap-4 px-6 py-5 group">
                  <div className="w-12 h-12 rounded-[18px] bg-emerald-500/10 flex items-center justify-center text-emerald-500 transition-transform group-hover:scale-105">
                     <Fingerprint size={22} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1.5">Biometric Login</p>
                     <p className="text-xs text-gray-400 font-medium">Use Face ID or Touch ID for quick access</p>
                  </div>
                  <button onClick={() => setBio(!bio)} className="relative h-6 w-11 shrink-0 rounded-full bg-surface-200 dark:bg-dark-100 transition-colors duration-200 focus:outline-none">
                     <div className={`absolute top-1 left-1 h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${bio ? 'translate-x-5 bg-emerald-500' : ''}`} style={{ backgroundColor: bio ? '#10b981' : 'white' }} />
                  </button>
               </div>

               {/* Change PIN Action */}
               <button onClick={() => setShowPinModal(true)} className="w-full flex items-center gap-4 px-6 py-5 hover:bg-surface-50 dark:hover:bg-dark-50/40 transition-all group">
                  <div className="w-12 h-12 rounded-[18px] bg-sky-500/10 flex items-center justify-center text-sky-500 transition-transform group-hover:scale-105">
                     <Key size={22} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                     <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1.5">Security PIN</p>
                     <p className="text-xs text-gray-400 font-medium">Change your 6-digit transaction PIN</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
         </Card>
      </motion.div>

      {/* ===== RECENT PROTECTION LOGS ===== */}
      <motion.div variants={item} className="space-y-4">
         <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
               <History size={16} /> Security Logs
            </h3>
            <button className="text-[11px] font-bold text-gray-400 flex items-center gap-1 hover:text-primary-500"><RefreshCw size={12} /> Refresh</button>
         </div>
         <Card variant="solid" padding="none">
            <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
               {securityEvents.map((evt, idx) => (
                  <div key={idx} className="flex items-center gap-4 px-6 py-4">
                     <div className={`w-2 h-2 rounded-full ${evt.status === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                           <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{evt.label || 'Authorized Login'}</p>
                           <span className="text-[10px] font-bold text-gray-400 bg-surface-100 dark:bg-dark-100 px-1.5 py-0.5 rounded leading-tight">{evt.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-medium text-gray-500">
                           <span className="flex items-center gap-1"><Smartphone size={12} /> {evt.device}</span>
                           <span className="flex items-center gap-1"><MapPin size={12} /> {evt.location}</span>
                        </div>
                     </div>
                     <CheckCircle2 size={16} className={evt.status === 'success' ? 'text-emerald-500/50' : 'text-amber-500/50'} />
                  </div>
               ))}
            </div>
         </Card>
      </motion.div>

      {/* ===== ACTIVE DEVICE SESSIONS ===== */}
      <motion.div variants={item} className="space-y-4">
         <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Trusted Devices</h3>
            <span className="text-[10px] font-bold text-gray-400">2 Devices active</span>
         </div>
         <Card variant="solid" padding="none">
            <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
               {userProfile.devices.map((device) => {
                  const DevIcon = Object.entries(deviceIcons).find(([k]) => device.name.includes(k))?.[1] || Smartphone;
                  return (
                     <div key={device.id} className="flex items-center gap-4 px-6 py-5 group">
                        <div className="w-12 h-12 rounded-[20px] bg-surface-50 dark:bg-dark-50/50 flex items-center justify-center text-gray-400 transition-colors group-hover:bg-primary-500/10 group-hover:text-primary-500">
                           <DevIcon size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{device.name}</p>
                              {device.current && <span className="text-[9px] font-black text-primary-500 uppercase tracking-widest border border-primary-500/30 px-1.5 py-0.5 rounded">Current</span>}
                           </div>
                           <p className="text-xs text-gray-400 font-medium">Last active: {device.lastActive}</p>
                        </div>
                        {!device.current && (
                           <button className="text-[11px] font-bold text-red-500 hover:text-red-600 transition-colors bg-red-500/5 px-3 py-1.5 rounded-lg border border-red-500/10">Revoke</button>
                        )}
                        <button className="text-gray-400 hover:text-gray-900"><MoreVertical size={18} /></button>
                     </div>
                  );
               })}
            </div>
         </Card>
      </motion.div>

      {/* ===== PIN MODAL REBUILD ===== */}
      <Modal isOpen={showPinModal} onClose={() => setShowPinModal(false)} title="Update Security PIN">
         <div className="space-y-6 pt-2">
            <div className="bg-primary-500/5 p-5 rounded-[24px] border border-primary-500/10 flex gap-4">
               <Info size={24} className="text-primary-500 shrink-0" />
               <p className="text-xs text-primary-700 dark:text-primary-400 font-medium leading-relaxed">
                  Your PIN is required to confirm every transaction. Use a code that is difficult to guess but easy for you to remember.
               </p>
            </div>
            
            <div className="space-y-4">
               <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Confirm Identity</label>
                  <input type="password" placeholder="Current PIN (••••)" className="w-full bg-surface-50 dark:bg-dark-50 border border-surface-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">New PIN</label>
                    <input type="password" placeholder="••••" className="w-full bg-surface-50 dark:bg-dark-50 border border-surface-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Repeat</label>
                    <input type="password" placeholder="••••" className="w-full bg-surface-50 dark:bg-dark-50 border border-surface-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                  </div>
               </div>
            </div>

            <Button fullWidth size="lg" className="h-14 rounded-[20px]" onClick={() => setShowPinModal(false)}>
               Encrypt and Save
            </Button>
         </div>
      </Modal>

    </motion.div>
  );
}
