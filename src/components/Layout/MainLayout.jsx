import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children, activeView, onNavigate, onLogout, user }) => {
    return (
        <div className="flex w-full min-h-screen text-main bg-bg-dark transition-colors duration-300">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute top-[20%] right-[30%] w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen" />
            </div>

            <Sidebar activeView={activeView} onNavigate={onNavigate} onLogout={onLogout} />

            <main className="flex-1 ml-64 p-8 relative">
                <Header user={user} onLogout={onLogout} onNavigate={onNavigate} />
                <div className="relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
