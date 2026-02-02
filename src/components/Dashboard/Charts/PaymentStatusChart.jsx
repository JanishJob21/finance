import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from '../../../context/ThemeContext';
import '../../../styles/glass.css';

const PaymentStatusChart = ({ data = [] }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const tooltipStyle = {
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        borderRadius: '8px',
        color: isDark ? '#fff' : '#0f172a',
        boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    };

    // Calculate completion percentage safely
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    const paid = data.find(d => d.name === 'Paid')?.value || 0;
    const percentage = total > 0 ? Math.round((paid / total) * 100) : 0;

    return (
        <div className="glass p-6 h-96 flex flex-col">
            <h3 className="text-lg font-semibold text-main mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]"></span>
                Payment Status
            </h3>

            <div className="flex-1 w-full min-h-[300px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={tooltipStyle}
                            itemStyle={{ color: isDark ? '#fff' : '#0f172a' }}
                            labelStyle={{ color: isDark ? '#fff' : '#0f172a' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ paddingTop: '20px' }}
                            formatter={(value) => <span className="text-xs font-bold" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-main leading-none">{percentage}%</span>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider mt-1">Completion</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentStatusChart;
