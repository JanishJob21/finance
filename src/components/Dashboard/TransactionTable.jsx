import React from 'react';
import { Search, Filter, MoreHorizontal, Download, Trash2 } from 'lucide-react';
import '../../styles/glass.css';

const statusStyles = {
    Completed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    Pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    Failed: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

const TransactionTable = ({ transactions = [], onDelete }) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredTransactions = transactions.filter(t =>
        t.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.amount.toString().includes(searchTerm)
    );

    const handleExport = () => {
        const headers = ['ID,User,Date,Amount,Status'];
        const csvContent = filteredTransactions.map(t =>
            `${t.id},${t.user},${t.date},"${t.amount.replace('$', '₹')}",${t.status}`
        ).join('\n');

        const blob = new Blob([headers + '\n' + csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions.csv';
        a.click();
    };

    return (
        <div className="glass p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-lg font-semibold text-main">Recent Transactions</h3>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-main focus:outline-none focus:border-cyan-500/50"
                        />
                    </div>
                    <button className="p-2 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 rounded-lg border border-slate-300 dark:border-white/10 transition-colors">
                        <Filter className="w-4 h-4 text-muted" />
                    </button>
                    <button onClick={handleExport} className="p-2 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 rounded-lg border border-slate-300 dark:border-white/10 transition-colors" title="Export CSV">
                        <Download className="w-4 h-4 text-muted" />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-muted text-sm border-b border-slate-200 dark:border-white/5">
                            <th className="py-3 px-4 font-normal">Details</th>
                            <th className="py-3 px-4 font-normal">Date</th>
                            <th className="py-3 px-4 font-normal">Amount</th>
                            <th className="py-3 px-4 font-normal">Status</th>
                            <th className="py-3 px-4 font-normal"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((t) => (
                                <tr key={t.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <img src={t.img} alt={t.user} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700" />
                                            <span className="font-medium text-main">{t.user}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-muted text-sm">{t.date}</td>
                                    <td className="py-3 px-4 font-medium text-main">{t.amount.replace('$', '₹')}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[t.status]}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onDelete(t.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 rounded-lg transition-all text-red-500"
                                                title="Delete Transaction"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-all">
                                                <MoreHorizontal className="w-4 h-4 text-muted" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-muted">
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionTable;
