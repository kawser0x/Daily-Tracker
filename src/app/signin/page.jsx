import Link from "next/link";
import { Button } from "@heroui/react";

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-blue-500/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl shadow-lg shadow-blue-500/20 mb-2">
            ✓
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Welcome back to DailyTrack
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sign in to access your daily tasks and productivity workspace
          </p>
        </div>

        {/* Demo Quick Start Banner */}
        <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-900/50 rounded-2xl p-3.5 text-xs text-blue-700 dark:text-blue-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span className="font-semibold">Local Storage Mode Active</span>
          </div>
          <Link href="/tasks">
            <span className="font-bold underline hover:opacity-80 cursor-pointer">Skip Sign In →</span>
          </Link>
        </div>

        {/* Form Inputs */}
        <form className="space-y-4" action="/tasks">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email address</label>
            <input
              type="email"
              placeholder="name@example.com"
              required
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Password</label>
              <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Forgot?</span>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <Link href="/tasks" className="block w-full pt-2">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer">
              Sign In to Workspace 🚀
            </Button>
          </Link>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 dark:border-gray-800 w-full" />
          <span className="bg-white dark:bg-gray-900 px-3 text-[10px] uppercase font-bold text-gray-400 absolute">
            Or continue with
          </span>
        </div>

        {/* Social / Guest Action */}
        <Link href="/tasks" className="block w-full">
          <Button
            type="button"
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 hover:bg-gray-100 text-gray-800 dark:text-gray-200 font-semibold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
            <span>👤</span> Continue as Guest User
          </Button>
        </Link>

        {/* Footer info */}
        <p className="text-center text-[11px] text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/tasks" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
            Get started for free
          </Link>
        </p>

      </div>
    </div>
  );
}
