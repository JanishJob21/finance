import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import '../../styles/glass.css';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
    const isPositive = trend === 'up';

    const colorMap = {
        blue: 'from-blue-500 to-indigo-600',
        violet: 'from-violet-500 to-purple-600',
        cyan: 'from-cyan-400 to-blue-500',
        orange: 'from-orange-400 to-red-500',
    };

    const bgGradient = colorMap[color] || colorMap.blue;

    return (
        <div className="glass p-6 hover-glow relative overflow-hidden group">
            {/* Background decoration */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${bgGradient} opacity-20 blur-2xl rounded-full group-hover:opacity-30 transition-opacity`}></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${bgGradient} bg-opacity-10 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trendValue && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'} bg-white/5 px-2 py-1 rounded-lg`}>
                        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {trendValue}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <h4 className="text-muted text-sm font-medium mb-1">{title}</h4>
                <h2 className="text-3xl font-bold text-main tracking-tight">{value}</h2>
            </div>
        </div>
    );
};

export default StatCard;
