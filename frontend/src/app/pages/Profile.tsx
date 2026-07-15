import { useState } from "react";
import { Camera, Mail, Phone, MapPin, Calendar, Edit3, Shield, CreditCard, TrendingUp, ArrowUpRight } from "lucide-react";

const connectedAccounts = [
  { name: "Chase Checking", type: "Checking", balance: "$12,480.50", icon: "CK", connected: true },
  { name: "Fidelity Investments", type: "Investment", balance: "$28,940.00", icon: "IV", connected: true },
  { name: "Chase Savings", type: "Savings", balance: "$6,870.00", icon: "SV", connected: true },
  { name: "PayPal", type: "Wallet", balance: "$940.00", icon: "PP", connected: false },
];

const achievements = [
  { title: "Budget Master", desc: "Stayed within budget for 3 months", icon: "BM", earned: true },
  { title: "Savings Streak", desc: "Saved money every month for 6 months", icon: "SS", earned: true },
  { title: "Debt Free", desc: "Paid off all credit card debt", icon: "DF", earned: false },
  { title: "Investor", desc: "Made your first investment", icon: "IN", earned: true },
];

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Salman Khan",
    email: "salman@expensetrack.app",
    phone: "+1 (555) 024-8192",
    location: "New York, NY",
    bio: "Software engineer passionate about personal finance and early retirement.",
    joined: "March 2022",
  });
  const [draft, setDraft] = useState(profile);

  function save() {
    setProfile(draft);
    setEditing(false);
  }

  return (
    <div className="p-6 space-y-6 max-w-[1000px]">
      <div>
        <h1 className="text-white text-2xl font-bold">Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your personal information</p>
      </div>

      {/* Profile header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-emerald-600/30 via-blue-600/20 to-purple-600/30 relative">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.2) 0%, transparent 60%)" }} />
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-2xl font-bold text-white border-4 border-[#0F172A] shadow-xl">
                JD
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-slate-700 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                <Camera size={13} />
              </button>
            </div>
            <button
              onClick={() => editing ? save() : setEditing(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${editing ? "bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/25" : "bg-white/[0.06] text-slate-300 hover:bg-white/10 border border-white/[0.08]"}`}
            >
              <Edit3 size={14} />
              {editing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          {editing ? (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Full Name", key: "name", icon: null },
                { label: "Email", key: "email", icon: null },
                { label: "Phone", key: "phone", icon: null },
                { label: "Location", key: "location", icon: null },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">{f.label}</label>
                  <input
                    value={(draft as any)[f.key]}
                    onChange={e => setDraft({ ...draft, [f.key]: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Bio</label>
                <textarea
                  value={draft.bio}
                  onChange={e => setDraft({ ...draft, bio: e.target.value })}
                  rows={2}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
                />
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-white text-xl font-bold">{profile.name}</h2>
              <p className="text-slate-400 text-sm mt-1 mb-4 max-w-md">{profile.bio}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {[
                  { icon: Mail, text: profile.email },
                  { icon: Phone, text: profile.phone },
                  { icon: MapPin, text: profile.location },
                  { icon: Calendar, text: `Joined ${profile.joined}` },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-slate-500 text-sm">
                    <Icon size={13} className="text-slate-600" /> {text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Transactions", value: "1,284", icon: ArrowUpRight, color: "text-emerald-400" },
          { label: "Total Tracked", value: "$142,580", icon: TrendingUp, color: "text-blue-400" },
          { label: "Net Worth", value: "$48,290", icon: CreditCard, color: "text-purple-400" },
          { label: "Savings Rate", value: "43.4%", icon: Shield, color: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className="bg-slate-800/50 border border-white/[0.08] rounded-2xl p-4 text-center">
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-slate-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Connected accounts */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Connected Accounts</h2>
          <div className="space-y-3">
            {connectedAccounts.map(acc => (
              <div key={acc.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center text-lg shrink-0">{acc.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm font-medium">{acc.name}</p>
                  <p className="text-slate-500 text-xs">{acc.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-200 text-sm font-mono font-semibold">{acc.balance}</p>
                  <span className={`text-xs ${acc.connected ? "text-emerald-400" : "text-slate-600"}`}>
                    {acc.connected ? "● Connected" : "○ Disconnected"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-white/[0.1] text-slate-500 hover:text-slate-300 hover:border-white/20 text-sm transition-all">
            + Link New Account
          </button>
        </div>

        {/* Achievements */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Achievements</h2>
          <div className="space-y-3">
            {achievements.map(ach => (
              <div key={ach.title} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${ach.earned ? "bg-emerald-500/[0.04] border-emerald-500/15" : "bg-white/[0.01] border-white/[0.04] opacity-50"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${ach.earned ? "bg-emerald-500/15" : "bg-white/[0.03] grayscale"}`}>
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm font-semibold">{ach.title}</p>
                  <p className="text-slate-500 text-xs">{ach.desc}</p>
                </div>
                {ach.earned && <span className="text-emerald-400 text-xs font-semibold shrink-0">Earned</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
