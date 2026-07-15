import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { getTransactions, type Transaction } from "../services/api";

const catColors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#EC4899", "#06B6D4", "#F97316"];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800/95 border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-red-400 text-sm font-bold">${payload[0].value.toLocaleString()}</p>
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

export default function Expenses() {
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
          <p className="text-slate-400 text-sm">Loading expense data...</p>
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

  const expenseTransactions = transactions.filter(t => t.type?.toLowerCase() === "expense");
  const total = expenseTransactions.reduce((s, t) => s + t.amount, 0);

  // Group by category
  const catMap = new Map<string, number>();
  expenseTransactions.forEach(t => {
    const cat = t.category_name || "Other";
    catMap.set(cat, (catMap.get(cat) || 0) + t.amount);
  });
  const expenseCategories = Array.from(catMap.entries())
    .map(([name, value], i) => ({
      name,
      value,
      color: catColors[i % catColors.length],
      icon: name.slice(0, 2).toUpperCase(),
    }))
    .sort((a, b) => b.value - a.value);

  // Group by month
  const monthMap = new Map<string, number>();
  expenseTransactions.forEach(t => {
    const d = new Date(t.date);
    const key = d.toLocaleString("default", { month: "short" });
    monthMap.set(key, (monthMap.get(key) || 0) + t.amount);
  });
  const monthlyData = Array.from(monthMap.entries()).map(([month, expenses]) => ({ month, expenses }));

  const topCategory = expenseCategories.length > 0 ? expenseCategories[0] : null;

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-white text-2xl font-bold">Expenses</h1>
        <p className="text-slate-500 text-sm mt-1">Monitor your spending patterns</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Spent", value: `$${total.toLocaleString()}`, sub: `${expenseTransactions.length} transactions`, up: false, color: "from-red-500/15 to-red-600/5 border-red-500/20" },
          { label: "Daily Average", value: `$${total > 0 ? (total / 30).toFixed(0) : "0"}`, sub: "Per day this month", up: false, color: "from-orange-500/15 to-orange-600/5 border-orange-500/20" },
          { label: "Top Category", value: topCategory?.name || "—", sub: topCategory ? `$${topCategory.value.toLocaleString()} · ${total > 0 ? ((topCategory.value / total) * 100).toFixed(0) : 0}% of total` : "No data", up: true, color: "from-blue-500/15 to-blue-600/5 border-blue-500/20" },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-5`}>
            <p className="text-slate-500 text-xs mb-2">{s.label}</p>
            <p className="text-white text-2xl font-bold font-mono">{s.value}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${!s.up ? "text-red-400" : "text-slate-400"}`}>
              {!s.up ? <ArrowUpRight size={12} /> : null}{s.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Trend */}
        <div className="xl:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <div className="mb-6">
            <h2 className="text-white font-semibold">Spending Trend</h2>
            <p className="text-slate-500 text-xs mt-0.5">Monthly expenses</p>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2.5} fill="url(#expGrad)" dot={false} activeDot={{ r: 5, fill: "#EF4444" }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-slate-500 text-sm">No expense data yet</div>
          )}
        </div>

        {/* Pie */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <div className="mb-4">
            <h2 className="text-white font-semibold">Category Split</h2>
            <p className="text-slate-500 text-xs mt-0.5">Spending distribution</p>
          </div>
          {expenseCategories.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {expenseCategories.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5">
                {expenseCategories.slice(0, 5).map(cat => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-400 text-xs flex-1">{cat.name}</span>
                    <span className="text-slate-400 text-xs">{total > 0 ? ((cat.value / total) * 100).toFixed(0) : 0}%</span>
                    <span className="text-slate-300 text-xs font-mono">${cat.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">No expense data yet</div>
          )}
        </div>
      </div>

      {/* Categories */}
      {expenseCategories.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-5">Spending Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {expenseCategories.map(cat => (
              <div key={cat.name} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-slate-300 text-sm font-medium">{cat.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{total > 0 ? ((cat.value / total) * 100).toFixed(0) : 0}%</span>
                </div>
                <p className="text-white text-lg font-bold font-mono">${cat.value.toLocaleString()}</p>
                <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${total > 0 ? (cat.value / total) * 100 : 0}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense transactions */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4">Recent Expenses</h2>
        <div className="space-y-1">
          {expenseTransactions.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">No expense transactions yet</div>
          ) : (
            expenseTransactions.map(t => (
              <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-sm font-semibold shrink-0">EX</div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm font-medium truncate">{t.description || "Expense"}</p>
                  <p className="text-slate-600 text-xs">{t.category_name || "Other"} · {t.date}</p>
                </div>
                <span className="text-slate-300 text-sm font-bold font-mono">-${Math.abs(t.amount).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
