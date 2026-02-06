import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { api, type TokenRules as TokenRulesType } from '@/lib/mock-api';
import { motion } from 'framer-motion';
import { Save, Hash, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TokenRules = () => {
  const [rules, setRules] = useState<TokenRulesType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    api.getTokenRules().then((data) => {
      setRules(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!rules) return;
    if (rules.guestFreeTokens < 0 || rules.loggedInFreeTokens < 0 || rules.tokensPerWord < 0) {
      toast({ title: 'Validation Error', description: 'Values cannot be negative', variant: 'destructive' });
      return;
    }
    if (rules.tokensPerWord === 0) {
      toast({ title: 'Validation Error', description: 'Tokens per word must be at least 1', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      await api.updateTokenRules(rules);
      toast({ title: 'Token Rules Saved', description: 'Global token rules have been updated.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const setValue = (key: keyof TokenRulesType, value: string) => {
    if (!rules) return;
    const num = parseInt(value) || 0;
    setRules({ ...rules, [key]: Math.max(0, num) });
  };

  return (
    <>
      <AdminHeader title="Token Rules" subtitle="Configure global token allocation logic" />
      <div className="p-6">
        {loading || !rules ? (
          <div className="space-y-4 max-w-xl">
            {[1, 2, 3].map(i => <div key={i} className="h-14 bg-card rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 max-w-xl">
            <div className="flex items-center gap-2 mb-6">
              <Hash className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Global Token Rules</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Guest Free Tokens</label>
                <p className="text-xs text-muted-foreground/70 mb-2">Tokens given to unregistered visitors</p>
                <input
                  className="input-field w-full"
                  type="number"
                  min={0}
                  value={rules.guestFreeTokens}
                  onChange={(e) => setValue('guestFreeTokens', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Logged-in Free Tokens</label>
                <p className="text-xs text-muted-foreground/70 mb-2">Tokens given to registered free users</p>
                <input
                  className="input-field w-full"
                  type="number"
                  min={0}
                  value={rules.loggedInFreeTokens}
                  onChange={(e) => setValue('loggedInFreeTokens', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Tokens Per Word</label>
                <p className="text-xs text-muted-foreground/70 mb-2">Number of tokens consumed per word (integer only)</p>
                <input
                  className="input-field w-full"
                  type="number"
                  min={1}
                  step={1}
                  value={rules.tokensPerWord}
                  onChange={(e) => setValue('tokensPerWord', e.target.value)}
                />
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-xs text-warning/90">
                  Changes to token rules apply globally and affect all users immediately.
                </p>
              </div>

              <div className="pt-2">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Rules
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default TokenRules;
