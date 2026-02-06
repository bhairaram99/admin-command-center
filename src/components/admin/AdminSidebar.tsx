import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CreditCard,
  Coins,
  Users,
  Settings,
  Brain,
  Hash,
  LogOut,
  Zap,
  ChevronLeft,
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Plans', icon: CreditCard, path: '/admin/plans' },
  { label: 'Token Add-ons', icon: Coins, path: '/admin/token-addons' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Payment Settings', icon: Settings, path: '/admin/payment-settings' },
  { label: 'AI Settings', icon: Brain, path: '/admin/ai-settings' },
  { label: 'Token Rules', icon: Hash, path: '/admin/token-rules' },
];

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`h-screen sticky top-0 bg-[hsl(var(--sidebar-background))] border-r border-sidebar-border flex flex-col transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-[240px]'
      }`}
    >
      {/* Brand */}
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-semibold text-foreground"
            >
              AI Humanizer
            </motion.span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand on collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="p-3 flex justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {menuItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className={`sidebar-item w-full text-destructive hover:bg-destructive/10 hover:text-destructive ${
            collapsed ? 'justify-center px-2' : ''
          }`}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
