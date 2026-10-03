import Link from "next/link";
import { Button } from "@heroui/react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center">
      <div className="max-w-3xl space-y-6">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-100 rounded-full dark:bg-blue-950 dark:text-blue-400">
          Welcome to DailyTrack
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Master Your Daily Goals & Habits
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          Stay organized, track your tasks, and monitor your progress with an
          intuitive, modern dashboard.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="/signin">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer">
              Get Started Free
            </Button>
          </Link>
          <Link href="/tasks">
            <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white font-medium px-6 py-3 rounded-xl transition-all cursor-pointer">
              View Tasks
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
