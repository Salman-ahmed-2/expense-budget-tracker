import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle2 } from "lucide-react";

const perks = [
  "Unlimited transaction tracking",
  "Smart budgeting with AI insights",
  "Real-time analytics & reports",
  "Bank-grade 256-bit encryption",
];

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-amber-400", "bg-emerald-500"][strength];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate("/"), 1200);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white text-3xl font-bold">Create your account</h1>
        <p className="text-slate-500 mt-2 text-sm">Start your free 14-day trial. No credit card required.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {perks.map(p => (
          <div key={p} className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-slate-400 text-xs">{p}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5">Full Name</label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Salman Khan"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5">Email Address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type={showPw ? "text" : "password"}
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Min. 8 characters"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-10 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {form.password.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 flex gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-white/[0.08]"}`} />
                ))}
              </div>
              <span className={`text-xs font-medium ${strength === 1 ? "text-red-400" : strength === 2 ? "text-amber-400" : "text-emerald-400"}`}>{strengthLabel}</span>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2">
          <input type="checkbox" id="terms" required className="w-4 h-4 mt-0.5 rounded accent-emerald-500" />
          <label htmlFor="terms" className="text-slate-400 text-sm">
            I agree to the{" "}
            <Link to="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">Terms of Service</Link>
            {" "}and{" "}
            <Link to="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">Privacy Policy</Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-70 text-slate-900 font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
          ) : (
            <>Create Free Account <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      <p className="text-slate-500 text-sm text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">Sign in</Link>
      </p>
    </div>
  );
}
