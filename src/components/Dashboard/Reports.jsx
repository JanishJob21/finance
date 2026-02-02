import React from 'react';
import { TrendingUp, TrendingDown, Calendar, Download, ChevronRight, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/glass.css';
import RevenueChart from './Charts/RevenueChart';

const Reports = ({ stats, revenueData, monthlyBreakdown = [] }) => {
    const [notif, setNotif] = React.useState(null);
    const [isExpanded, setIsExpanded] = React.useState(false);

    const showNotif = (msg) => {
        setNotif(msg);
        setTimeout(() => setNotif(null), 3000);
    };

    // Use dynamic monthly breakdown if provided, otherwise fallback to empty array
    // Show only 4 months by default, show all when isExpanded is true
    const monthlyStats = isExpanded ? monthlyBreakdown : monthlyBreakdown.slice(0, 4);

    return (
        <div className="flex flex-col gap-8 pb-10 relative">
            {/* Notification Toast */}
            <AnimatePresence>
                {notif && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="fixed top-24 left-1/2 z-[200] bg-slate-900 border border-white/10 px-6 py-3 rounded-2xl shadow-2xl text-white font-bold text-sm flex items-center gap-3 backdrop-blur-xl"
                    >
                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                        {notif}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header / Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-xl gap-4">
                <div>
                    <h2 className="text-2xl font-black text-main">Financial Reports</h2>
                    <p className="text-muted text-sm mt-1">Detailed analysis of your interest collections and trends</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => showNotif("Filter options coming soon")}
                        className="p-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95"
                    >
                        <Filter className="w-5 h-5 text-muted" />
                    </button>
                    <button
                        onClick={() => showNotif("Generating Detailed PDF Report...")}
                        className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-[1.2rem] shadow-[0_10px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_15px_25px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all font-bold active:scale-95"
                    >
                        <Download className="w-4 h-4" /> Generate Detailed PDF
                    </button>
                </div>
            </div>

            {/* Top Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Revenue', value: stats?.balance, trend: stats?.revenueTrend, dir: stats?.revenueDir, color: 'emerald', icon: TrendingUp },
                    { label: 'Active Principal', value: stats?.activePrincipal, trend: stats?.principalTrend, dir: stats?.principalDir, color: 'blue', icon: Calendar },
                    { label: 'Projected Interest', value: stats?.dailyInterest, trend: stats?.interestTrend, dir: stats?.interestDir, color: 'violet', icon: TrendingUp }
                ].map((item, idx) => (
                    <div key={idx} className="glass p-6 group cursor-default transition-all hover:translate-y-[-4px]">
                        <div className={`w-12 h-12 rounded-2xl bg-${item.color}-500/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                            <item.icon className={`w-6 h-6 text-${item.color}-500`} />
                        </div>
                        <h3 className="text-muted text-sm font-bold uppercase tracking-wider">{item.label}</h3>
                        <div className="text-3xl font-black text-main mt-2">
                            ₹ {item.value?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                        </div>
                        {item.trend && item.trend !== "0%" && (
                            <div className="mt-4 flex items-center gap-2">
                                <span className={`flex items-center text-xs font-black px-2 py-1 rounded-full ${item.dir === 'up' ? `bg-${item.color}-500/10 text-${item.color}-500` : 'bg-red-500/10 text-red-500'}`}>
                                    {item.dir === 'up' ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />} {item.trend}
                                </span>
                                <span className="text-[10px] text-muted font-medium italic">vs last month</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Charts and Monthly Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <RevenueChart data={revenueData} />
                </div>

                {/* New Monthly Wise Report Widget */}
                <div className="glass p-8 flex flex-col group overflow-hidden">
                    <div
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex justify-between items-center mb-8 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <div>
                            <h3 className="text-xl font-black text-main leading-tight">Monthly<br />Statistics</h3>
                            <p className="text-xs text-muted mt-1 font-medium">Interest Collected</p>
                        </div>
                        <div className={`w-10 h-10 rounded-full bg-main/5 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                            <ChevronRight className="w-5 h-5 text-main" />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <AnimatePresence mode="popLayout">
                            {monthlyStats.map((item, idx) => (
                                <motion.div
                                    key={item.month}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => showNotif(`Fetching detailed data for ${item.month}...`)}
                                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${item.growth ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {item.month[0]}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-main">{item.month}</div>
                                            <div className="text-[10px] text-muted font-bold tracking-tight uppercase">{new Date().getFullYear()} Collection</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-black text-main">₹{item.collected.toLocaleString()}</div>
                                        <div className={`text-[10px] font-black flex items-center justify-end ${item.growth ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {item.growth ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                            {item.trend}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {isExpanded ? (
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="mt-8 w-full py-4 border-2 border-slate-300 dark:border-white/10 rounded-2xl text-muted text-sm font-bold hover:border-cyan-500/50 hover:text-main transition-all active:scale-95"
                        >
                            Show Less
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="mt-8 w-full py-4 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl text-muted text-sm font-bold hover:border-cyan-500/50 hover:text-main transition-all active:scale-95"
                        >
                            View Historical Data
                        </button>
                    )}
                </div>
            </div>

            {/* Performance Analysis Card */}
            <div className="relative overflow-hidden p-8 bg-gradient-to-br from-slate-900 to-slate-950 rounded-[2.5rem] border border-white/10 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 blur-[100px] rounded-full -ml-32 -mb-32" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <TrendingUp className="w-10 h-10 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">AI Generated Analysis</h3>
                        <p className="text-slate-400 text-base leading-relaxed max-w-2xl font-medium">
                            {stats?.balance > 0 ? (
                                <>
                                    Financial performance has been strong this month, with a <span className="text-emerald-400 font-bold">{stats.revenueTrend} increase</span> in interest collection.
                                    Your portfolio risk remains low, and user retention is at an all-time high.
                                    <span className="text-cyan-400 font-bold ml-1 italic">Recommendation: Reinvest 15% of this month's interest for maximum CAGR.</span>
                                </>
                            ) : (
                                <>
                                    Portfolio is currently in a setup phase. Complete your first payment to generate AI-driven performance insights and collection recommendations.
                                    <span className="text-cyan-400 font-bold ml-1 italic">Recommendation: Start by adding your first active principal record.</span>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
