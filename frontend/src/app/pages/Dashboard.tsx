import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight, MoreHorizontal, Sparkles, Loader2 } from "lucide-react";
import { getDashboardSummary, getTransactions, type Transaction, type DashboardSummary } from "../services/api";

const categoryColors: Record<string, string> = {
  Income: "#10B981",
  "Food & Dining": "#F59E0B",
  Food: "#F59E0B",
  Transport: "#3B82F6",
  Travel: "#3B82F6",
  Entertainment: "#8B5CF6",
  Healthcare: "#EF4444",
  Shopping: "#EC4899",
  Utilities: "#06B6D4",
  Education: "#F97316",
  Housing: "#3B82F6",
};

const pieColors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#EC4899", "#06B6D4", "#F97316"];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800/95 border border-white/10 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800/95 border border-white/10 rounded-xl px-3 py-2 shadow-2xl">
      <p className="text-white text-sm font-semibold">{payload[0].name}</p>
      <p className="text-slate-400 text-xs">${payload[0].value.toLocaleString()}</p>
    </div>
  );
}

function getIconCode(transaction: Transaction) {
  const type = transaction.type?.toLowerCase();
  if (type === "income") return "IN";
  const cat = transaction.category_name || "";
  if (cat.includes("Entertainment")) return "EN";
  if (cat.includes("Food") || cat.includes("Dining")) return "FD";
  if (cat.includes("Transport") || cat.includes("Travel")) return "TR";
  if (cat.includes("Shopping")) return "SH";
  if (cat.includes("Health")) return "HC";
  return "EX";
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryData, txData] = await Promise.all([
          getDashboardSummary(),
          getTransactions(),
        ]);
        setSummary(summaryData);
        setAllTransactions(txData);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading dashboard...</p>
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
          <p className="text-slate-500 text-xs mt-3">Make sure the backend server is running on port 3000</p>
        </div>
      </div>
    );
  }

  const totalIncome = summary?.totalIncome || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const balance = summary?.balance || 0;
  const netSavings = summary?.netSavings || 0;
  const recentTransactions = summary?.recentTransactions || [];
  const expensesByCategory = summary?.expensesByCategory || [];

  const stats = [
    { label: "Total Balance", value: `$${balance.toLocaleString()}`, change: "", up: true, icon: Wallet, color: "from-emerald-500/20 to-emerald-600/5", iconColor: "text-emerald-400", border: "border-emerald-500/20" },
    { label: "Total Income", value: `$${totalIncome.toLocaleString()}`, change: "", up: true, icon: TrendingUp, color: "from-blue-500/20 to-blue-600/5", iconColor: "text-blue-400", border: "border-blue-500/20" },
    { label: "Total Expenses", value: `$${totalExpenses.toLocaleString()}`, change: "", up: false, icon: TrendingDown, color: "from-red-500/20 to-red-600/5", iconColor: "text-red-400", border: "border-red-500/20" },
    { label: "Net Savings", value: `$${netSavings.toLocaleString()}`, change: "", up: true, icon: PiggyBank, color: "from-purple-500/20 to-purple-600/5", iconColor: "text-purple-400", border: "border-purple-500/20" },
  ];

  // Build pie chart data from expensesByCategory
  const pieData = expensesByCategory.map((e, i) => ({
    name: e.category || "Uncategorized",
    value: e.total,
    color: pieColors[i % pieColors.length],
  }));

  // Build a "monthly" chart from transaction data grouped by month
  const monthMap = new Map<string, { income: number; expenses: number }>();
  allTransactions.forEach(t => {
    const d = new Date(t.date);
    const key = d.toLocaleString("default", { month: "short", year: "numeric" });
    if (!monthMap.has(key)) monthMap.set(key, { income: 0, expenses: 0 });
    const entry = monthMap.get(key)!;
    if (t.type?.toLowerCase() === "income") entry.income += t.amount;
    else entry.expenses += t.amount;
  });
  const monthlyData = Array.from(monthMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => {
      const da = new Date(a.month);
      const db = new Date(b.month);
      return da.getTime() - db.getTime();
    });

  const insights = [
    {
      id: 1,
      title: `${summary?.transactionCount || 0} transactions recorded`,
      desc: `Total income: $${totalIncome.toLocaleString()}, Total expenses: $${totalExpenses.toLocaleString()}`,
      type: "info",
      icon: "i",
    },
    {
      id: 2,
      title: netSavings > 0 ? "Positive savings" : "Spending exceeds income",
      desc: netSavings > 0
        ? `You've saved $${netSavings.toLocaleString()} overall. Keep it up!`
        : `You're over by $${Math.abs(netSavings).toLocaleString()}. Review your spending.`,
      type: netSavings > 0 ? "success" : "warning",
      icon: netSavings > 0 ? "✓" : "!",
    },
    ...(expensesByCategory.length > 0 ? [{
      id: 3,
      title: `Top expense: ${expensesByCategory[0].category}`,
      desc: `$${expensesByCategory[0].total.toLocaleString()} spent on ${expensesByCategory[0].category}`,
      type: "neutral" as const,
      icon: "•",
    }] : []),
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Good morning, Salman</h1>
          <p className="text-slate-500 text-sm mt-1">Here's your financial overview</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, up, icon: Icon, color, iconColor, border }) => (
          <div key={label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} border ${border} p-5 backdrop-blur-sm`} style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center ${iconColor}`}>
                <Icon size={20} />
              </div>
              {change && (
                <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg ${up ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>
                  {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {change}
                </span>
              )}
            </div>
            <p className="text-white text-xl font-bold font-mono tracking-tight">{value}</p>
            <p className="text-slate-500 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Area chart */}
        <div className="xl:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-semibold">Income vs Expenses</h2>
              <p className="text-slate-500 text-xs mt-0.5">Monthly comparison over time</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-emerald-400 inline-block" />Income</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-red-400 inline-block" />Expenses</span>
            </div>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 4, fill: "#10B981" }} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#EF4444" strokeWidth={2} fill="url(#expenseGrad)" dot={false} activeDot={{ r: 4, fill: "#EF4444" }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-slate-500 text-sm">No transaction data yet</div>
          )}
        </div>

        {/* Pie chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <div className="mb-4">
            <h2 className="text-white font-semibold">Expense Breakdown</h2>
            <p className="text-slate-500 text-xs mt-0.5">By category</p>
          </div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.slice(0, 4).map(cat => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-400 text-xs flex-1 truncate">{cat.name}</span>
                    <span className="text-slate-300 text-xs font-mono font-medium">${cat.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">No expense data yet</div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent transactions */}
        <div className="xl:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold">Recent Transactions</h2>
              <p className="text-slate-500 text-xs mt-0.5">Your latest financial activity</p>
            </div>
            <a href="/transactions" className="text-emerald-400 hover:text-emerald-300 text-xs font-medium transition-colors">View all →</a>
          </div>
          <div className="space-y-1">
            {recentTransactions.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm">No transactions yet. Add one to get started!</div>
            ) : (
              recentTransactions.slice(0, 6).map(t => {
                const isIncome = t.type?.toLowerCase() === "income";
                const catName = t.category_name || "Other";
                return (
                  <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors group">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0" style={{ backgroundColor: `${categoryColors[catName] || "#64748B"}18` }}>
                      {getIconCode(t)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 text-sm font-medium truncate">{t.description || "Transaction"}</p>
                      <p className="text-slate-600 text-xs">{catName} · {t.date}</p>
                    </div>
                    <span className={`text-sm font-bold font-mono ${isIncome ? "text-emerald-400" : "text-slate-300"}`}>
                      {isIncome ? "+" : "-"}${Math.abs(t.amount).toFixed(2)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={16} className="text-purple-400" />
            <div>
              <h2 className="text-white font-semibold">Insights</h2>
              <p className="text-slate-500 text-xs">Financial observations</p>
            </div>
          </div>
          <div className="space-y-3">
            {insights.map(ins => (
              <div key={ins.id} className={`rounded-xl p-3.5 border ${
                ins.type === "warning" ? "bg-amber-500/8 border-amber-500/20" :
                ins.type === "success" ? "bg-emerald-500/8 border-emerald-500/20" :
                ins.type === "info" ? "bg-blue-500/8 border-blue-500/20" :
                "bg-white/[0.03] border-white/[0.06]"
              }`}>
                <div className="flex items-start gap-2.5">
                  <span className="text-base shrink-0">{ins.icon}</span>
                  <div>
                    <p className="text-slate-200 text-xs font-semibold">{ins.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{ins.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
