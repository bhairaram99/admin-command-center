import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { api, type User } from '@/lib/mock-api';
import { motion } from 'framer-motion';
import { Search, Eye, Coins, ShieldOff, ShieldCheck, UserX, Users as UsersIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addTokenModal, setAddTokenModal] = useState<{ open: boolean; userId: string; email: string }>({ open: false, userId: '', email: '' });
  const [tokenAmount, setTokenAmount] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: string; userId: string; email: string }>({ open: false, action: '', userId: '', email: '' });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    const data = await api.getUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));

  const handleAddTokens = async () => {
    if (tokenAmount <= 0) {
      toast({ title: 'Invalid', description: 'Token amount must be positive', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await api.addTokens(addTokenModal.userId, tokenAmount);
      toast({ title: 'Tokens Added', description: `${tokenAmount.toLocaleString()} tokens added to ${addTokenModal.email}` });
      setAddTokenModal({ open: false, userId: '', email: '' });
      setTokenAmount(0);
      fetchUsers();
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmAction = async () => {
    setSaving(true);
    try {
      if (confirmDialog.action === 'block') {
        await api.toggleBlockUser(confirmDialog.userId);
        toast({ title: 'User Updated', description: `User ${confirmDialog.email} status changed.` });
      } else if (confirmDialog.action === 'disable-plan') {
        await api.disableUserPlan(confirmDialog.userId);
        toast({ title: 'Plan Disabled', description: `Plan removed for ${confirmDialog.email}` });
      }
      setConfirmDialog({ open: false, action: '', userId: '', email: '' });
      fetchUsers();
    } finally {
      setSaving(false);
    }
  };

  const viewUser = (user: User) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

  return (
    <>
      <AdminHeader title="Users" subtitle="Manage registered users" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="input-field w-full pl-10"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-sm text-muted-foreground">{filteredUsers.length} user(s)</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-card rounded-lg animate-pulse" />)}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <UsersIcon className="w-12 h-12 mb-3 text-muted-foreground/50" />
            <p className="text-sm">{search ? 'No users match your search' : 'No users yet'}</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Plan</th>
                  <th>Tokens Used</th>
                  <th>Remaining</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <motion.tr key={user.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                    <td className="font-medium text-foreground">{user.email}</td>
                    <td><span className={user.userType === 'Paid' ? 'badge-active' : 'badge-info'}>{user.userType}</span></td>
                    <td>{user.planName || '—'}</td>
                    <td>{user.tokensUsed.toLocaleString()}</td>
                    <td>{user.tokensRemaining.toLocaleString()}</td>
                    <td><span className={user.paymentStatus === 'Paid' ? 'badge-active' : user.paymentStatus === 'Pending' ? 'badge-info' : 'text-muted-foreground text-xs'}>{user.paymentStatus}</span></td>
                    <td>{user.blocked ? <span className="badge-inactive">Blocked</span> : <span className="badge-active">Active</span>}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => viewUser(user)} className="text-muted-foreground hover:text-foreground transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setAddTokenModal({ open: true, userId: user.id, email: user.email }); setTokenAmount(0); }} className="text-muted-foreground hover:text-primary transition-colors" title="Add Tokens">
                          <Coins className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDialog({ open: true, action: 'block', userId: user.id, email: user.email })}
                          className={`transition-colors ${user.blocked ? 'text-muted-foreground hover:text-success' : 'text-muted-foreground hover:text-destructive'}`}
                          title={user.blocked ? 'Unblock' : 'Block'}
                        >
                          {user.blocked ? <ShieldCheck className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                        </button>
                        {user.planName && (
                          <button
                            onClick={() => setConfirmDialog({ open: true, action: 'disable-plan', userId: user.id, email: user.email })}
                            className="text-muted-foreground hover:text-warning transition-colors"
                            title="Disable Plan"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      {/* User Detail Modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="User Details">
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Email', selectedUser.email],
                ['User Type', selectedUser.userType],
                ['Plan', selectedUser.planName || 'None'],
                ['Payment', selectedUser.paymentStatus],
                ['Tokens Used', selectedUser.tokensUsed.toLocaleString()],
                ['Tokens Remaining', selectedUser.tokensRemaining.toLocaleString()],
                ['Status', selectedUser.blocked ? 'Blocked' : 'Active'],
                ['Joined', selectedUser.joinedAt],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Tokens Modal */}
      <Modal open={addTokenModal.open} onClose={() => setAddTokenModal({ open: false, userId: '', email: '' })} title="Add Tokens">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Adding tokens for <span className="text-foreground font-medium">{addTokenModal.email}</span></p>
          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Token Amount</label>
            <input className="input-field w-full" type="number" min={1} value={tokenAmount} onChange={(e) => setTokenAmount(Math.max(0, parseInt(e.target.value) || 0))} placeholder="Enter amount..." />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setAddTokenModal({ open: false, userId: '', email: '' })} className="btn-secondary">Cancel</button>
            <button onClick={handleAddTokens} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving && <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
              Add Tokens
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.action === 'block' ? 'Toggle Block Status' : 'Disable Plan'}
        message={
          confirmDialog.action === 'block'
            ? `Are you sure you want to change the block status for ${confirmDialog.email}?`
            : `Remove the plan for ${confirmDialog.email}? Their tokens will be reset.`
        }
        confirmLabel="Confirm"
        confirmVariant="destructive"
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmDialog({ open: false, action: '', userId: '', email: '' })}
        loading={saving}
      />
    </>
  );
};

export default UsersPage;
