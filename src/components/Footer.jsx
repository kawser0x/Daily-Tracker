import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/20">
                ✓
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                Daily<span className="text-blue-600 dark:text-blue-400">Track</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                v2.0
              </span>
            </div>
            
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-sm leading-relaxed">
              A modern, privacy-focused productivity workspace with drag-and-drop Kanban boards, nested subtasks, calendar views, and real-time analytics.
            </p>

            <div className="flex items-center gap-3 text-xs font-bold text-gray-700 dark:text-gray-300 pt-1">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                🔒 100% Local Storage Privacy
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                ⚡ 60fps Native Drag & Drop
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/tasks" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Tasks & Kanban Board
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Productivity Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
              Features
            </h4>
            <ul className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-1.5">
                <span>📋</span> Nested Subtasks
              </li>
              <li className="flex items-center gap-1.5">
                <span>🤹</span> Drag & Drop Kanban
              </li>
              <li className="flex items-center gap-1.5">
                <span>📅</span> Monthly Calendar
              </li>
              <li className="flex items-center gap-1.5">
                <span>📊</span> Priority & Status Pie Charts
              </li>
              <li className="flex items-center gap-1.5">
                <span>⏰</span> Time Reminders & Toasts
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} DailyTrack. Built for peak focus and daily tracking.</p>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/kawser0x/Daily-Tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub Repository
            </a>
            <span className="hidden sm:inline">•</span>
            <span className="text-gray-700 dark:text-gray-300">Keyboard Hotkeys: <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-[10px] font-mono font-bold">Ctrl+K</kbd></span>
          </div>
        </div>

      </div>
    </footer>
  );
}
