import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import '../../styles/glass.css';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ user, onLogout, onNavigate }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="flex items-center justify-between p-4 mb-8">
            {/* Search Bar */}
            <div className="glass-panel flex items-center px-4 py-2.5 w-96 gap-3 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all bg-card dark:bg-white/5">
                <Search className="w-5 h-5 text-muted" />
                <input
                    type="text"
                    placeholder="Search items, users, payments..."
                    className="bg-transparent border-none outline-none text-main placeholder-muted w-full text-sm"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                <ThemeToggle />

                <button className="relative p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/5 transition-colors group">
                    <Bell className="w-6 h-6 text-muted group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></span>
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-white/10 hover:opacity-80 transition-opacity"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px]">
                            <img
                                src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"}
                                alt={user?.name || "Admin"}
                                className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-900"
                            />
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-main">{user?.name || "Admin User"}</p>
                            <p className="text-xs text-muted">{user?.role || "Super Admin"}</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-4 w-56 py-3 bg-white dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden"
                            >
                                <div className="px-4 py-2 mb-2 border-b border-slate-200 dark:border-white/10">
                                    <p className="text-xs font-bold text-muted uppercase tracking-wider">Account</p>
                                </div>
                                <button
                                    onClick={() => { onNavigate('Dashboard'); setIsDropdownOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-main hover:bg-cyan-500/10 transition-colors"
                                >
                                    <User className="w-4 h-4 text-cyan-500" /> Dashboard
                                </button>
                                <button
                                    onClick={() => { onNavigate('Settings'); setIsDropdownOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-main hover:bg-cyan-500/10 transition-colors"
                                >
                                    <Settings className="w-4 h-4 text-cyan-500" /> Settings
                                </button>
                                <div className="my-2 border-t border-slate-200 dark:border-white/10" />
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
