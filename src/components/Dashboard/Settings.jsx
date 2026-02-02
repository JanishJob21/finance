import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Wallet, ChevronRight, Check, Camera, RefreshCcw } from 'lucide-react';
import '../../styles/glass.css';
import { motion, AnimatePresence } from 'framer-motion';
import { updateProfile } from '../../api';

const Settings = ({ user, setUser }) => {
    const [activeSection, setActiveSection] = useState(0);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    // Form state for Profile Settings
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.role || 'Super Admin',
        avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Admin'}`
    });

    // Preferences state for Notifications & Security
    const [preferences, setPreferences] = useState({
        emailAlerts: false,
        pushNotifications: true,
        twoFactor: false,
        currency: 'INR (₹)'
    });

    const fileInputRef = React.useRef(null);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 400;
                    const MAX_HEIGHT = 400;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    setProfileData(prev => ({ ...prev, avatar: compressedBase64 }));
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const togglePreference = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const { data } = await updateProfile({
                email: user.email,
                name: profileData.name,
                phone: profileData.phone,
                avatar: profileData.avatar
            });
            setUser(data);
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
            setSaving(false);
        }
    };

    const sections = [
        {
            id: 'profile',
            title: 'Profile Settings',
            icon: User,
            desc: 'Manage your personal identity'
        },
        {
            id: 'notifications',
            title: 'Notifications',
            icon: Bell,
            desc: 'Control your alert preferences'
        },
        {
            id: 'security',
            title: 'Security',
            icon: Shield,
            desc: 'Protect your account data'
        },
        {
            id: 'billing',
            title: 'Payment Methods',
            icon: Wallet,
            desc: 'Configure billing and currency'
        }
    ];

    return (
        <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">
            {/* Settings Sidebar */}
            <div className="w-full md:w-72 flex flex-col gap-2">
                {sections.map((section, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveSection(idx)}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all relative group overflow-hidden ${activeSection === idx
                            ? 'bg-gradient-to-r from-cyan-500/10 to-blue-600/10 text-cyan-500 border border-cyan-500/20 shadow-lg shadow-cyan-500/5'
                            : 'text-muted hover:bg-slate-200 dark:hover:bg-white/5 border border-transparent hover:border-slate-300 dark:hover:border-white/5'
                            }`}
                    >
                        {activeSection === idx && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute left-0 w-1.5 h-8 bg-cyan-500 rounded-r-full"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <div className={`p-2.5 rounded-xl transition-colors ${activeSection === idx ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'bg-slate-200 dark:bg-white/5 text-muted group-hover:text-main'}`}>
                            <section.icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-sm">{section.title}</div>
                            <div className="text-[10px] opacity-60 uppercase tracking-wider">{section.desc}</div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="glass p-8 min-h-full flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-500 border border-cyan-500/10">
                                    {React.createElement(sections[activeSection].icon, { className: "w-6 h-6" })}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-main tracking-tight">{sections[activeSection].title}</h2>
                                    <p className="text-sm text-muted">{sections[activeSection].desc}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="px-5 py-2.5 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-muted hover:text-main rounded-xl transition-all text-sm font-medium">Reset</button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className={`px-5 py-2.5 bg-gradient-to-r ${saved ? 'from-emerald-500 to-teal-600' : 'from-cyan-500 to-blue-600'} text-white rounded-xl shadow-lg transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-50 min-w-[100px] justify-center hover:scale-105 active:scale-95`}
                                >
                                    {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                    {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
                                </button>
                            </div>
                        </div>

                        {/* Profile Section */}
                        {sections[activeSection].id === 'profile' && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-6 p-6 bg-slate-100/30 dark:bg-emerald-500/5 border border-slate-200 dark:border-emerald-500/10 rounded-[2rem] group">
                                    <div className="relative">
                                        <img src={profileData.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover ring-4 ring-cyan-500/20 group-hover:ring-cyan-500/50 transition-all shadow-2xl" />
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 p-2 bg-cyan-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                                        >
                                            <Camera className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-main">{profileData.name}</h4>
                                        <p className="text-sm text-muted">{profileData.role}</p>
                                        <button
                                            onClick={() => setProfileData(prev => ({ ...prev, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}` }))}
                                            className="text-xs text-cyan-500 hover:text-blue-500 font-bold mt-2 uppercase tracking-widest transition-colors"
                                        >
                                            Rotate Avatar
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-main font-semibold outline-none focus:border-cyan-500/50 transition-all placeholder:text-muted/30"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-main font-semibold outline-none focus:border-cyan-500/50 transition-all placeholder:text-muted/30"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleProfileChange}
                                            className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-main font-semibold outline-none focus:border-cyan-500/50 transition-all placeholder:text-muted/30"
                                            placeholder="Enter your phone"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Designation / Role</label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={profileData.role}
                                            onChange={handleProfileChange}
                                            className="w-full bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-main font-semibold outline-none focus:border-cyan-500/50 transition-all placeholder:text-muted/30"
                                            placeholder="e.g. Super Admin"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Section */}
                        {sections[activeSection].id === 'notifications' && (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-100/30 dark:bg-white/5 hover:border-cyan-500/20 transition-all cursor-pointer group" onClick={() => togglePreference('emailAlerts')}>
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-main font-semibold group-hover:text-cyan-500 transition-colors">Email Alerts</h4>
                                        <p className="text-sm text-muted">Configure daily summary emails</p>
                                    </div>
                                    <div className={`w-14 h-7 rounded-full p-1 relative transition-all duration-300 flex items-center ${preferences.emailAlerts ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                        <div className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform duration-300 ${preferences.emailAlerts ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-100/30 dark:bg-white/5 hover:border-cyan-500/20 transition-all cursor-pointer group" onClick={() => togglePreference('pushNotifications')}>
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-main font-semibold group-hover:text-cyan-500 transition-colors">Push Notifications</h4>
                                        <p className="text-sm text-muted">Real-time alerts for transactions</p>
                                    </div>
                                    <div className={`w-14 h-7 rounded-full p-1 relative transition-all duration-300 flex items-center ${preferences.pushNotifications ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                        <div className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform duration-300 ${preferences.pushNotifications ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Section */}
                        {sections[activeSection].id === 'security' && (
                            <div className="flex flex-col gap-4">
                                <button className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-100/30 dark:bg-white/5 hover:border-cyan-500/20 transition-all group">
                                    <div className="flex flex-col gap-1 text-left">
                                        <h4 className="text-main font-semibold group-hover:text-cyan-500 transition-colors">Change Password</h4>
                                        <p className="text-sm text-muted">Update your login security credentials</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                                </button>
                                <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-100/30 dark:bg-white/5 hover:border-cyan-500/20 transition-all cursor-pointer group" onClick={() => togglePreference('twoFactor')}>
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-main font-semibold group-hover:text-cyan-500 transition-colors">Two-Factor Authentication</h4>
                                        <p className="text-sm text-muted">Enable 2FA for extra account security</p>
                                    </div>
                                    <div className={`w-14 h-7 rounded-full p-1 relative transition-all duration-300 flex items-center ${preferences.twoFactor ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                        <div className={`w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform duration-300 ${preferences.twoFactor ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Billing Section */}
                        {sections[activeSection].id === 'billing' && (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-100/30 dark:bg-white/5 hover:border-cyan-500/20 transition-all group">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-main font-semibold group-hover:text-cyan-500 transition-colors">Default Currency</h4>
                                        <p className="text-sm text-muted">Global currency display format</p>
                                    </div>
                                    <span className="px-4 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold font-mono tracking-tighter uppercase">
                                        INR (₹)
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Additional Info / Help box */}
                        <div className="mt-auto pt-8">
                            <AnimatePresence>
                                {saved && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" /> Changes saved successfully and applied globally.
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500 mt-1">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                    <h5 className="text-sm font-bold text-main">Privacy Note</h5>
                                    <p className="text-xs text-muted leading-relaxed mt-1">
                                        Changes to your sensitive account data are secure.
                                        Your configuration is saved to your local database for continuity across sessions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Settings;
