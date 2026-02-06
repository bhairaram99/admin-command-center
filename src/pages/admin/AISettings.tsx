import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { api, type AIConfig, AI_MODELS } from '@/lib/mock-api';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Save, Brain, Power } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AISettings = () => {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    api.getAIConfig().then((data) => {
      setConfig(data);
      setLoading(false);
    });
  }, []);

  const handleProviderChange = (provider: AIConfig['provider']) => {
    if (!config) return;
    const models = AI_MODELS[provider];
    setConfig({ ...config, provider, model: models[0] });
  };

  const handleSave = async () => {
    if (!config) return;
    if (!config.apiKey.trim()) {
      toast({ title: 'Validation Error', description: 'API key is required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await api.updateAIConfig(config);
      toast({ title: 'AI Config Saved', description: `${config.provider} configuration updated.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to save.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminHeader title="AI Settings" subtitle="Configure AI provider and model" />
      <div className="p-6">
        {loading || !config ? (
          <div className="space-y-4 max-w-xl">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-card rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 max-w-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-medium text-foreground">AI Configuration</h3>
              </div>
              <button
                onClick={() => setConfig({ ...config, enabled: !config.enabled })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  config.enabled
                    ? 'bg-success/15 text-success border border-success/30'
                    : 'bg-destructive/15 text-destructive border border-destructive/30'
                }`}
              >
                <Power className="w-3 h-3" />
                {config.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">AI Provider</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(AI_MODELS) as AIConfig['provider'][]).map((provider) => (
                    <button
                      key={provider}
                      onClick={() => handleProviderChange(provider)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        config.provider === provider
                          ? 'bg-primary/15 text-primary border border-primary/30'
                          : 'bg-secondary text-muted-foreground border border-border/50 hover:bg-secondary/80'
                      }`}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">API Key</label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    className="input-field w-full font-mono text-xs pr-10"
                    value={config.apiKey}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    placeholder="Enter API key..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Model</label>
                <select
                  className="input-field w-full"
                  value={config.model}
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                >
                  {AI_MODELS[config.provider].map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
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

export default AISettings;
