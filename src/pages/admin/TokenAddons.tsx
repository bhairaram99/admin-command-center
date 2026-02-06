import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Modal from '@/components/admin/Modal';
import { api, type TokenAddon } from '@/lib/mock-api';
import { motion } from 'framer-motion';
import { Plus, Edit2, Power, PackageOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

const emptyAddon: Omit<TokenAddon, 'id'> = {
  name: '',
  extraTokens: 0,
  priceINR: 0,
  priceUSD: 0,
  currencyVisibility: 'BOTH',
  active: true,
};

const TokenAddons = () => {
  const [addons, setAddons] = useState<TokenAddon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<TokenAddon | null>(null);
  const [form, setForm] = useState<Omit<TokenAddon, 'id'>>(emptyAddon);
  const [saving, setSaving] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; addonId: string; active: boolean }>({ open: false, addonId: '', active: false });
  const { toast } = useToast();

  const fetchAddons = async () => {
    const data = await api.getTokenAddons();
    setAddons(data);
    setLoading(false);
  };

  useEffect(() => { fetchAddons(); }, []);

  const openCreate = () => {
    setEditingAddon(null);
    setForm(emptyAddon);
    setModalOpen(true);
  };

  const openEdit = (addon: TokenAddon) => {
    setEditingAddon(addon);
    setForm({ name: addon.name, extraTokens: addon.extraTokens, priceINR: addon.priceINR, priceUSD: addon.priceUSD, currencyVisibility: addon.currencyVisibility, active: addon.active });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: 'Validation Error', description: 'Add-on name is required', variant: 'destructive' });
      return;
    }
    if (form.extraTokens <= 0) {
      toast({ title: 'Validation Error', description: 'Extra tokens must be greater than 0', variant: 'destructive' });
      return;
    }
    if (form.priceINR < 0 || form.priceUSD < 0) {
      toast({ title: 'Validation Error', description: 'Prices cannot be negative', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      if (editingAddon) {
        await api.updateTokenAddon(editingAddon.id, form);
        toast({ title: 'Add-on Updated', description: `"${form.name}" has been updated.` });
      } else {
        await api.createTokenAddon(form);
        toast({ title: 'Add-on Created', description: `"${form.name}" has been created.` });
      }
      setModalOpen(false);
      fetchAddons();
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    setSaving(true);
    try {
      await api.updateTokenAddon(confirmDialog.addonId, { active: !confirmDialog.active });
      toast({ title: 'Updated', description: `Add-on ${confirmDialog.active ? 'disabled' : 'enabled'}.` });
      setConfirmDialog({ open: false, addonId: '', active: false });
      fetchAddons();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminHeader title="Token Add-ons" subtitle="Manage extra token packages for users" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{addons.length} add-on(s) configured</p>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Add-on
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-card rounded-lg animate-pulse" />)}
          </div>
        ) : addons.length === 0 ? (
          <div className="empty-state">
            <PackageOpen className="w-12 h-12 mb-3 text-muted-foreground/50" />
            <p className="text-sm">No token add-ons yet</p>
            <button onClick={openCreate} className="btn-primary mt-4">Create First Add-on</button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Extra Tokens</th>
                  <th>Price INR</th>
                  <th>Price USD</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {addons.map((addon, i) => (
                  <motion.tr key={addon.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <td className="font-medium text-foreground">{addon.name}</td>
                    <td>{addon.extraTokens.toLocaleString()}</td>
                    <td>₹{addon.priceINR}</td>
                    <td>${addon.priceUSD}</td>
                    <td><span className="badge-info">{addon.currencyVisibility}</span></td>
                    <td><span className={addon.active ? 'badge-active' : 'badge-inactive'}>{addon.active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(addon)} className="text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => setConfirmDialog({ open: true, addonId: addon.id, active: addon.active })} className="text-muted-foreground hover:text-destructive transition-colors"><Power className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingAddon ? 'Edit Add-on' : 'Create Add-on'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Add-on Name</label>
            <input className="input-field w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Small Top-up" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Extra Tokens</label>
            <input className="input-field w-full" type="number" min={1} value={form.extraTokens} onChange={(e) => setForm({ ...form, extraTokens: Math.max(0, parseInt(e.target.value) || 0) })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Price INR (₹)</label>
              <input className="input-field w-full" type="number" min={0} step="0.01" value={form.priceINR} onChange={(e) => setForm({ ...form, priceINR: Math.max(0, parseFloat(e.target.value) || 0) })} />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Price USD ($)</label>
              <input className="input-field w-full" type="number" min={0} step="0.01" value={form.priceUSD} onChange={(e) => setForm({ ...form, priceUSD: Math.max(0, parseFloat(e.target.value) || 0) })} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Currency Visibility</label>
            <select className="input-field w-full" value={form.currencyVisibility} onChange={(e) => setForm({ ...form, currencyVisibility: e.target.value as 'INR' | 'USD' | 'BOTH' })}>
              <option value="INR">INR Only</option>
              <option value="USD">USD Only</option>
              <option value="BOTH">Both</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving && <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
              {editingAddon ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.active ? 'Disable Add-on?' : 'Enable Add-on?'}
        message={confirmDialog.active ? 'This add-on will be hidden from users.' : 'This add-on will be visible to users.'}
        confirmLabel={confirmDialog.active ? 'Disable' : 'Enable'}
        confirmVariant={confirmDialog.active ? 'destructive' : 'primary'}
        onConfirm={handleToggle}
        onCancel={() => setConfirmDialog({ open: false, addonId: '', active: false })}
        loading={saving}
      />
    </>
  );
};

export default TokenAddons;
