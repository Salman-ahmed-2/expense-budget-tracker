import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { getTransactions, type Transaction } from "../services/api";

const sourceColors = ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4", "#F97316"];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800/95 border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-emerald-400 text-sm font-bold">${payload[0].value.toLocaleString()}</p>
    </div>
  );
}

export default function Income() {
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
          <p className="text-slate-400 text-sm">Loading income data...</p>
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

  const incomeTransactions = transactions.filter(t => t.type?.toLowerCase() === "income");
  const totalIncome = incomeTransactions.reduce((s, t) => s + t.amount, 0);

  // Group by category as "income sources"
  const sourceMap = new Map<string, number>();
  incomeTransactions.forEach(t => {
    const cat = t.category_name || "Other";
    sourceMap.set(cat, (sourceMap.get(cat) || 0) + t.amount);
  });
  const incomeSources = Array.from(sourceMap.entries())
    .map(([name, value], i) => ({ name, value, color: sourceColors[i % sourceColors.length] }))
    .sort((a, b) => b.value - a.value);

  // Group by month for chart
  const monthMap = new Map<string, number>();
  incomeTransactions.forEach(t => {
    const d = new Date(t.date);
    const key = d.toLocaleString("default", { month: "short" });
    monthMap.set(key, (monthMap.get(key) || 0) + t.amount);
  });
  const monthlyData = Array.from(monthMap.entries()).map(([month, income]) => ({ month, income }));

  const avgMonthly = monthlyData.length > 0 ? Math.round(totalIncome / monthlyData.length) : 0;
  const bestMonth = monthlyData.length > 0 ? monthlyData.reduce((a, b) => b.income > a.income ? b : a) : { month: "—", income: 0 };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-white text-2xl font-bold">Income</h1>
        <p className="text-slate-500 text-sm mt-1">Track all your revenue streams</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Income", value: `$${totalIncome.toLocaleString()}`, sub: `${incomeTransactions.length} transactions`, up: true, color: "from-emerald-500/15 to-emerald-600/5 border-emerald-500/20" },
          { label: "Monthly Average", value: `$${avgMonthly.toLocaleString()}`, sub: `Based on ${monthlyData.length} months`, up: true, color: "from-blue-500/15 to-blue-600/5 border-blue-500/20" },
          { label: "Best Month", value: `$${bestMonth.income.toLocaleString()}`, sub: bestMonth.month, up: true, color: "from-purple-500/15 to-purple-600/5 border-purple-500/20" },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-5`}>
            <p className="text-slate-500 text-xs mb-2">{s.label}</p>
            <p className="text-white text-2xl font-bold font-mono">{s.value}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${s.up ? "text-emerald-400" : "text-red-400"}`}>
              {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Area chart */}
        <div className="xl:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <div className="mb-6">
            <h2 className="text-white font-semibold">Income Trend</h2>
            <p className="text-slate-500 text-xs mt-0.5">Monthly income overview</p>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="incomeArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2.5} fill="url(#incomeArea)" dot={false} activeDot={{ r: 5, fill: "#10B981", stroke: "#0F172A", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-slate-500 text-sm">No income data yet</div>
          )}
        </div>

        {/* Sources bar */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <div className="mb-6">
            <h2 className="text-white font-semibold">Income Sources</h2>
            <p className="text-slate-500 text-xs mt-0.5">Revenue breakdown</p>
          </div>
          {incomeSources.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={incomeSources} layout="vertical" margin={{ left: 0, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {incomeSources.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">No income sources yet</div>
          )}
        </div>
      </div>

      {/* Sources list */}
      {incomeSources.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Income Streams</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {incomeSources.map(src => (
              <div key={src.name} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: `${src.color}20` }}>
                  {src.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm font-semibold">{src.name}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-white text-base font-bold font-mono">${src.value.toLocaleString()}</p>
                    <span className="text-xs text-slate-500">{totalIncome > 0 ? ((src.value / totalIncome) * 100).toFixed(0) : 0}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Income transactions */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4">Income History</h2>
        <div className="space-y-1">
          {incomeTransactions.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">No income transactions yet</div>
          ) : (
            incomeTransactions.map(t => (
              <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-sm font-semibold shrink-0">IN</div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm font-medium truncate">{t.description || "Income"}</p>
                  <p className="text-slate-600 text-xs">{t.category_name || "Other"} · {t.date}</p>
                </div>
                <span className="text-emerald-400 text-sm font-bold font-mono">+${t.amount.toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
