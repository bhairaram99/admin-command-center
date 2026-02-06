import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { motion } from 'framer-motion';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col min-w-0"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default AdminLayout;
