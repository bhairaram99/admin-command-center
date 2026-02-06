import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { api, type Plan } from '@/lib/mock-api';
import { motion } from 'framer-motion';
import { Plus, Edit2, Power, PackageOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const emptyPlan: Omit<Plan, 'id'> = {
  name: '',
  tokenLimit: 0,
  priceINR: 0,
  priceUSD: 0,
  currencyVisibility: 'BOTH',
  active: true,
};

const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState<Omit<Plan, 'id'>>(emptyPlan);
  const [saving, setSaving] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; planId: string; active: boolean }>({ open: false, planId: '', active: false });
  const { toast } = useToast();

  const fetchPlans = async () => {
    const data = await api.getPlans();
    setPlans(data);
    setLoading(false);
  };

  useEffect(() => { fetchPlans(); }, []);

  const openCreate = () => {
    setEditingPlan(null);
    setForm(emptyPlan);
    setModalOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setForm({ name: plan.name, tokenLimit: plan.tokenLimit, priceINR: plan.priceINR, priceUSD: plan.priceUSD, currencyVisibility: plan.currencyVisibility, active: plan.active });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: 'Validation Error', description: 'Plan name is required', variant: 'destructive' });
      return;
    }
    if (form.tokenLimit < 0 || form.priceINR < 0 || form.priceUSD < 0) {
      toast({ title: 'Validation Error', description: 'Values cannot be negative', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      if (editingPlan) {
        await api.updatePlan(editingPlan.id, form);
        toast({ title: 'Plan Updated', description: `"${form.name}" has been updated.` });
      } else {
        await api.createPlan(form);
        toast({ title: 'Plan Created', description: `"${form.name}" has been created.` });
      }
      setModalOpen(false);
      fetchPlans();
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    setSaving(true);
    try {
      await api.updatePlan(confirmDialog.planId, { active: !confirmDialog.active });
      toast({ title: 'Plan Updated', description: `Plan has been ${confirmDialog.active ? 'disabled' : 'enabled'}.` });
      setConfirmDialog({ open: false, planId: '', active: false });
      fetchPlans();
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminHeader title="Plans Management" subtitle="Create and manage subscription plans" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">{plans.length} plan(s) configured</p>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Plan
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-card rounded-lg animate-pulse" />)}
          </div>
        ) : plans.length === 0 ? (
          <div className="empty-state">
            <PackageOpen className="w-12 h-12 mb-3 text-muted-foreground/50" />
            <p className="text-sm">No plans created yet</p>
            <button onClick={openCreate} className="btn-primary mt-4">Create First Plan</button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Tokens</th>
                  <th>Price INR</th>
                  <th>Price USD</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, i) => (
                  <motion.tr
                    key={plan.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td className="font-medium text-foreground">{plan.name}</td>
                    <td>{plan.tokenLimit.toLocaleString()}</td>
                    <td>₹{plan.priceINR}</td>
                    <td>${plan.priceUSD}</td>
                    <td><span className="badge-info">{plan.currencyVisibility}</span></td>
                    <td>
                      <span className={plan.active ? 'badge-active' : 'badge-inactive'}>
                        {plan.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(plan)} className="text-muted-foreground hover:text-foreground transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDialog({ open: true, planId: plan.id, active: plan.active })}
                          className={`transition-colors ${plan.active ? 'text-muted-foreground hover:text-destructive' : 'text-muted-foreground hover:text-success'}`}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingPlan ? 'Edit Plan' : 'Create Plan'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Plan Name</label>
            <input className="input-field w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Pro" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Token Limit</label>
            <input className="input-field w-full" type="number" min={0} value={form.tokenLimit} onChange={(e) => setForm({ ...form, tokenLimit: Math.max(0, parseInt(e.target.value) || 0) })} />
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
          <div className="flex items-center gap-2">
            <input type="checkbox" id="plan-active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded" />
            <label htmlFor="plan-active" className="text-sm text-muted-foreground">Active</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving && <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
              {editingPlan ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.active ? 'Disable Plan?' : 'Enable Plan?'}
        message={confirmDialog.active ? 'This plan will no longer be visible to users on the website.' : 'This plan will become available to users.'}
        confirmLabel={confirmDialog.active ? 'Disable' : 'Enable'}
        confirmVariant={confirmDialog.active ? 'destructive' : 'primary'}
        onConfirm={handleToggleActive}
        onCancel={() => setConfirmDialog({ open: false, planId: '', active: false })}
        loading={saving}
      />
    </>
  );
};

export default Plans;
