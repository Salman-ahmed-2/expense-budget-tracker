import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import { Download, TrendingUp, TrendingDown, DollarSign, PiggyBank, Loader2 } from "lucide-react";
import { getTransactions, type Transaction } from "../services/api";

const catColors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#EC4899", "#06B6D4", "#F97316"];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800/95 border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-sm font-semibold" style={{ color: p.color || p.fill }}>
          {p.name}: ${p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function Reports() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTransactions()
      .then(data => setTransactions(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-md">
          <p className="text-red-400 font-semibold mb-2">Failed to load</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Group by month
  const monthMap = new Map<string, { income: number; expenses: number; monthKey: string }>();
  transactions.forEach(t => {
    const d = new Date(t.date);
    const key = d.toLocaleString("default", { month: "short" });
    const sortKey = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    if (!monthMap.has(key)) monthMap.set(key, { income: 0, expenses: 0, monthKey: sortKey });
    const entry = monthMap.get(key)!;
    if (t.type?.toLowerCase() === "income") entry.income += t.amount;
    else entry.expenses += t.amount;
  });
  const monthlyData = Array.from(monthMap.entries())
    .map(([month, data]) => ({ month, income: data.income, expenses: data.expenses, monthKey: data.monthKey }))
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));

  const netSavings = monthlyData.map(m => ({ ...m, net: m.income - m.expenses }));

  // Expense categories for pie
  const catMap = new Map<string, number>();
  transactions.filter(t => t.type?.toLowerCase() === "expense").forEach(t => {
    const cat = t.category_name || "Other";
    catMap.set(cat, (catMap.get(cat) || 0) + t.amount);
  });
  const expenseCategories = Array.from(catMap.entries())
    .map(([name, value], i) => ({ name, value, color: catColors[i % catColors.length] }))
    .sort((a, b) => b.value - a.value);

  const totalIncome = transactions.filter(t => t.type?.toLowerCase() === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type?.toLowerCase() === "expense").reduce((s, t) => s + t.amount, 0);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(1) : "0.0";

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Comprehensive financial analytics</p>
        </div>
        <button className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-slate-300 transition-all">
          <Download size={14} /> Export
        </button>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Income", value: `$${totalIncome.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-400", bg: "from-emerald-500/10 border-emerald-500/20" },
          { label: "Total Expenses", value: `$${totalExpenses.toLocaleString()}`, icon: TrendingDown, color: "text-red-400", bg: "from-red-500/10 border-red-500/20" },
          { label: "Total Savings", value: `$${totalSavings.toLocaleString()}`, icon: PiggyBank, color: "text-blue-400", bg: "from-blue-500/10 border-blue-500/20" },
          { label: "Savings Rate", value: `${savingsRate}%`, icon: DollarSign, color: "text-purple-400", bg: "from-purple-500/10 border-purple-500/20" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`bg-gradient-to-br ${bg} to-transparent border rounded-2xl p-5`}>
            <div className={`w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center ${color} mb-3`}>
              <Icon size={18} />
            </div>
            <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
            <p className="text-slate-500 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Income vs Expenses bar */}
      {monthlyData.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-semibold">Income vs Expenses — Monthly</h2>
              <p className="text-slate-500 text-xs mt-0.5">Side-by-side comparison</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-emerald-400 inline-block" />Income</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-red-400 inline-block" />Expenses</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} opacity={0.85} />
              <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Net savings + pie */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <div className="mb-6">
            <h2 className="text-white font-semibold">Net Savings Trend</h2>
            <p className="text-slate-500 text-xs mt-0.5">Monthly savings (income minus expenses)</p>
          </div>
          {netSavings.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={netSavings} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="net" name="Net Savings" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#netGrad)" dot={false} activeDot={{ r: 5, fill: "#8B5CF6" }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">No data yet</div>
          )}
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <div className="mb-4">
            <h2 className="text-white font-semibold">Expense Mix</h2>
            <p className="text-slate-500 text-xs mt-0.5">All categories combined</p>
          </div>
          {expenseCategories.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={expenseCategories} cx="50%" cy="50%" outerRadius={70} paddingAngle={2} dataKey="value">
                    {expenseCategories.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`$${v.toLocaleString()}`, ""]} contentStyle={{ backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#F8FAFC" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                {expenseCategories.map(cat => (
                  <div key={cat.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-500 text-[11px] truncate">{cat.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">No expense data yet</div>
          )}
        </div>
      </div>

      {/* Monthly breakdown table */}
      {monthlyData.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h2 className="text-white font-semibold">Monthly Breakdown</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {["Month", "Income", "Expenses", "Net Savings", "Savings Rate"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {monthlyData.map(m => {
                const net = m.income - m.expenses;
                const rate = m.income > 0 ? ((net / m.income) * 100).toFixed(1) : "0.0";
                return (
                  <tr key={m.month} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-slate-300 text-sm font-medium">{m.month}</td>
                    <td className="px-5 py-3 text-emerald-400 text-sm font-mono font-semibold">+${m.income.toLocaleString()}</td>
                    <td className="px-5 py-3 text-red-400 text-sm font-mono font-semibold">-${m.expenses.toLocaleString()}</td>
                    <td className="px-5 py-3 text-blue-400 text-sm font-mono font-semibold">${net.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-purple-500" style={{ width: `${Math.max(0, Math.min(100, Number(rate)))}%` }} />
                        </div>
                        <span className="text-purple-400 text-xs font-semibold">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
