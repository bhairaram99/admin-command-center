import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLogin from "@/pages/AdminLogin";
import Dashboard from "@/pages/admin/Dashboard";
import Plans from "@/pages/admin/Plans";
import TokenAddons from "@/pages/admin/TokenAddons";
import UsersPage from "@/pages/admin/Users";
import PaymentSettings from "@/pages/admin/PaymentSettings";
import AISettings from "@/pages/admin/AISettings";
import TokenRules from "@/pages/admin/TokenRules";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="plans" element={<Plans />} />
              <Route path="token-addons" element={<TokenAddons />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="payment-settings" element={<PaymentSettings />} />
              <Route path="ai-settings" element={<AISettings />} />
              <Route path="token-rules" element={<TokenRules />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
