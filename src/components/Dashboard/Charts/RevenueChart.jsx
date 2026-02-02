import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTheme } from '../../../context/ThemeContext';
import '../../../styles/glass.css';

const RevenueChart = ({ data = [] }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const axisColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    const tooltipStyle = {
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        borderRadius: '8px',
        color: isDark ? '#fff' : '#0f172a',
        boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    };

    return (
        <div className="glass p-6 col-span-2 h-96 flex flex-col group">
            <h3 className="text-lg font-bold text-main mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse"></span>
                Interest Collection Trend
            </h3>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                                <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} opacity={0.5} />
                        <XAxis
                            dataKey="name"
                            stroke={axisColor}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke={axisColor}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₹ ${value}`}
                            width={60}
                        />
                        <Tooltip
                            contentStyle={tooltipStyle}
                            itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                            labelStyle={{ color: isDark ? '#fff' : '#0f172a', marginBottom: '4px' }}
                            cursor={{ stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '5 5' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#06b6d4"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            filter="url(#glow)"
                            activeDot={{
                                r: 6,
                                fill: '#22d3ee',
                                stroke: isDark ? '#0f172a' : '#fff',
                                strokeWidth: 2,
                                shadow: '0 0 10px #22d3ee'
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;
