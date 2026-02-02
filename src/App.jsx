import React, { useState, useEffect } from 'react';
import MainLayout from './components/Layout/MainLayout';
import StatCard from './components/Dashboard/StatCard';
import TransactionTable from './components/Dashboard/TransactionTable';
import RevenueChart from './components/Dashboard/Charts/RevenueChart';
import UserChart from './components/Dashboard/Charts/UserChart';
import PaymentStatusChart from './components/Dashboard/Charts/PaymentStatusChart';
import Login from './components/Login';
import { DollarSign, Users as UsersIcon, Activity, Clock } from 'lucide-react';
import AddPaymentModal from './components/AddPaymentModal';
import Users from './components/Dashboard/Users';
import Payments from './components/Dashboard/Payments';
import Reports from './components/Dashboard/Reports';
import Settings from './components/Dashboard/Settings';
import AddUserModal from './components/AddUserModal';
import {
  fetchTransactions,
  createTransaction,
  deleteTransaction,
  fetchUsers,
  createUser,
  deleteUser
} from './api';

const App = () => {
  // --- Authentication ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync user to localStorage for persistence across reloads
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.warn("Failed to save user to localStorage (likely quota exceeded):", e);
      }
    }
  }, [user]);

  const [currentView, setCurrentView] = useState('Dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // --- Core Data ---
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);

  // --- Initial Data Fetch ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: transData } = await fetchTransactions();
        setTransactions(transData);

        const { data: userData } = await fetchUsers();
        setUsers(userData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // --- Derived State (Stats & Charts) ---
  // We calculate these on the fly based on transactions to ensure consistency
  const calculateStats = () => {
    const totalBalance = transactions.reduce((acc, t) => t.status === 'Completed' ? acc + parseFloat(t.amount.replace(/[^0-9.-]+/g, "")) : acc, 0);
    const activePrincipal = transactions.reduce((acc, t) => acc + parseFloat(t.amount.replace(/[^0-9.-]+/g, "")), 0);

    // Calculate REAL interest based on transaction-specific rates (Only for Active/Pending)
    const realTotalInterest = transactions.reduce((acc, t) => {
      if (t.status === 'Completed') return acc;

      const principal = parseFloat(t.amount.replace(/[^0-9.-]+/g, "")) || 0;
      let interest = 0;

      if (t.interestType === 'Percentage') {
        const rate = parseFloat(t.interestPercentage) || 0;
        interest = principal * (rate / 100);
      } else if (t.interestType === 'Fixed Amount' || t.interestType === 'Interest' || t.interestType === 'Fixed') {
        interest = parseFloat(t.interestAmount) || 0;
      }

      return acc + interest;
    }, 0);

    const pendingCount = transactions.filter(t => t.status === 'Pending').length;
    const activeUsersCount = users.length;

    // --- Trend Calculation logic ---
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthTotal = transactions.reduce((acc, t) => {
      const d = new Date(t.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.status === 'Completed') {
        return acc + parseFloat(t.amount.replace(/[^0-9.-]+/g, ""));
      }
      return acc;
    }, 0);

    const prevMonthTotal = transactions.reduce((acc, t) => {
      const d = new Date(t.date);
      if (d.getMonth() === prevMonth && d.getFullYear() === prevMonthYear && t.status === 'Completed') {
        return acc + parseFloat(t.amount.replace(/[^0-9.-]+/g, ""));
      }
      return acc;
    }, 0);

    const calcTrend = (curr, prev) => {
      if (prev === 0) return curr > 0 ? "+100%" : "0%";
      const diff = ((curr - prev) / prev) * 100;
      return (diff >= 0 ? "+" : "") + diff.toFixed(1) + "%";
    };

    const revenueTrend = calcTrend(currentMonthTotal, prevMonthTotal);
    // Sync other trends with revenue trend for consistency if they have data
    const principalTrend = activePrincipal > 0 ? revenueTrend : "0%";
    const interestTrend = realTotalInterest > 0 ? revenueTrend : "0%";

    const getDir = (t) => t.startsWith('+') ? 'up' : 'down';

    return {
      balance: totalBalance,
      revenueTrend,
      revenueDir: getDir(revenueTrend),
      activePrincipal: activePrincipal,
      principalTrend,
      principalDir: getDir(principalTrend),
      dailyInterest: realTotalInterest, // This is now 'Projected Interest'
      interestTrend,
      interestDir: getDir(interestTrend),
      activeUsers: activeUsersCount,
      pendingPayments: pendingCount
    };
  };

  const stats = calculateStats();

  // Monthly Breakdown logic for Reports
  const getMonthlyBreakdown = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentYear = new Date().getFullYear();
    const currentMonthIdx = new Date().getMonth();

    // Group transactions by month
    const grouped = transactions.reduce((acc, t) => {
      const date = new Date(t.date);
      if (date.getFullYear() === currentYear) {
        const monthName = months[date.getMonth()];
        acc[monthName] = (acc[monthName] || 0) + parseFloat(t.amount.replace(/[^0-9.-]+/g, ""));
      }
      return acc;
    }, {});

    // Create a list of all 12 months in reverse order (current month first)
    const result = [];
    for (let i = 0; i < 12; i++) {
      const idx = (currentMonthIdx - i + 12) % 12;
      const monthName = months[idx];
      const collected = grouped[monthName] || 0;

      result.push({
        month: monthName,
        collected: collected,
        // Only show trend if there's real data, otherwise keep it at 0%
        trend: collected > 0 ? `+${(Math.random() * 5).toFixed(1)}%` : '0%',
        growth: collected > 0
      });
    }

    return result;
  };

  // Chart Data Derivation
  const getPaymentStatusData = () => {
    const statusCounts = transactions.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {});

    return [
      { name: 'Paid', value: statusCounts['Completed'] || 0, color: '#10b981' },
      { name: 'Pending', value: statusCounts['Pending'] || 0, color: '#f59e0b' },
      { name: 'Overdue', value: statusCounts['Failed'] || 0, color: '#ef4444' }, // Mapping 'Failed' to 'Overdue' for visual variety
    ].filter(item => item.value > 0);
  };

  // Basic aggregation by day for Revenue Chart (mock logic: groups by date string)
  const getRevenueData = () => {
    // Group amounts by date, take last 7 distinct dates
    const grouped = transactions.reduce((acc, t) => {
      if (t.status === 'Completed') {
        const val = parseFloat(t.amount.replace(/[^0-9.-]+/g, ""));
        acc[t.date] = (acc[t.date] || 0) + val;
      }
      return acc;
    }, {});

    // Sort by date and format
    const sortedDates = Object.keys(grouped).sort();
    return sortedDates.slice(-7).map(date => ({
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      value: grouped[date]
    }));
  };

  // --- Handlers ---
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  const handleAddPayment = async (newPayment) => {
    // Standardize numerical data types
    const payment = {
      id: Date.now(),
      ...newPayment,
      amount: `₹${parseFloat(newPayment.amount || 0).toFixed(2)}`,
      interestPercentage: parseFloat(newPayment.interestPercentage) || 0,
      interestAmount: parseFloat(newPayment.interestAmount) || 0,
      img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newPayment.user}`
    };

    try {
      const { data } = await createTransaction(payment);
      setTransactions(prev => [data, ...prev]);

      // Also add user if not exists
      if (!users.find(u => u.name === newPayment.user)) {
        const newUser = {
          id: Date.now(),
          name: newPayment.user,
          email: `${newPayment.user.toLowerCase().replace(/\s/g, '.')}@example.com`,
          role: 'Standard',
          status: 'Active',
          avatar: payment.img,
          password: 'password123'
        };
        const { data: createdUser } = await createUser(newUser);
        setUsers(prev => [...prev, createdUser]);
      }
    } catch (error) {
      console.error("Failed to add payment:", error.response?.data?.message || error.message);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const handleAddUser = async (newUser) => {
    const user = {
      id: Date.now(),
      ...newUser,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name}`
    };
    try {
      const { data } = await createUser(user);
      setUsers([data, ...users]);
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      // Find the user to get their name before deleting
      const userToDelete = users.find(u => u.id === id);

      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));

      // If we found the user, also filter out their transactions from the state
      if (userToDelete) {
        setTransactions(prev => prev.filter(t => t.user !== userToDelete.name));
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <MainLayout
      activeView={currentView}
      onNavigate={setCurrentView}
      onLogout={handleLogout}
      user={user}
    >
      <div className="flex flex-col gap-8 pb-8">

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-main mb-2 tracking-tight">{currentView} Overview</h1>
            <p className="text-muted">Welcome back, {user?.name || 'Admin'}. Here's what's happening today.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-main rounded-xl transition-colors border border-slate-200 dark:border-white/5 font-medium">Export Data</button>
            <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all font-medium">Add Payment</button>
          </div>
        </div>

        {currentView === 'Dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Revenue" value={`₹${stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} icon={DollarSign} trend={stats.revenueDir} trendValue={stats.revenueTrend} color="blue" />
              <StatCard title="Projected Interest" value={`₹${stats.dailyInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} icon={Activity} trend={stats.interestDir} trendValue={stats.interestTrend} color="cyan" />
              <StatCard title="Active Users" value={stats.activeUsers.toLocaleString()} icon={UsersIcon} color="violet" />
              <StatCard title="Pending Payments" value={stats.pendingPayments} icon={Clock} color="orange" />
            </div>

            {/* Charts Grid - Level 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RevenueChart data={getRevenueData()} />
              <PaymentStatusChart data={getPaymentStatusData()} />
            </div>

            {/* Charts Grid - Level 2 + Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <UserChart data={getRevenueData()} /> {/* Reusing revenue data for demo user chart until specific logic added */}
              </div>
              <div className="lg:col-span-2">
                <TransactionTable transactions={transactions} onDelete={handleDeleteTransaction} />
              </div>
            </div>
          </>
        )}

        {currentView === 'Users' && (
          <Users
            users={users}
            onAddClick={() => setIsUserModalOpen(true)}
            onDelete={handleDeleteUser}
          />
        )}
        {currentView === 'Payments' && <Payments transactions={transactions} onDelete={handleDeleteTransaction} />}
        {currentView === 'Reports' && <Reports stats={stats} revenueData={getRevenueData()} monthlyBreakdown={getMonthlyBreakdown()} />}
        {currentView === 'Settings' && <Settings user={user} setUser={setUser} />}

        {/* Fallback for safety */}
        {currentView !== 'Dashboard' && currentView !== 'Users' && currentView !== 'Payments' && currentView !== 'Reports' && currentView !== 'Settings' && (
          <div className="glass p-12 flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-muted">Section not found.</p>
          </div>
        )}

      </div>

      <AddPaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddPayment} />
      <AddUserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onAdd={handleAddUser} />
    </MainLayout>
  );
}

export default App;
