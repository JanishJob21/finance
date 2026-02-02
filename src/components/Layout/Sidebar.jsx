import React, { useState } from 'react';
import { LayoutDashboard, Users, CreditCard, PieChart, Settings, LogOut, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';
import '../../styles/glass.css';

const Sidebar = ({ activeView, onNavigate, onLogout }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Users', icon: Users },
    { name: 'Payments', icon: CreditCard },
    { name: 'Reports', icon: PieChart },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-screen w-64 fixed left-0 top-0 p-4 z-50">
      <div className="glass h-full flex flex-col p-6 relative overflow-hidden">
        {/* Logo area */}
        <div className="flex items-center gap-3 mb-10">
          <div className="relative">
            <Hexagon className="w-8 h-8 text-cyan-400" strokeWidth={2.5} />
            <div className="absolute inset-0 bg-cyan-400 blur-md opacity-50"></div>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">
            FINANCE
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map((item) => (
            <div
              key={item.name}
              onClick={() => onNavigate(item.name)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 relative group ${activeView === item.name ? 'bg-slate-200 dark:bg-white/10 text-main shadow-lg' : 'text-muted hover:bg-slate-200 dark:hover:bg-white/5'
                }`}
            >
              {activeView === item.name && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-xl border border-slate-200 dark:border-white/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <item.icon className={`w-5 h-5 relative z-10 ${activeView === item.name ? 'text-cyan-600 dark:text-cyan-400' : 'group-hover:text-cyan-600 dark:group-hover:text-cyan-300'}`} />
              <span className="relative z-10 font-medium">{item.name}</span>

              {/* Glow effect on active/hover */}
              {activeView === item.name && (
                <div className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_#22d3ee]"></div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <button onClick={onLogout} className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-auto">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
