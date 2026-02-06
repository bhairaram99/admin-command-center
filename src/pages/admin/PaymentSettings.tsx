import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { api, type PaymentConfig } from '@/lib/mock-api';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Save, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentSettings = () => {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    api.getPaymentConfig().then((data) => {
      setConfig(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!config) return;
    if (!config.razorpayKeyId.trim() || !config.razorpayKeySecret.trim()) {
      toast({ title: 'Validation Error', description: 'All fields are required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await api.updatePaymentConfig(config);
      toast({ title: 'Payment Config Saved', description: 'Razorpay configuration has been updated.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save config.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminHeader title="Payment Settings" subtitle="Configure Razorpay payment gateway" />
      <div className="p-6">
        {loading || !config ? (
          <div className="space-y-4 max-w-xl">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-card rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 max-w-xl">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Razorpay Configuration</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Razorpay Key ID</label>
                <input
                  className="input-field w-full font-mono text-xs"
                  value={config.razorpayKeyId}
                  onChange={(e) => setConfig({ ...config, razorpayKeyId: e.target.value })}
                  placeholder="rzp_test_..."
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Razorpay Key Secret</label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    className="input-field w-full font-mono text-xs pr-10"
                    value={config.razorpayKeySecret}
                    onChange={(e) => setConfig({ ...config, razorpayKeySecret: e.target.value })}
                    placeholder="sk_test_..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Mode</label>
                <div className="flex gap-3">
                  {(['Test', 'Live'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setConfig({ ...config, mode })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        config.mode === mode
                          ? mode === 'Live' ? 'bg-success/15 text-success border border-success/30' : 'bg-primary/15 text-primary border border-primary/30'
                          : 'bg-secondary text-muted-foreground border border-border/50 hover:bg-secondary/80'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Allowed Currency</label>
                <select
                  className="input-field w-full"
                  value={config.allowedCurrency}
                  onChange={(e) => setConfig({ ...config, allowedCurrency: e.target.value as 'INR' | 'USD' })}
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div className="pt-2">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Configuration
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default PaymentSettings;
