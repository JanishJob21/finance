import React, { useState } from 'react';
import { Hexagon, Lock, Mail, ArrowRight } from 'lucide-react';
import '../styles/glass.css';
import { motion } from 'framer-motion';
import { loginUser } from '../api';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await loginUser({ email, password });
            onLogin(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-bg-dark text-main">
            {/* Background Ambience */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass p-8 w-full max-w-md relative z-10 border border-slate-200 dark:border-white/10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                        <Hexagon className="w-12 h-12 text-cyan-500" strokeWidth={2} />
                        <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-30 dark:opacity-50"></div>
                    </div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-violet-600">
                        Welcome Back
                    </h2>
                    <p className="text-muted text-sm mt-2">Enter your credentials to access the finance hub</p>

                    {error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg w-full text-center">
                            {error}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-cyan-500 transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-cyan-500/50 focus:bg-white/10 dark:focus:bg-white/10 transition-all text-main placeholder:text-muted"
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-cyan-500 transition-colors" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-cyan-500/50 focus:bg-white/10 dark:focus:bg-white/10 transition-all text-main placeholder:text-muted"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-muted">
                        Forgot password? <a href="#" className="text-cyan-500 hover:text-cyan-600 transition-colors">Reset it here</a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
