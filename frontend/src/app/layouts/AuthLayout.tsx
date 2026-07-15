import { Outlet, Link } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-blue-600/10 to-purple-600/20" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(16,185,129,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.15) 0%, transparent 50%)" }} />

        {/* Floating glass cards decoration */}
        <div className="absolute top-32 right-16 w-48 h-28 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 rotate-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-emerald-400 text-2xl font-bold">+24.8%</p>
            <p className="text-slate-400 text-xs">Portfolio Growth</p>
          </div>
        </div>
        <div className="absolute bottom-48 left-8 w-44 h-24 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 -rotate-3 flex items-center justify-center">
          <div className="text-center">
            <p className="text-blue-400 text-xl font-bold">$14,280</p>
            <p className="text-slate-400 text-xs">Monthly Savings</p>
          </div>
        </div>
        <div className="absolute top-1/2 right-8 w-36 h-20 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 rotate-2 flex items-center justify-center">
          <div className="text-center">
            <p className="text-purple-400 text-lg font-bold">98.6%</p>
            <p className="text-slate-400 text-xs">Budget Accuracy</p>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-900 font-bold text-lg">F</div>
            <span className="text-white font-semibold text-xl">ExpenseTrack</span>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Master your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">financial future</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            Track every dollar, visualize your wealth, and make smarter money decisions — all in one beautiful dashboard.
          </p>

          <div className="mt-10 flex items-center gap-6">
            <div>
              <p className="text-white font-bold text-2xl">50K+</p>
              <p className="text-slate-500 text-sm">Active Users</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-white font-bold text-2xl">$2.4B</p>
              <p className="text-slate-500 text-sm">Tracked Assets</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-white font-bold text-2xl">4.9★</p>
              <p className="text-slate-500 text-sm">App Rating</p>
            </div>
          </div>
        </div>

        <p className="relative text-slate-600 text-sm">© 2024 ExpenseTrack. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-900 font-bold">F</div>
            <span className="text-white font-semibold text-lg">ExpenseTrack</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
