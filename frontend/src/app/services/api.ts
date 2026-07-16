const API_BASE = '/api';

async function request(url: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || 'Request failed');
  }

  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────

export function login(data: any): Promise<any> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function register(data: any): Promise<any> {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Transactions ────────────────────────────────────────────────

export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  category_id: number;
  category_name: string;
  date: string;
  description: string;
  type: string; // 'Income' | 'Expense'
}

export function getTransactions(): Promise<Transaction[]> {
  return request('/transactions');
}

export function addTransaction(data: {
  amount: number;
  category_id: number;
  date: string;
  description: string;
  type: string;
}): Promise<Transaction> {
  return request('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTransaction(
  id: number,
  data: {
    amount: number;
    category_id: number;
    date: string;
    description: string;
    type: string;
  }
): Promise<{ message: string }> {
  return request(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteTransaction(id: number): Promise<{ message: string }> {
  return request(`/transactions/${id}`, {
    method: 'DELETE',
  });
}

// ─── Categories ──────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
}

export function getCategories(): Promise<Category[]> {
  return request('/categories');
}

export function addCategory(name: string): Promise<Category> {
  return request('/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

// ─── Budgets ─────────────────────────────────────────────────────

export interface Budget {
  id: number;
  user_id: number;
  category_id: number;
  category_name: string;
  month: string;
  limit_amount: number;
}

export function getBudgets(): Promise<Budget[]> {
  return request('/budgets');
}

export function addBudget(data: {
  category_id: number;
  month: string;
  limit_amount: number;
}): Promise<Budget> {
  return request('/budgets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deleteBudget(id: number): Promise<{ message: string }> {
  return request(`/budgets/${id}`, {
    method: 'DELETE',
  });
}

// ─── Dashboard ───────────────────────────────────────────────────

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  netSavings: number;
  transactionCount: number;
  recentTransactions: Transaction[];
  expensesByCategory: { category: string; total: number }[];
  budgetStatus: (Budget & { spent: number })[];
}

export function getDashboardSummary(): Promise<DashboardSummary> {
  return request('/dashboard/summary');
}
