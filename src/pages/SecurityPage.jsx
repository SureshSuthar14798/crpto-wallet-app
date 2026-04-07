import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Smartphone, Lock, Fingerprint, ChevronRight, ToggleLeft, ToggleRight, AlertTriangle, Monitor, Tablet } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { userProfile } from '../data/mockData';

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function SecurityPage() {
  const [twoFA, setTwoFA] = useState(userProfile.twoFactorEnabled);
  const [bio, setBio] = useState(userProfile.biometricEnabled);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');

  const deviceIcons = { 'iPhone': Smartphone, 'MacBook': Monitor, 'iPad': Tablet };

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }} className="space-y-4 sm:space-y-5">
      {/* Security Score */}
      <motion.div variants={item}>
        <Card variant="gradient" padding="lg" hover={false}>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <Shield size={24} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Security Score</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">92 / 100</p>
              <p className="text-xs text-emerald-500 font-medium">Excellent</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Settings Items */}
      <motion.div variants={item}>
        <Card variant="solid" padding="none">
          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            {/* Change PIN */}
            <button onClick={() => setShowPinModal(true)} className="w-full flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3.5 sm:py-4 hover:bg-surface-50 dark:hover:bg-dark-50/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Key size={18} className="text-blue-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Change PIN</p>
                <p className="text-xs text-gray-400">Update your security PIN</p>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            {/* 2FA Toggle */}
            <div className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3.5 sm:py-4">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
                <Lock size={18} className="text-violet-500" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] sm:text-sm font-semibold text-gray-900 dark:text-white">Two-Factor Auth</p>
                <p className="text-xs text-gray-400">Extra layer of security</p>
              </div>
              <button onClick={() => setTwoFA(!twoFA)}>
                {twoFA ? <ToggleRight size={32} className="text-primary-500" /> : <ToggleLeft size={32} className="text-gray-300 dark:text-gray-600" />}
              </button>
            </div>

            {/* Biometric */}
            <div className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3.5 sm:py-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                <Fingerprint size={18} className="text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Biometric Login</p>
                <p className="text-xs text-gray-400">Fingerprint or Face ID</p>
              </div>
              <button onClick={() => setBio(!bio)}>
                {bio ? <ToggleRight size={32} className="text-primary-500" /> : <ToggleLeft size={32} className="text-gray-300 dark:text-gray-600" />}
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Devices */}
      <motion.div variants={item}>
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Active Devices</h3>
        <Card variant="solid" padding="none">
          <div className="divide-y divide-surface-200/50 dark:divide-white/[0.04]">
            {userProfile.devices.map((device) => {
              const DevIcon = Object.entries(deviceIcons).find(([k]) => device.name.includes(k))?.[1] || Smartphone;
              return (
                <div key={device.id} className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3 sm:py-3.5">
                  <DevIcon size={18} className="text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{device.name}</p>
                    <p className="text-xs text-gray-400">{device.lastActive}</p>
                  </div>
                  {device.current ? (
                    <span className="badge-success text-[10px]">Current</span>
                  ) : (
                    <Button variant="ghost" size="sm">Remove</Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* PIN Modal */}
      <Modal isOpen={showPinModal} onClose={() => setShowPinModal(false)} title="Change PIN">
        <div className="space-y-4">
          <Input label="Current PIN" type="password" placeholder="••••" value={pin} onChange={(e) => setPin(e.target.value)} />
          <Input label="New PIN" type="password" placeholder="••••" />
          <Input label="Confirm PIN" type="password" placeholder="••••" />
          <Button fullWidth onClick={() => setShowPinModal(false)}>Update PIN</Button>
        </div>
      </Modal>
    </motion.div>
  );
}
