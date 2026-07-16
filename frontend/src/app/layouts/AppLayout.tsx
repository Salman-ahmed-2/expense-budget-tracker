import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard, ArrowLeftRight, TrendingUp, TrendingDown,
  Target, BarChart2, User, Settings, Bell, Search, Plus,
  ChevronLeft, ChevronRight, X, LogOut, Wallet, Zap,
  DollarSign, Tag, Calendar, CheckCircle
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { path: "/income", label: "Income", icon: TrendingUp },
  { path: "/expenses", label: "Expenses", icon: TrendingDown },
  { path: "/budget", label: "Budget", icon: Target },
  { path: "/reports", label: "Reports", icon: BarChart2 },
];

const bottomNav = [
  { path: "/profile", label: "Profile", icon: User },
  { path: "/settings", label: "Settings", icon: Settings },
];

import { getCategories, addTransaction, type Category } from "../services/api";

const notifications = [
  { id: 1, text: "Budget limit reached for Shopping", time: "2m ago", read: false, type: "warning" },
  { id: 2, text: "Salary credited — $8,500.00", time: "1h ago", read: false, type: "success" },
  { id: 3, text: "New bill due: Electricity $112", time: "3h ago", read: true, type: "info" },
  { id: 4, text: "Savings goal 80% achieved!", time: "1d ago", read: true, type: "success" },
];

type ModalField = { name: string; category_id: string; amount: string; type: "income" | "expense"; date: string; note: string };

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifList, setNotifList] = useState(notifications);
  const [form, setForm] = useState<ModalField>({ name: "", category_id: "", amount: "", type: "expense", date: new Date().toISOString().split("T")[0], note: "" });
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  const unread = notifList.filter(n => !n.read).length;

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  function markAllRead() {
    setNotifList(notifList.map(n => ({ ...n, read: true })));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addTransaction({
        description: form.name,
        amount: form.type === "expense" ? -Number(form.amount) : Number(form.amount),
        category_id: Number(form.category_id),
        date: form.date,
        type: form.type === "expense" ? "Expense" : "Income"
      });
      setSubmitted(true);
      setTimeout(() => { 
        setSubmitted(false); 
        setShowAddModal(false); 
        setForm({ name: "", category_id: "", amount: "", type: "expense", date: new Date().toISOString().split("T")[0], note: "" }); 
        window.location.reload(); // Refresh the page to show the new transaction
      }, 1500);
    } catch (err: any) {
      alert("Failed to add transaction: " + err.message);
    }
  }

  return (
    <div className="flex h-screen bg-[#0F172A] overflow-hidden font-['Inter',sans-serif]">
      {/* Sidebar */}
      <aside className={`relative flex flex-col bg-[#0B1120] border-r border-white/[0.06] transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[240px]"} shrink-0`}>
        {/* Gradient glow top */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-slate-900 font-bold text-base shrink-0 shadow-lg shadow-emerald-500/30">
            F
          </div>
          {!collapsed && <span className="text-white font-bold text-lg tracking-tight">ExpenseTrack</span>}
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden">
          {!collapsed && <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2">Main Menu</p>}
          <div className="space-y-0.5">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-400 rounded-full" />}
                    <Icon size={18} className={isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"} />
                    {!collapsed && <span>{label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {!collapsed && <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-2 mb-2 mt-6">Account</p>}
          <div className="space-y-0.5 mt-2">
            {bottomNav.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-400 rounded-full" />}
                    <Icon size={18} className={isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"} />
                    {!collapsed && <span>{label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom user strip */}
        <div className={`border-t border-white/[0.06] p-3 ${collapsed ? "flex justify-center" : ""}`}>
          {collapsed ? (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">JD</div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">JD</div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-semibold truncate">Salman Khan</p>
                <p className="text-slate-500 text-[11px] truncate">Pro Plan</p>
              </div>
              <button onClick={() => navigate("/login")} className="text-slate-500 hover:text-red-400 transition-colors shrink-0">
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="shrink-0 bg-[#0F172A]/80 backdrop-blur-sm border-b border-white/[0.06] px-6 py-3.5 flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search transactions, categories..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Add transaction */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm px-4 py-2 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
              >
                <Bell size={16} />
                {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />}
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                    <span className="text-white font-semibold text-sm">Notifications</span>
                    <button onClick={markAllRead} className="text-emerald-400 text-xs hover:text-emerald-300 transition-colors">Mark all read</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifList.map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${!n.read ? "bg-emerald-500/[0.04]" : ""}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === "warning" ? "bg-amber-400" : n.type === "success" ? "bg-emerald-400" : "bg-blue-400"}`} />
                          <div>
                            <p className="text-slate-200 text-xs leading-relaxed">{n.text}</p>
                            <p className="text-slate-600 text-[11px] mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="relative">
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white hover:opacity-90 transition-opacity"
              >
                SA
              </button>

              {showProfile && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
                  <div className="px-4 py-4 border-b border-white/[0.06]">
                    <p className="text-white font-semibold text-sm">Salman Khan</p>
                    <p className="text-slate-500 text-xs mt-0.5">salman@expensetrack.app</p>
                  </div>
                  <div className="p-2">
                    <button onClick={() => { navigate("/profile"); setShowProfile(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all text-sm">
                      <User size={15} /> Profile
                    </button>
                    <button onClick={() => { navigate("/settings"); setShowProfile(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all text-sm">
                      <Settings size={15} /> Settings
                    </button>
                    <hr className="border-white/[0.06] my-1" />
                    <button onClick={() => navigate("/login")} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div onClick={() => { setShowNotifications(false); setShowProfile(false); }}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <div>
                <h2 className="text-white font-bold text-lg">Add Transaction</h2>
                <p className="text-slate-500 text-sm mt-0.5">Record a new income or expense</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                <X size={16} />
              </button>
            </div>

            {submitted ? (
              <div className="p-12 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle size={28} className="text-emerald-400" />
                </div>
                <p className="text-white font-semibold">Transaction Added!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Type toggle */}
                <div className="flex rounded-xl bg-white/[0.04] border border-white/[0.06] p-1">
                  {(["expense", "income"] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, type: t })}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${form.type === t ? (t === "income" ? "bg-emerald-500 text-slate-900" : "bg-red-500 text-white") : "text-slate-400 hover:text-slate-200"}`}
                    >
                      {t === "income" ? "↑ Income" : "↓ Expense"}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Description</label>
                    <div className="relative">
                      <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Netflix Subscription" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Amount</label>
                    <div className="relative">
                      <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input required type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Date</label>
                    <div className="relative">
                      <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all" />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Category</label>
                    <select required value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none">
                      <option value="" className="bg-slate-800">Select category...</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id} className="bg-slate-800">{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Note (optional)</label>
                    <input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Add a note..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                  <Zap size={16} /> Add Transaction
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
