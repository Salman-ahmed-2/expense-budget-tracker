import { useState } from "react";
import { Bell, Shield, Palette, Globe, CreditCard, Trash2, ChevronRight, Moon, Smartphone, Mail, Lock, Eye, EyeOff } from "lucide-react";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex w-10 h-5.5 rounded-full transition-colors duration-200 ${value ? "bg-emerald-500" : "bg-slate-700"}`}
      style={{ height: "22px" }}
    >
      <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-200 ${value ? "translate-x-[18px]" : "translate-x-0"}`} style={{ width: "18px", height: "18px" }} />
    </button>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0">
      <div>
        <p className="text-slate-200 text-sm font-medium">{label}</p>
        {desc && <p className="text-slate-500 text-xs mt-0.5">{desc}</p>}
      </div>
      <div className="ml-4 shrink-0">{children}</div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-slate-400">
          <Icon size={16} />
        </div>
        <h2 className="text-white font-semibold">{title}</h2>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

export default function Settings() {
  const [notifs, setNotifs] = useState({ budgetAlerts: true, txAlerts: true, weeklyReport: false, monthlyReport: true, emailDigest: true, pushNotifs: false });
  const [prefs, setPrefs] = useState({ currency: "USD", language: "en", theme: "dark", compactView: false, animations: true });
  const [security, setSecurity] = useState({ twoFactor: true, biometric: false, sessionTimeout: "30m" });
  const [showPw, setShowPw] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div className="p-6 space-y-5 max-w-[800px]">
      <div>
        <h1 className="text-white text-2xl font-bold">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account preferences</p>
      </div>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <SettingRow label="Budget Alerts" desc="Notify when spending approaches budget limit">
          <Toggle value={notifs.budgetAlerts} onChange={v => setNotifs({ ...notifs, budgetAlerts: v })} />
        </SettingRow>
        <SettingRow label="Transaction Alerts" desc="Instant notification for every transaction">
          <Toggle value={notifs.txAlerts} onChange={v => setNotifs({ ...notifs, txAlerts: v })} />
        </SettingRow>
        <SettingRow label="Weekly Report" desc="Summary of your weekly financial activity">
          <Toggle value={notifs.weeklyReport} onChange={v => setNotifs({ ...notifs, weeklyReport: v })} />
        </SettingRow>
        <SettingRow label="Monthly Report" desc="Detailed monthly financial overview">
          <Toggle value={notifs.monthlyReport} onChange={v => setNotifs({ ...notifs, monthlyReport: v })} />
        </SettingRow>
        <SettingRow label="Email Digest" desc="Daily summary delivered to your email">
          <Toggle value={notifs.emailDigest} onChange={v => setNotifs({ ...notifs, emailDigest: v })} />
        </SettingRow>
        <SettingRow label="Push Notifications" desc="Browser push notifications">
          <Toggle value={notifs.pushNotifs} onChange={v => setNotifs({ ...notifs, pushNotifs: v })} />
        </SettingRow>
      </Section>

      {/* Preferences */}
      <Section title="Preferences" icon={Palette}>
        <SettingRow label="Currency" desc="Your default display currency">
          <select value={prefs.currency} onChange={e => setPrefs({ ...prefs, currency: e.target.value })} className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 appearance-none">
            {["USD", "EUR", "GBP", "JPY", "CAD"].map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
          </select>
        </SettingRow>
        <SettingRow label="Language">
          <select value={prefs.language} onChange={e => setPrefs({ ...prefs, language: e.target.value })} className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 appearance-none">
            {[["en", "English"], ["es", "Español"], ["fr", "Français"], ["de", "Deutsch"]].map(([v, l]) => <option key={v} value={v} className="bg-slate-800">{l}</option>)}
          </select>
        </SettingRow>
        <SettingRow label="Theme" desc="Interface appearance">
          <div className="flex gap-1 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1">
            {[["dark", "Dark"], ["light", "Light"], ["system", "System"]].map(([v, l]) => (
              <button key={v} onClick={() => setPrefs({ ...prefs, theme: v })} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${prefs.theme === v ? "bg-emerald-500 text-slate-900" : "text-slate-400 hover:text-slate-200"}`}>{l}</button>
            ))}
          </div>
        </SettingRow>
        <SettingRow label="Compact View" desc="Reduce spacing for more information density">
          <Toggle value={prefs.compactView} onChange={v => setPrefs({ ...prefs, compactView: v })} />
        </SettingRow>
        <SettingRow label="Animations" desc="Enable micro-animations and transitions">
          <Toggle value={prefs.animations} onChange={v => setPrefs({ ...prefs, animations: v })} />
        </SettingRow>
      </Section>

      {/* Security */}
      <Section title="Security" icon={Shield}>
        <SettingRow label="Two-Factor Authentication" desc="Add an extra layer of security to your account">
          <Toggle value={security.twoFactor} onChange={v => setSecurity({ ...security, twoFactor: v })} />
        </SettingRow>
        <SettingRow label="Biometric Login" desc="Use Face ID or fingerprint to sign in">
          <Toggle value={security.biometric} onChange={v => setSecurity({ ...security, biometric: v })} />
        </SettingRow>
        <SettingRow label="Session Timeout" desc="Auto sign-out after inactivity">
          <select value={security.sessionTimeout} onChange={e => setSecurity({ ...security, sessionTimeout: e.target.value })} className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 appearance-none">
            {[["15m", "15 min"], ["30m", "30 min"], ["1h", "1 hour"], ["never", "Never"]].map(([v, l]) => <option key={v} value={v} className="bg-slate-800">{l}</option>)}
          </select>
        </SettingRow>

        {/* Change password */}
        <div className="py-4">
          <p className="text-slate-200 text-sm font-medium mb-3">Change Password</p>
          <div className="space-y-2">
            {["Current Password", "New Password", "Confirm New Password"].map((pl, i) => (
              <div key={i} className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder={pl}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-10 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
                {i === 1 && (
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                    {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                )}
              </div>
            ))}
            <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors mt-1">
              Update Password
            </button>
          </div>
        </div>
      </Section>

      {/* Danger zone */}
      <div className="bg-red-500/[0.04] border border-red-500/20 rounded-2xl p-5">
        <h2 className="text-red-400 font-semibold mb-4 flex items-center gap-2"><Trash2 size={16} /> Danger Zone</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-200 text-sm font-medium">Export All Data</p>
              <p className="text-slate-500 text-xs">Download a complete archive of your financial data</p>
            </div>
            <button className="text-sm text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-4 py-2 rounded-xl transition-all">Export</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-200 text-sm font-medium">Delete Account</p>
              <p className="text-slate-500 text-xs">Permanently remove your account and all data</p>
            </div>
            <button className="text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-2 rounded-xl transition-all">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
