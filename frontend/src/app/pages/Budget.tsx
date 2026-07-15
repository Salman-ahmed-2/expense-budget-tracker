import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Plus, AlertTriangle, CheckCircle, Target } from "lucide-react";
import { budgets } from "../data/mockData";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800/95 border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-sm font-semibold" style={{ color: p.fill }}>
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function Budget() {
  const [showAdd, setShowAdd] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: "", amount: "" });

  const totalAllocated = budgets.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const over = budgets.filter(b => b.spent > b.allocated).length;
  const onTrack = budgets.filter(b => b.spent <= b.allocated * 0.8).length;

  const chartData = budgets.map(b => ({ name: b.category.split(" ")[0], allocated: b.allocated, spent: b.spent }));

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Budget</h1>
          <p className="text-slate-500 text-sm mt-1">Set limits and track spending against goals</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm px-4 py-2 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus size={15} /> New Budget
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Budget", value: `$${totalAllocated.toLocaleString()}`, color: "text-blue-400", bg: "from-blue-500/10 to-blue-600/5 border-blue-500/20" },
          { label: "Total Spent", value: `$${totalSpent.toLocaleString()}`, color: "text-orange-400", bg: "from-orange-500/10 to-orange-600/5 border-orange-500/20" },
          { label: "Over Budget", value: `${over} categories`, color: "text-red-400", bg: "from-red-500/10 to-red-600/5 border-red-500/20" },
          { label: "On Track", value: `${onTrack} categories`, color: "text-emerald-400", bg: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20" },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.bg} border rounded-2xl p-4`}>
            <p className="text-slate-500 text-xs mb-1.5">{s.label}</p>
            <p className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Add budget form */}
      {showAdd && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Add New Budget Category</h2>
          <div className="flex gap-3">
            <select value={newBudget.category} onChange={e => setNewBudget({ ...newBudget, category: e.target.value })} className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 appearance-none">
              <option value="" className="bg-slate-800">Select category...</option>
              {["Travel", "Subscriptions", "Gifts", "Pet Care", "Sports"].map(c => (
                <option key={c} value={c} className="bg-slate-800">{c}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Monthly limit ($)"
              value={newBudget.amount}
              onChange={e => setNewBudget({ ...newBudget, amount: e.target.value })}
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
            <button onClick={() => setShowAdd(false)} className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">Add</button>
            <button onClick={() => setShowAdd(false)} className="bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 px-4 py-2.5 rounded-xl transition-colors text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Budget vs Actual chart */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-semibold">Budget vs Actual</h2>
            <p className="text-slate-500 text-xs mt-0.5">Allocated vs spent per category</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-blue-400 inline-block" />Allocated</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-emerald-400 inline-block" />Spent</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="allocated" name="Allocated" fill="#3B82F6" radius={[4, 4, 0, 0]} opacity={0.6} />
            <Bar dataKey="spent" name="Spent" radius={[4, 4, 0, 0]}>
              {chartData.map((d, i) => <Cell key={i} fill={d.spent > d.allocated ? "#EF4444" : "#10B981"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Budget progress cards */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-5">Category Budgets</h2>
        <div className="space-y-4">
          {budgets.map(b => {
            const pct = Math.min((b.spent / b.allocated) * 100, 100);
            const over = b.spent > b.allocated;
            const warn = pct >= 80 && !over;
            return (
              <div key={b.category} className={`p-4 rounded-xl border transition-colors ${over ? "bg-red-500/[0.04] border-red-500/20" : warn ? "bg-amber-500/[0.04] border-amber-500/15" : "bg-white/[0.02] border-white/[0.05]"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {over ? <AlertTriangle size={15} className="text-red-400" /> : warn ? <AlertTriangle size={15} className="text-amber-400" /> : <CheckCircle size={15} className="text-emerald-400" />}
                    <span className="text-slate-200 text-sm font-semibold">{b.category}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold font-mono ${over ? "text-red-400" : "text-slate-200"}`}>${b.spent.toLocaleString()}</span>
                    <span className="text-slate-600 text-xs"> / ${b.allocated.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: over ? "#EF4444" : warn ? "#F59E0B" : b.color }}
                    />
                  </div>
                  <span className={`text-xs font-semibold shrink-0 w-10 text-right ${over ? "text-red-400" : warn ? "text-amber-400" : "text-slate-400"}`}>
                    {pct.toFixed(0)}%
                  </span>
                </div>
                {over && (
                  <p className="text-red-400 text-xs mt-2">Over by ${(b.spent - b.allocated).toLocaleString()}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
