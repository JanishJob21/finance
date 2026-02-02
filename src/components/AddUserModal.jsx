import React, { useState, useEffect, useRef } from 'react';
import { X, Check, User, Mail, Shield, Activity, ChevronDown, Plus } from 'lucide-react';
import '../styles/glass.css';
import { motion, AnimatePresence } from 'framer-motion';

const CustomDropdown = ({ label, options, value, onChange, icon: Icon, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-2 relative" ref={dropdownRef}>
            <label className="text-sm font-semibold text-slate-600 dark:text-muted/80 ml-1">{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full bg-slate-100 dark:bg-slate-900/40 border ${isOpen ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-slate-300 dark:border-white/10'} rounded-2xl py-3 px-4 cursor-pointer transition-all hover:bg-slate-200 dark:hover:bg-white/5 active:scale-[0.98] group`}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    {Icon && <Icon className={`w-4 h-4 shrink-0 ${isOpen ? 'text-cyan-500' : 'text-slate-400 dark:text-muted'} transition-colors group-hover:text-cyan-500`} />}
                    <span className={`text-slate-800 dark:text-main font-semibold truncate ${!value ? 'text-slate-400 dark:text-muted/50' : ''}`}>
                        {value || placeholder}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-muted shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-500' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[110] w-full mt-2 py-2 bg-white dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {options.map((option) => (
                            <div
                                key={option}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-2.5 hover:bg-cyan-500/10 cursor-pointer transition-colors flex items-center justify-between group ${value === option ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-700 dark:text-main font-medium'}`}
                            >
                                <span className="truncate">{option}</span>
                                {value === option && <Check className="w-4 h-4 shrink-0" />}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AddUserModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Standard',
        status: 'Active'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        onClose();
        setFormData({
            name: '',
            email: '',
            role: 'Standard',
            status: 'Active'
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md cursor-pointer"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white dark:bg-slate-950/40 dark:glass w-full max-w-lg relative z-10 border border-slate-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col rounded-[2.5rem] overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-8 pb-4 flex justify-between items-center relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
                        <div>
                            <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 bg-clip-text text-transparent tracking-tight">
                                New User
                            </h2>
                            <p className="text-slate-500 dark:text-muted/60 text-sm mt-1 flex items-center gap-1.5 font-medium">
                                <Plus className="w-3 h-3 text-cyan-500" /> Register a new user
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 rounded-2xl transition-all duration-300 text-slate-500 dark:text-muted hover:text-slate-800 dark:hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600 dark:text-muted/80 ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="w-4 h-4 text-slate-400 dark:text-muted/40" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-100 dark:bg-slate-900/40 border border-slate-300 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-cyan-500/50 text-slate-800 dark:text-main font-semibold transition-all placeholder:text-slate-400 dark:placeholder:text-muted/30"
                                        placeholder="Enter Full Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600 dark:text-muted/80 ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-4 h-4 text-slate-400 dark:text-muted/40" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-100 dark:bg-slate-900/40 border border-slate-300 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-cyan-500/50 text-slate-800 dark:text-main font-semibold transition-all placeholder:text-slate-400 dark:placeholder:text-muted/30"
                                        placeholder="user@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <CustomDropdown
                                    label="Role"
                                    icon={Shield}
                                    options={['Standard', 'Admin', 'Editor', 'Viewer']}
                                    value={formData.role}
                                    onChange={(val) => setFormData({ ...formData, role: val })}
                                />
                                <CustomDropdown
                                    label="Status"
                                    icon={Activity}
                                    options={['Active', 'Inactive', 'Pending']}
                                    value={formData.status}
                                    onChange={(val) => setFormData({ ...formData, status: val })}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-slate-500 dark:text-muted hover:text-slate-800 dark:hover:text-white transition-colors font-bold text-lg px-6 active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="group relative flex items-center justify-center w-full"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                                <div className="relative flex items-center gap-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 py-4 px-8 rounded-full w-full justify-center shadow-2xl transition-all duration-300 active:scale-95">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-white font-bold text-lg tracking-tight">Create User</span>
                                </div>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddUserModal;
