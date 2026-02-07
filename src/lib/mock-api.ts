// Real API layer - connects to backend at localhost:5000
// All admin data comes from the backend MongoDB database

const API_BASE = 'http://localhost:5000/api/admin';
const ADMIN_KEY = 'admin-secret-2024';

export interface DashboardStats {
  totalUsers: number;
  freeUsers: number;
  paidUsers: number;
  totalTokensUsed: number;
  totalRevenueINR: number;
  totalRevenueUSD: number;
  activeAIProvider: string;
}

export interface Plan {
  id: string;
  name: string;
  tokenLimit: number;
  priceINR: number;
  priceUSD: number;
  currencyVisibility: 'INR' | 'USD' | 'BOTH';
  active: boolean;
}

export interface TokenAddon {
  id: string;
  name: string;
  extraTokens: number;
  priceINR: number;
  priceUSD: number;
  currencyVisibility: 'INR' | 'USD' | 'BOTH';
  active: boolean;
}

export interface User {
  id: string;
  email: string;
  userType: 'Free' | 'Paid';
  planName: string | null;
  tokensUsed: number;
  tokensRemaining: number;
  paymentStatus: 'Paid' | 'Pending' | 'N/A';
  blocked: boolean;
  joinedAt: string;
}

export interface PaymentConfig {
  razorpayKeyId: string;
  razorpayKeySecret: string;
  mode: 'Test' | 'Live';
  allowedCurrency: 'INR' | 'USD';
}

export interface AIConfig {
  provider: 'OpenAI' | 'Anthropic' | 'Google';
  apiKey: string;
  model: string;
  enabled: boolean;
}

export interface TokenRules {
  guestFreeTokens: number;
  loggedInFreeTokens: number;
  tokensPerWord: number;
}

// Provider-specific models
export const AI_MODELS: Record<string, string[]> = {
  OpenAI: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  Anthropic: ['claude-3.5-sonnet', 'claude-3-opus', 'claude-3-haiku'],
  Google: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'],
};

// ─── HTTP Helper ────────────────────────────────────────────────────────────
async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'X-Admin-Key': ADMIN_KEY },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error ${res.status}`);
  }
  return res.json();
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': ADMIN_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error ${res.status}`);
  }
  return res.json();
}

async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': ADMIN_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error ${res.status}`);
  }
  return res.json();
}

// ─── API Methods ────────────────────────────────────────────────────────────
export const api = {
  // Dashboard
  getDashboard: () => apiGet<DashboardStats>('/dashboard'),

  // Plans
  getPlans: () => apiGet<Plan[]>('/plans'),
  createPlan: (plan: Omit<Plan, 'id'>) => apiPost<Plan>('/plans', plan),
  updatePlan: (id: string, data: Partial<Plan>) => apiPut<Plan>(`/plans/${id}`, data),

  // Token Addons
  getTokenAddons: () => apiGet<TokenAddon[]>('/token-addons'),
  createTokenAddon: (addon: Omit<TokenAddon, 'id'>) => apiPost<TokenAddon>('/token-addons', addon),
  updateTokenAddon: (id: string, data: Partial<TokenAddon>) => apiPut<TokenAddon>(`/token-addons/${id}`, data),

  // Users
  getUsers: () => apiGet<User[]>('/users'),
  addTokens: (userId: string, tokens: number) =>
    apiPost<User>('/users/add-tokens', { userId, tokens }),
  toggleBlockUser: (userId: string) =>
    apiPost<User>('/users/block', { userId }),
  disableUserPlan: (userId: string) =>
    apiPost<User>('/users/disable-plan', { userId }),

  // Payment Config
  getPaymentConfig: () => apiGet<PaymentConfig>('/payment-config'),
  updatePaymentConfig: (config: PaymentConfig) =>
    apiPost<PaymentConfig>('/payment-config', config),

  // AI Config
  getAIConfig: () => apiGet<AIConfig>('/ai-config'),
  updateAIConfig: (config: AIConfig) =>
    apiPost<AIConfig>('/ai-config', config),

  // Token Rules
  getTokenRules: () => apiGet<TokenRules>('/token-rules'),
  updateTokenRules: (rules: TokenRules) =>
    apiPost<TokenRules>('/token-rules', rules),
};
