// Mock API layer - simulates backend responses
// All data here would come from real API endpoints in production

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

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// --- Mock Data Store ---
let dashboardStats: DashboardStats = {
  totalUsers: 12847,
  freeUsers: 9623,
  paidUsers: 3224,
  totalTokensUsed: 8456230,
  totalRevenueINR: 2456780,
  totalRevenueUSD: 29450,
  activeAIProvider: 'OpenAI',
};

let plans: Plan[] = [
  { id: '1', name: 'Normal', tokenLimit: 5000, priceINR: 0, priceUSD: 0, currencyVisibility: 'BOTH', active: true },
  { id: '2', name: 'Pro', tokenLimit: 50000, priceINR: 499, priceUSD: 5.99, currencyVisibility: 'BOTH', active: true },
  { id: '3', name: 'Advance', tokenLimit: 200000, priceINR: 1499, priceUSD: 17.99, currencyVisibility: 'BOTH', active: true },
];

let tokenAddons: TokenAddon[] = [
  { id: '1', name: 'Small Top-up', extraTokens: 5000, priceINR: 99, priceUSD: 1.19, currencyVisibility: 'BOTH', active: true },
  { id: '2', name: 'Medium Top-up', extraTokens: 20000, priceINR: 299, priceUSD: 3.59, currencyVisibility: 'BOTH', active: true },
  { id: '3', name: 'Large Top-up', extraTokens: 50000, priceINR: 599, priceUSD: 7.19, currencyVisibility: 'INR', active: true },
];

let users: User[] = [
  { id: '1', email: 'rahul@gmail.com', userType: 'Paid', planName: 'Pro', tokensUsed: 23450, tokensRemaining: 26550, paymentStatus: 'Paid', blocked: false, joinedAt: '2025-12-01' },
  { id: '2', email: 'priya@yahoo.com', userType: 'Free', planName: null, tokensUsed: 3200, tokensRemaining: 1800, paymentStatus: 'N/A', blocked: false, joinedAt: '2025-12-15' },
  { id: '3', email: 'john@outlook.com', userType: 'Paid', planName: 'Advance', tokensUsed: 145000, tokensRemaining: 55000, paymentStatus: 'Paid', blocked: false, joinedAt: '2025-11-20' },
  { id: '4', email: 'sarah@gmail.com', userType: 'Free', planName: null, tokensUsed: 4800, tokensRemaining: 200, paymentStatus: 'N/A', blocked: true, joinedAt: '2026-01-05' },
  { id: '5', email: 'amit@company.co', userType: 'Paid', planName: 'Pro', tokensUsed: 48000, tokensRemaining: 2000, paymentStatus: 'Paid', blocked: false, joinedAt: '2025-10-10' },
  { id: '6', email: 'lisa@startup.io', userType: 'Free', planName: null, tokensUsed: 1200, tokensRemaining: 3800, paymentStatus: 'N/A', blocked: false, joinedAt: '2026-01-20' },
  { id: '7', email: 'raj@dev.com', userType: 'Paid', planName: 'Normal', tokensUsed: 2300, tokensRemaining: 2700, paymentStatus: 'Pending', blocked: false, joinedAt: '2026-01-28' },
];

let paymentConfig: PaymentConfig = {
  razorpayKeyId: 'rzp_test_1234567890',
  razorpayKeySecret: 'sk_test_**************',
  mode: 'Test',
  allowedCurrency: 'INR',
};

let aiConfig: AIConfig = {
  provider: 'OpenAI',
  apiKey: 'sk-**************',
  model: 'gpt-4o',
  enabled: true,
};

let tokenRules: TokenRules = {
  guestFreeTokens: 500,
  loggedInFreeTokens: 5000,
  tokensPerWord: 2,
};

// --- API Methods ---

// Dashboard
export const api = {
  // GET /api/admin/dashboard
  getDashboard: async (): Promise<DashboardStats> => {
    await delay(600);
    return { ...dashboardStats };
  },

  // GET /api/admin/plans
  getPlans: async (): Promise<Plan[]> => {
    await delay(400);
    return [...plans];
  },

  // POST /api/admin/plans
  createPlan: async (plan: Omit<Plan, 'id'>): Promise<Plan> => {
    await delay(500);
    const newPlan = { ...plan, id: String(Date.now()) };
    plans.push(newPlan);
    return newPlan;
  },

  // PUT /api/admin/plans/:id
  updatePlan: async (id: string, data: Partial<Plan>): Promise<Plan> => {
    await delay(500);
    const index = plans.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Plan not found');
    plans[index] = { ...plans[index], ...data };
    return plans[index];
  },

  // GET /api/admin/token-addons
  getTokenAddons: async (): Promise<TokenAddon[]> => {
    await delay(400);
    return [...tokenAddons];
  },

  // POST /api/admin/token-addons
  createTokenAddon: async (addon: Omit<TokenAddon, 'id'>): Promise<TokenAddon> => {
    await delay(500);
    const newAddon = { ...addon, id: String(Date.now()) };
    tokenAddons.push(newAddon);
    return newAddon;
  },

  updateTokenAddon: async (id: string, data: Partial<TokenAddon>): Promise<TokenAddon> => {
    await delay(500);
    const index = tokenAddons.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Add-on not found');
    tokenAddons[index] = { ...tokenAddons[index], ...data };
    return tokenAddons[index];
  },

  // GET /api/admin/users
  getUsers: async (): Promise<User[]> => {
    await delay(500);
    return [...users];
  },

  // POST /api/admin/users/add-tokens
  addTokens: async (userId: string, tokens: number): Promise<User> => {
    await delay(500);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    users[index].tokensRemaining += tokens;
    return users[index];
  },

  // POST /api/admin/users/block
  toggleBlockUser: async (userId: string): Promise<User> => {
    await delay(500);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    users[index].blocked = !users[index].blocked;
    return users[index];
  },

  disableUserPlan: async (userId: string): Promise<User> => {
    await delay(500);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    users[index].planName = null;
    users[index].userType = 'Free';
    users[index].paymentStatus = 'N/A';
    return users[index];
  },

  // GET /api/admin/payment-config
  getPaymentConfig: async (): Promise<PaymentConfig> => {
    await delay(400);
    return { ...paymentConfig };
  },

  // POST /api/admin/payment-config
  updatePaymentConfig: async (config: PaymentConfig): Promise<PaymentConfig> => {
    await delay(600);
    paymentConfig = { ...config };
    return paymentConfig;
  },

  // GET /api/admin/ai-config
  getAIConfig: async (): Promise<AIConfig> => {
    await delay(400);
    return { ...aiConfig };
  },

  // POST /api/admin/ai-config
  updateAIConfig: async (config: AIConfig): Promise<AIConfig> => {
    await delay(600);
    aiConfig = { ...config };
    dashboardStats.activeAIProvider = config.provider;
    return aiConfig;
  },

  // GET /api/admin/token-rules
  getTokenRules: async (): Promise<TokenRules> => {
    await delay(400);
    return { ...tokenRules };
  },

  // POST /api/admin/token-rules
  updateTokenRules: async (rules: TokenRules): Promise<TokenRules> => {
    await delay(600);
    tokenRules = { ...rules };
    return tokenRules;
  },
};
