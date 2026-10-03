import Link from "next/link";
import { Button } from "@heroui/react";

export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-4rem)]">
      
      {/* Background Radial Glow & Mesh Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-blue-500/15 via-indigo-500/8 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 left-1/6 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-64 right-1/6 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">
        
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800/60 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-2xs backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span>DailyTrack v2.0 • Modern Productivity Workspace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.12]">
            Master Your Daily Tasks &{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Boost Productivity
            </span>
          </h1>

          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
            Stay focused with nested subtasks, 60fps drag-and-drop Kanban boards, full monthly calendars, and real-time completion analytics.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/tasks">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base px-7 py-3.5 rounded-2xl shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.02] cursor-pointer">
                Launch App & Tasks 🚀
              </Button>
            </Link>
            <Link href="/analytics">
              <Button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-white font-semibold text-base px-7 py-3.5 rounded-2xl shadow-2xs transition-all hover:scale-[1.02] cursor-pointer">
                View Analytics 📊
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs font-semibold text-gray-600 dark:text-gray-400">
            <span className="px-3 py-1 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/60 shadow-2xs">
              📋 Nested Subtasks
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/60 shadow-2xs">
              🤹 Drag & Drop Kanban
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/60 shadow-2xs">
              📅 Monthly Calendar
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/60 shadow-2xs">
              ⚡ 100% Local Privacy
            </span>
          </div>
        </div>

        {/* LIVE APP MOCKUP PREVIEW */}
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute -top-4 -left-2 sm:-left-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-xl text-xs font-bold text-gray-800 dark:text-gray-200 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>🔥 5-Day Completion Streak!</span>
          </div>

          <div className="absolute -bottom-4 -right-2 sm:-right-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-xl text-xs font-bold text-gray-800 dark:text-gray-200">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span>⚡ 60fps Native Kanban Smoothness</span>
          </div>

          <div className="relative rounded-3xl border border-gray-200/90 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-gray-400">dailytrack.app/tasks</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900">
                Live Interactive Mockup
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* To Do */}
              <div className="bg-gray-50/90 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700/60 rounded-2xl p-3 space-y-2.5">
                <div className="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-700/60 pb-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> To Do
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200/80 dark:bg-gray-700 text-gray-700 dark:text-gray-300">2</span>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-2.5 shadow-2xs space-y-1.5">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">Prepare Q4 Strategy Presentation</p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 font-bold">High Priority</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">⏰ 10:00 AM</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-2.5 shadow-2xs space-y-1.5">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">Read Deep Work (Chapter 4)</p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 font-semibold">Low Priority</span>
                    <span className="text-gray-400">Personal</span>
                  </div>
                </div>
              </div>

              {/* In Progress */}
              <div className="bg-gray-50/90 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700/60 rounded-2xl p-3 space-y-2.5">
                <div className="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-700/60 pb-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> In Progress
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200/80 dark:bg-gray-700 text-gray-700 dark:text-gray-300">1</span>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-2.5 shadow-2xs space-y-2">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">Build Next.js 16 Component Architecture</p>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
                      <span>Subtasks</span>
                      <span className="text-blue-600 font-bold">2/3</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full w-2/3 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Completed */}
              <div className="bg-gray-50/90 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700/60 rounded-2xl p-3 space-y-2.5">
                <div className="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-700/60 pb-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200/80 dark:bg-gray-700 text-gray-700 dark:text-gray-300">2</span>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-2.5 shadow-2xs space-y-0.5 opacity-80">
                  <p className="text-xs font-semibold line-through text-gray-400">30-Minute Morning Jog</p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Done ✓</span>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-2.5 shadow-2xs space-y-0.5 opacity-80">
                  <p className="text-xs font-semibold line-through text-gray-400">Engineering Team Standup</p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Done ✓</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 3-STEP WORKFLOW SECTION */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
              Designed For Ultimate Efficiency
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              How DailyTrack Elevates Your Workflow
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Three streamlined steps to take full control of your tasks and daily productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-2xs space-y-3 hover:border-blue-400 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-extrabold text-base flex items-center justify-center border border-blue-200/60 dark:border-blue-800/60">
                01
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Plan & Subtask</h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Break complex goals down into actionable nested subtasks. Set exact priorities (High, Medium, Low) and time reminders.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-2xs space-y-3 hover:border-indigo-400 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-extrabold text-base flex items-center justify-center border border-indigo-200/60 dark:border-indigo-800/60">
                02
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Drag & Execute</h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Seamlessly drag tasks across Kanban columns or switch to full monthly calendar grid view to organize your schedule effortlessly.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-2xs space-y-3 hover:border-emerald-400 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 font-extrabold text-base flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
                03
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Analyze Growth</h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Track completion trends over time, compare week-over-week productivity performance, and view category donut ratios in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* FEATURE CARDS GRID */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Packed with Power Features
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Everything you need for daily focus, built natively into your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-2xs space-y-3 hover:border-blue-300 dark:hover:border-blue-800 transition-all">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 text-base font-bold">📋</div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Nested Subtask Checklists</h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Checking off subtasks automatically advances Kanban cards from To Do to In Progress and Completed.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-2xs space-y-3 hover:border-blue-300 dark:hover:border-blue-800 transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 text-base font-bold">🤹</div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">60fps Drag & Drop Kanban</h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Native HTML5 drag-and-drop provides buttery-smooth card movement across status columns.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-2xs space-y-3 hover:border-blue-300 dark:hover:border-blue-800 transition-all">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 text-base font-bold">📅</div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Interactive Monthly Calendar</h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">View your task schedule across the full month grid with visual color markers and date selectors.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-2xs space-y-3 hover:border-blue-300 dark:hover:border-blue-800 transition-all">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 text-base font-bold">⏰</div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Time Reminders & Toast Alerts</h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Set exact 12-hour AM/PM time alerts and receive browser notifications and floating toast reminders.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-2xs space-y-3 hover:border-blue-300 dark:hover:border-blue-800 transition-all">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 text-base font-bold">📊</div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Filtered Analytics & Pie Charts</h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">View task distribution pie ratios by Status and Priority across All, Pending, and Completed stages.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 shadow-2xs space-y-3 hover:border-blue-300 dark:hover:border-blue-800 transition-all">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 text-base font-bold">⌨️</div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Power-User Keyboard Hotkeys</h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Navigate rapidly with global shortcuts (`Ctrl+K` for search, `Ctrl+N` for new tasks, `Ctrl+Shift+K` for Kanban mode).</p>
            </div>
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 p-8 sm:p-12 text-white shadow-2xl overflow-hidden text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Master Your Daily Workflow?
            </h3>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-normal">
              No account registration required. All your tasks stay 100% private in your browser. Get started in less than 5 seconds.
            </p>
            <div className="pt-2">
              <Link href="/tasks">
                <Button className="bg-white hover:bg-gray-100 text-blue-700 font-extrabold text-base px-8 py-3.5 rounded-2xl shadow-xl transition-all hover:scale-105 cursor-pointer">
                  Open Tasks Dashboard Now 🚀
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
