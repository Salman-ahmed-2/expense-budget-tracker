import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight, MoreHorizontal, Sparkles } from "lucide-react";
import { monthlyData, expenseCategories, transactions, insights } from "../data/mockData";

const stats = [
  { label: "Total Balance", value: "$48,290.50", change: "+8.2%", up: true, icon: Wallet, color: "from-emerald-500/20 to-emerald-600/5", iconColor: "text-emerald-400", border: "border-emerald-500/20" },
  { label: "Monthly Income", value: "$14,500.00", change: "+12.4%", up: true, icon: TrendingUp, color: "from-blue-500/20 to-blue-600/5", iconColor: "text-blue-400", border: "border-blue-500/20" },
  { label: "Monthly Expenses", value: "$8,200.00", change: "+3.1%", up: false, icon: TrendingDown, color: "from-red-500/20 to-red-600/5", iconColor: "text-red-400", border: "border-red-500/20" },
  { label: "Net Savings", value: "$6,300.00", change: "+21.7%", up: true, icon: PiggyBank, color: "from-purple-500/20 to-purple-600/5", iconColor: "text-purple-400", border: "border-purple-500/20" },
];

const categoryColors: Record<string, string> = {
  Income: "#10B981",
  "Food & Dining": "#F59E0B",
  Transport: "#3B82F6",
  Entertainment: "#8B5CF6",
  Healthcare: "#EF4444",
  Shopping: "#EC4899",
  Utilities: "#06B6D4",
  Education: "#F97316",
  Housing: "#3B82F6",
};

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

export default function Dashboard() {
  const [period, setPeriod] = useState("12M");

  const slicedData = period === "3M" ? monthlyData.slice(-3) : period === "6M" ? monthlyData.slice(-6) : monthlyData;

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Good morning, Salman</h1>
          <p className="text-slate-500 text-sm mt-1">Here's your financial overview for December 2024</p>
        </div>
        <div className="flex gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
          {["3M", "6M", "12M"].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${period === p ? "bg-emerald-500 text-slate-900" : "text-slate-400 hover:text-slate-200"}`}
            >
              {p}
            </button>
          ))}
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
              <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg ${up ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>
                {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {change}
              </span>
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
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={slicedData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
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
        </div>

        {/* Pie chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <div className="mb-4">
            <h2 className="text-white font-semibold">Expense Breakdown</h2>
            <p className="text-slate-500 text-xs mt-0.5">By category this month</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {expenseCategories.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {expenseCategories.slice(0, 4).map(cat => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-400 text-xs flex-1 truncate">{cat.name}</span>
                <span className="text-slate-300 text-xs font-mono font-medium">${cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
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
            {transactions.slice(0, 6).map(t => (
              <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors group">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0" style={{ backgroundColor: `${categoryColors[t.category] || "#64748B"}18` }}>
                  {t.type === "income" ? "IN" : t.category === "Entertainment" ? "EN" : t.category === "Food & Dining" ? "FD" : t.category === "Transport" ? "TR" : t.category === "Shopping" ? "SH" : t.category === "Healthcare" ? "HC" : "EX"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm font-medium truncate">{t.name}</p>
                  <p className="text-slate-600 text-xs">{t.category} · {t.date}</p>
                </div>
                <span className={`text-sm font-bold font-mono ${t.amount > 0 ? "text-emerald-400" : "text-slate-300"}`}>
                  {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={16} className="text-purple-400" />
            <div>
              <h2 className="text-white font-semibold">AI Insights</h2>
              <p className="text-slate-500 text-xs">Smart financial observations</p>
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
