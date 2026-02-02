import React, { useState } from 'react';
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, MoreHorizontal, Trash2 } from 'lucide-react';
import '../../styles/glass.css';

const Payments = ({ transactions = [], onDelete }) => {
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Completed', 'Pending', 'Failed'];

    const filteredPayments = activeTab === 'All' ? transactions : transactions.filter(p => p.status === activeTab);

    return (
        <div className="flex flex-col gap-6">

            {/* Filters & Tabs */}
            <div className="glass p-2 w-fit rounded-xl flex bg-slate-200 dark:bg-black/20 backdrop-blur-md">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                            ? 'bg-white dark:bg-white/10 text-main shadow-lg shadow-black/5 dark:shadow-black/10'
                            : 'text-muted hover:text-main hover:bg-white/50 dark:hover:bg-white/5'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="glass p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-main focus:outline-none focus:border-cyan-500/50"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-2 px-4 text-muted hover:text-main text-sm">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                        <button className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-2 px-4 text-muted hover:text-main text-sm">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-muted text-sm border-b border-slate-200 dark:border-white/5">
                                <th className="py-4 px-4 font-normal pl-6">Transaction ID</th>
                                <th className="py-4 px-4 font-normal">User</th>
                                <th className="py-4 px-4 font-normal">Date</th>
                                <th className="py-4 px-4 font-normal">Type</th>
                                <th className="py-4 px-4 font-normal">Amount</th>
                                <th className="py-4 px-4 font-normal">Status</th>
                                <th className="py-4 px-4 font-normal"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map((p) => (
                                <tr key={p.id} className="border-b border-last-none border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
                                    <td className="py-4 px-4 pl-6 text-sm text-muted">#{p.id}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <img src={p.img} alt={p.user} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                                            <span className="font-medium text-main">{p.user}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-muted text-sm">{p.date}</td>
                                    <td className="py-4 px-4">
                                        <div className={`flex items-center gap-1.5 text-xs font-medium ${p.type === 'Credit' ? 'text-emerald-500' : 'text-muted'}`}>
                                            {p.type === 'Credit' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                                            {p.type}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 font-medium text-main">{p.amount.replace('$', '₹')}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${p.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                            p.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onDelete(p.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 rounded-lg transition-all text-red-500"
                                                title="Delete Transaction"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-all text-muted">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredPayments.length === 0 && (
                    <div className="py-12 text-center text-muted">No transactions found for this filter.</div>
                )}
            </div>
        </div>
    );
};

export default Payments;
