import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { monthlyData, expenseCategories, transactions } from "../data/mockData";

const expenseTransactions = transactions.filter(t => t.type === "expense");

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
  const total = expenseCategories.reduce((s, c) => s + c.value, 0);

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-white text-2xl font-bold">Expenses</h1>
        <p className="text-slate-500 text-sm mt-1">Monitor your spending patterns</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Spent", value: `$${total.toLocaleString()}`, sub: "+3.1% vs last month", up: false, color: "from-red-500/15 to-red-600/5 border-red-500/20" },
          { label: "Daily Average", value: `$${(total / 30).toFixed(0)}`, sub: "Per day this month", up: false, color: "from-orange-500/15 to-orange-600/5 border-orange-500/20" },
          { label: "Top Category", value: "Housing", sub: `$1,800 · ${((1800/total)*100).toFixed(0)}% of total`, up: true, color: "from-blue-500/15 to-blue-600/5 border-blue-500/20" },
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
            <p className="text-slate-500 text-xs mt-0.5">Monthly expenses over the year</p>
          </div>
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
        </div>

        {/* Pie */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <div className="mb-4">
            <h2 className="text-white font-semibold">Category Split</h2>
            <p className="text-slate-500 text-xs mt-0.5">Spending distribution</p>
          </div>
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
                <span className="text-slate-400 text-xs">{((cat.value/total)*100).toFixed(0)}%</span>
                <span className="text-slate-300 text-xs font-mono">${cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
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
                <span className="text-xs text-slate-500">{((cat.value/total)*100).toFixed(0)}%</span>
              </div>
              <p className="text-white text-lg font-bold font-mono">${cat.value.toLocaleString()}</p>
              <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(cat.value/total)*100}%`, backgroundColor: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expense transactions */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4">Recent Expenses</h2>
        <div className="space-y-1">
          {expenseTransactions.map(t => (
            <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors">
              <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-sm font-semibold shrink-0">EX</div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 text-sm font-medium truncate">{t.name}</p>
                <p className="text-slate-600 text-xs">{t.category} · {t.date}</p>
              </div>
              <span className="text-slate-300 text-sm font-bold font-mono">-${Math.abs(t.amount).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
