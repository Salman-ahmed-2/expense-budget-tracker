import { useState, useEffect } from "react";
import { Search, Filter, ArrowUpRight, ArrowDownRight, Download, ChevronUp, ChevronDown, Loader2, Trash2 } from "lucide-react";
import { getTransactions, getCategories, deleteTransaction, type Transaction, type Category } from "../services/api";

const statuses = ["All", "completed", "pending"];

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>({ key: "date", dir: "desc" });
  const [page, setPage] = useState(1);
  const perPage = 8;

  async function fetchData() {
    try {
      const [txData, catData] = await Promise.all([
        getTransactions(),
        getCategories(),
      ]);
      setTransactions(txData);
      setCategories(catData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleDelete(id: number) {
    try {
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  }

  const categoryNames = ["All", ...categories.map(c => c.name)];

  const filtered = transactions
    .filter(t => {
      if (search && !t.description?.toLowerCase().includes(search.toLowerCase()) && !t.category_name?.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "All" && t.category_name !== category) return false;
      if (type === "income" && t.type?.toLowerCase() !== "income") return false;
      if (type === "expense" && t.type?.toLowerCase() !== "expense") return false;
      return true;
    })
    .sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      if (sort.key === "amount") return (Math.abs(a.amount) - Math.abs(b.amount)) * dir;
      if (sort.key === "date") return (a.date > b.date ? 1 : -1) * dir;
      if (sort.key === "name") return (a.description || "").localeCompare(b.description || "") * dir;
      return 0;
    });

  const pages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const totalIn = transactions.filter(t => t.type?.toLowerCase() === "income").reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type?.toLowerCase() === "expense").reduce((s, t) => s + t.amount, 0);

  function toggleSort(key: string) {
    setSort(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" });
  }

  function SortIcon({ col }: { col: string }) {
    if (sort.key !== col) return <ChevronUp size={12} className="opacity-20" />;
    return sort.dir === "asc" ? <ChevronUp size={12} className="text-emerald-400" /> : <ChevronDown size={12} className="text-emerald-400" />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading transactions...</p>
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

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Transactions</h1>
          <p className="text-slate-500 text-sm mt-1">{transactions.length} total transactions</p>
        </div>
        <button className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-slate-300 font-medium transition-all">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Income", value: `+$${totalIn.toLocaleString()}`, color: "text-emerald-400", bg: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20" },
          { label: "Total Expenses", value: `-$${totalOut.toLocaleString()}`, color: "text-red-400", bg: "from-red-500/10 to-red-600/5 border-red-500/20" },
          { label: "Net Flow", value: `$${(totalIn - totalOut).toFixed(2)}`, color: "text-blue-400", bg: "from-blue-500/10 to-blue-600/5 border-blue-500/20" },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.bg} border rounded-2xl p-4`}>
            <p className="text-slate-500 text-xs mb-1">{s.label}</p>
            <p className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>

        <div className="flex gap-1 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1">
          {["All", "income", "expense"].map(t => (
            <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${type === t ? "bg-emerald-500 text-slate-900" : "text-slate-400 hover:text-slate-200"}`}>
              {t === "income" ? "↑ Income" : t === "expense" ? "↓ Expense" : "All"}
            </button>
          ))}
        </div>

        <select value={category} onChange={e => setCategory(e.target.value)} className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 appearance-none">
          {categoryNames.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {[
                { label: "Transaction", key: "name" },
                { label: "Category", key: "category" },
                { label: "Date", key: "date" },
                { label: "Amount", key: "amount" },
                { label: "", key: "actions" },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => col.key !== "actions" && toggleSort(col.key)}
                  className={`text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${col.key !== "actions" ? "cursor-pointer hover:text-slate-300" : ""} transition-colors select-none`}
                >
                  <span className="flex items-center gap-1">{col.label} {col.key !== "actions" && <SortIcon col={col.key} />}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {paged.map(t => {
              const isIncome = t.type?.toLowerCase() === "income";
              return (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0" style={{ backgroundColor: `${isIncome ? "#10B981" : "#EF4444"}18` }}>
                        {isIncome ? "IN" : "EX"}
                      </div>
                      <div>
                        <p className="text-slate-200 text-sm font-medium">{t.description || "Transaction"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.05] text-slate-400 font-medium">{t.category_name || "—"}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-sm font-mono">{t.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-bold font-mono flex items-center gap-1 ${isIncome ? "text-emerald-400" : "text-slate-300"}`}>
                      {isIncome ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {isIncome ? "+" : "-"}${Math.abs(t.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleDelete(t.id)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {paged.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-slate-500">No transactions match your filters.</p>
          </div>
        )}

        {/* Pagination */}
        {pages > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.06]">
            <p className="text-slate-500 text-sm">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all">← Prev</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${page === p ? "bg-emerald-500 text-slate-900" : "text-slate-400 hover:text-white hover:bg-white/[0.05]"}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
