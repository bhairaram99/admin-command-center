import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import { api, type DashboardStats } from '@/lib/mock-api';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, Coins, IndianRupee, DollarSign, Brain, TrendingUp } from 'lucide-react';

const statConfig = [
  { key: 'totalUsers' as const, label: 'Total Users', icon: Users, color: 'text-primary' },
  { key: 'freeUsers' as const, label: 'Free Users', icon: UserX, color: 'text-warning' },
  { key: 'paidUsers' as const, label: 'Paid Users', icon: UserCheck, color: 'text-success' },
  { key: 'totalTokensUsed' as const, label: 'Total Tokens Used', icon: Coins, color: 'text-primary' },
  { key: 'totalRevenueINR' as const, label: 'Revenue (INR)', icon: IndianRupee, color: 'text-success', prefix: '₹' },
  { key: 'totalRevenueUSD' as const, label: 'Revenue (USD)', icon: DollarSign, color: 'text-success', prefix: '$' },
];

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="Overview of your AI Humanizer platform" />
      <div className="p-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="stat-card animate-pulse">
                <div className="h-4 w-24 bg-secondary rounded mb-3" />
                <div className="h-8 w-32 bg-secondary rounded" />
              </div>
            ))}
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {statConfig.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="stat-card"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    <AnimatedCounter
                      value={stats[item.key]}
                      prefix={item.prefix}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Active AI Provider Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-4 stat-card flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active AI Provider</p>
                <p className="text-lg font-semibold text-foreground">{stats.activeAIProvider}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-success">Active</span>
              </div>
            </motion.div>

            {/* Quick Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-4 glass-card p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Usage Overview</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Conversion Rate</p>
                  <p className="text-lg font-semibold text-foreground">
                    {stats.totalUsers > 0 ? ((stats.paidUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Avg Tokens/User</p>
                  <p className="text-lg font-semibold text-foreground">
                    <AnimatedCounter value={stats.totalUsers > 0 ? Math.round(stats.totalTokensUsed / stats.totalUsers) : 0} />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">ARPU (INR)</p>
                  <p className="text-lg font-semibold text-foreground">
                    ₹<AnimatedCounter value={stats.paidUsers > 0 ? Math.round(stats.totalRevenueINR / stats.paidUsers) : 0} />
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Dashboard;
