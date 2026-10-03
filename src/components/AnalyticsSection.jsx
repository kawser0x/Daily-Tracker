"use client";

import { useState, useEffect } from "react";

const INITIAL_TASKS = [];

export default function AnalyticsSection() {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Weekly Trend State
  const [weeklyViewMode, setWeeklyViewMode] = useState("area");
  const [weeklyRange, setWeeklyRange] = useState("this_week");
  const [hoveredTrendDay, setHoveredTrendDay] = useState(null);

  // Pie Chart State
  const [pieStatusFilter, setPieStatusFilter] = useState("All");
  const [chartMetric, setChartMetric] = useState("status");

  useEffect(() => {
    const saved = localStorage.getItem("dailytrack_tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        setTasks(INITIAL_TASKS);
      }
    } else {
      setTasks(INITIAL_TASKS);
    }
    setIsLoaded(true);
  }, []);

  // Overall Calculation Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed || t.boardStatus === "completed").length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Category breakdown
  const categoryCounts = {};
  tasks.forEach((t) => {
    const cat = t.category || "General";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  // Dynamic Pie Tasks
  const filteredPieTasks = tasks.filter((t) => {
    const isDone = t.completed || t.boardStatus === "completed";
    if (pieStatusFilter === "Completed") return isDone;
    if (pieStatusFilter === "Pending") return !isDone;
    return true;
  });

  const pieTotal = filteredPieTasks.length;

  const statusCounts = {
    completed: filteredPieTasks.filter((t) => t.completed || t.boardStatus === "completed").length,
    in_progress: filteredPieTasks.filter((t) => !t.completed && t.boardStatus === "in_progress").length,
    todo: filteredPieTasks.filter((t) => !t.completed && (t.boardStatus === "todo" || !t.boardStatus)).length,
  };

  const priorityCounts = { High: 0, Medium: 0, Low: 0 };
  filteredPieTasks.forEach((t) => {
    const p = t.priority || "Low";
    if (priorityCounts[p] !== undefined) priorityCounts[p] += 1;
  });

  // Weekly Trend Data
  const weeklyDataThisWeek = [
    { day: "Mon", fullDay: "Monday", completed: 3, total: 4 },
    { day: "Tue", fullDay: "Tuesday", completed: 5, total: 6 },
    { day: "Wed", fullDay: "Wednesday", completed: 4, total: 4 },
    { day: "Thu", fullDay: "Thursday", completed: 2, total: 5 },
    { day: "Fri", fullDay: "Friday", completed: 6, total: 7 },
    { day: "Sat", fullDay: "Saturday", completed: 3, total: 3 },
    { day: "Sun", fullDay: "Sunday", completed: completedTasks, total: totalTasks || 1 },
  ];

  const weeklyDataLastWeek = [
    { day: "Mon", fullDay: "Monday", completed: 2, total: 4 },
    { day: "Tue", fullDay: "Tuesday", completed: 4, total: 5 },
    { day: "Wed", fullDay: "Wednesday", completed: 3, total: 5 },
    { day: "Thu", fullDay: "Thursday", completed: 5, total: 5 },
    { day: "Fri", fullDay: "Friday", completed: 4, total: 6 },
    { day: "Sat", fullDay: "Saturday", completed: 2, total: 4 },
    { day: "Sun", fullDay: "Sunday", completed: 1, total: 3 },
  ];

  const currentWeeklyData = weeklyRange === "this_week" ? weeklyDataThisWeek : weeklyDataLastWeek;
  const maxWeeklyCompleted = Math.max(...currentWeeklyData.map((d) => d.completed), 1);
  const peakDayItem = currentWeeklyData.reduce((prev, curr) => (curr.completed > prev.completed ? curr : prev), currentWeeklyData[0]);
  const totalWeeklyCompleted = currentWeeklyData.reduce((acc, curr) => acc + curr.completed, 0);
  const dailyAverage = (totalWeeklyCompleted / 7).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-200/80 dark:border-gray-800">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Productivity Analytics
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time insights and task progress statistics
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 max-w-fit">
          Live Sync Active
        </span>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Tasks</span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-lg">📋</span>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">{totalTasks}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Created tasks</span>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Completion Rate</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-lg">✓</span>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">{completionRate}%</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
            {completedTasks} completed
          </span>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Pending Tasks</span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 text-lg">⏰</span>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">{pendingTasks}</p>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1 block">
            Needs action
          </span>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Daily Streak</span>
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-lg">🔥</span>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">5 Days</p>
          <span className="text-[11px] text-rose-500 font-medium mt-1 block">
            Keep it going!
          </span>
        </div>
      </div>

      {/* Analytics Visualizers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Completion Trend Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Weekly Completion Trend</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                  ↗ +14% vs prev week
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Daily completed tasks velocity & progress curve
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 dark:bg-gray-800 p-0.5 rounded-xl text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setWeeklyRange("this_week")}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    weeklyRange === "this_week" ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xs" : "text-gray-500 hover:text-gray-800"
                  }`}>
                  This Week
                </button>
                <button
                  type="button"
                  onClick={() => setWeeklyRange("last_week")}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    weeklyRange === "last_week" ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xs" : "text-gray-500 hover:text-gray-800"
                  }`}>
                  Last Week
                </button>
              </div>

              <div className="flex bg-gray-100 dark:bg-gray-800 p-0.5 rounded-xl text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setWeeklyViewMode("area")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${weeklyViewMode === "area" ? "bg-blue-600 text-white shadow-2xs" : "text-gray-400"}`}>
                  📈
                </button>
                <button
                  type="button"
                  onClick={() => setWeeklyViewMode("bar")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${weeklyViewMode === "bar" ? "bg-blue-600 text-white shadow-2xs" : "text-gray-400"}`}>
                  📊
                </button>
              </div>
            </div>
          </div>

          <div className="relative pt-2">
            {hoveredTrendDay && (
              <div className="absolute top-0 right-4 z-20 bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-3 py-1.5 rounded-xl shadow-xl border border-gray-700 dark:border-gray-200 text-xs flex items-center gap-3">
                <div>
                  <span className="font-bold block">{hoveredTrendDay.fullDay}</span>
                  <span className="text-[10px] opacity-80">{hoveredTrendDay.completed} of {hoveredTrendDay.total} tasks completed</span>
                </div>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-blue-600 text-white">
                  {Math.round((hoveredTrendDay.completed / hoveredTrendDay.total) * 100)}%
                </span>
              </div>
            )}

            {weeklyViewMode === "area" ? (
              <div className="h-52 w-full relative">
                {(() => {
                  const svgWidth = 500;
                  const svgHeight = 170;
                  const paddingLeft = 35;
                  const paddingRight = 20;
                  const paddingTop = 25;
                  const paddingBottom = 30;
                  const plotWidth = svgWidth - paddingLeft - paddingRight;
                  const plotHeight = svgHeight - paddingTop - paddingBottom;
                  const maxVal = Math.max(maxWeeklyCompleted, 7);

                  const points = currentWeeklyData.map((d, idx) => ({
                    x: paddingLeft + (idx / 6) * plotWidth,
                    y: paddingTop + plotHeight - (d.completed / maxVal) * plotHeight,
                    ...d
                  }));

                  let pathD = `M ${points[0].x} ${points[0].y}`;
                  for (let i = 0; i < points.length - 1; i++) {
                    const curr = points[i];
                    const next = points[i + 1];
                    const cp1x = curr.x + (next.x - curr.x) / 2;
                    const cp2x = curr.x + (next.x - curr.x) / 2;
                    pathD += ` C ${cp1x} ${curr.y}, ${cp2x} ${next.y}, ${next.x} ${next.y}`;
                  }

                  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + plotHeight} L ${points[0].x} ${paddingTop + plotHeight} Z`;

                  return (
                    <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                        const y = paddingTop + ratio * plotHeight;
                        return (
                          <g key={idx}>
                            <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} className="stroke-gray-100 dark:stroke-gray-800/80" strokeDasharray="4 4" strokeWidth="1" />
                            <text x={paddingLeft - 10} y={y + 3} className="fill-gray-400 dark:fill-gray-600 text-[9px] font-semibold text-anchor-end">
                              {Math.round(maxVal * (1 - ratio))}
                            </text>
                          </g>
                        );
                      })}

                      <path d={areaD} fill="url(#areaGradient)" />
                      <path d={pathD} fill="none" className="stroke-blue-600 dark:stroke-blue-400" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                      {points.map((pt) => {
                        const isHovered = hoveredTrendDay?.day === pt.day;
                        const isPeak = pt.day === peakDayItem.day;
                        return (
                          <g key={pt.day} onMouseEnter={() => setHoveredTrendDay(pt)} onMouseLeave={() => setHoveredTrendDay(null)} className="cursor-pointer">
                            <circle cx={pt.x} cy={pt.y} r={isHovered ? "9" : isPeak ? "7" : "5"} className={isPeak ? "fill-blue-600/30 stroke-blue-600 stroke-2" : "fill-blue-500/20 stroke-blue-500"} />
                            <circle cx={pt.x} cy={pt.y} r={isHovered ? "5" : "3.5"} className={isPeak ? "fill-rose-500" : "fill-blue-600 dark:fill-blue-400"} />
                            <text x={pt.x} y={svgHeight - 8} textAnchor="middle" className={`text-[11px] font-semibold ${isHovered ? "fill-blue-600 dark:fill-blue-400 font-bold" : "fill-gray-500 dark:fill-gray-400"}`}>
                              {pt.day}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  );
                })()}
              </div>
            ) : (
              <div className="h-52 flex items-end justify-between gap-3 pt-6 px-2">
                {currentWeeklyData.map((item) => {
                  const heightPercent = Math.round((item.completed / Math.max(maxWeeklyCompleted, 7)) * 100);
                  const isHovered = hoveredTrendDay?.day === item.day;
                  const isPeak = item.day === peakDayItem.day;

                  return (
                    <div key={item.day} onMouseEnter={() => setHoveredTrendDay(item)} onMouseLeave={() => setHoveredTrendDay(null)} className="flex-1 flex flex-col items-center gap-2 cursor-pointer">
                      <div className="w-full bg-gray-100 dark:bg-gray-800/80 h-36 rounded-2xl flex items-end p-1 relative overflow-hidden border border-gray-200/40 dark:border-gray-800">
                        <div className={`w-full rounded-xl transition-all duration-300 ${isPeak ? "bg-gradient-to-t from-rose-600 to-amber-400" : "bg-gradient-to-t from-blue-600 to-cyan-400"}`} style={{ height: `${Math.max(heightPercent, 8)}%` }} />
                      </div>
                      <span className={`text-xs font-semibold ${isHovered ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-600 dark:text-gray-400"}`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span>🔥 Peak Day: <strong className="text-gray-900 dark:text-white">{peakDayItem.fullDay}</strong> ({peakDayItem.completed} tasks)</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Avg Speed: <strong className="text-gray-900 dark:text-white">{dailyAverage} tasks/day</strong></span>
              <span>Weekly Total: <strong className="text-blue-600 dark:text-blue-400">{totalWeeklyCompleted} completed</strong></span>
            </div>
          </div>
        </div>

        {/* Task Distribution & Category Side Cards */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4 flex flex-col items-center">
            
            <div className="w-full space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Task Distribution</h3>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg text-[10px] font-bold">
                  <button type="button" onClick={() => setChartMetric("status")} className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${chartMetric === "status" ? "bg-blue-600 text-white" : "text-gray-500"}`}>Status</button>
                  <button type="button" onClick={() => setChartMetric("priority")} className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${chartMetric === "priority" ? "bg-blue-600 text-white" : "text-gray-500"}`}>Priority</button>
                </div>
              </div>

              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold">
                {["All", "Pending", "Completed"].map((tab) => (
                  <button key={tab} type="button" onClick={() => setPieStatusFilter(tab)} className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${pieStatusFilter === tab ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xs" : "text-gray-500"}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Pie Chart */}
            {(() => {
              const baseRadius = 40;
              const circumference = 2 * Math.PI * baseRadius;
              const gap = pieTotal > 1 ? 5 : 0;
              let slices = [];
              let currentStartPct = 0;

              if (chartMetric === "status") {
                const rawSlices = [
                  { key: "completed", label: "Completed", count: statusCounts.completed, pct: pieTotal > 0 ? statusCounts.completed / pieTotal : 0, color: "#10b981", text: "text-emerald-600 dark:text-emerald-400" },
                  { key: "in_progress", label: "In Progress", count: statusCounts.in_progress, pct: pieTotal > 0 ? statusCounts.in_progress / pieTotal : 0, color: "#6366f1", text: "text-indigo-600 dark:text-indigo-400" },
                  { key: "todo", label: "To Do", count: statusCounts.todo, pct: pieTotal > 0 ? statusCounts.todo / pieTotal : 0, color: "#f87171", text: "text-rose-600 dark:text-rose-400" },
                ];
                slices = rawSlices.map((s) => {
                  const item = { ...s, startPct: currentStartPct };
                  currentStartPct += s.pct;
                  return item;
                });
              } else {
                const rawSlices = [
                  { key: "High", label: "High Priority", count: priorityCounts.High, pct: pieTotal > 0 ? priorityCounts.High / pieTotal : 0, color: "#f87171", text: "text-rose-600 dark:text-rose-400" },
                  { key: "Medium", label: "Medium Priority", count: priorityCounts.Medium, pct: pieTotal > 0 ? priorityCounts.Medium / pieTotal : 0, color: "#f59e0b", text: "text-amber-600 dark:text-amber-400" },
                  { key: "Low", label: "Low Priority", count: priorityCounts.Low, pct: pieTotal > 0 ? priorityCounts.Low / pieTotal : 0, color: "#10b981", text: "text-emerald-600 dark:text-emerald-400" },
                ];
                slices = rawSlices.map((s) => {
                  const item = { ...s, startPct: currentStartPct };
                  currentStartPct += s.pct;
                  return item;
                });
              }

              return (
                <div className="relative w-44 h-44 flex items-center justify-center my-1">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={baseRadius} className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="16" fill="transparent" />
                    {pieTotal > 0 && slices.map((slice) => {
                      if (slice.count === 0) return null;
                      const dashLen = Math.max(slice.pct * circumference - gap, 0);
                      const strokeOffset = -((slice.startPct + 0.25) * circumference);
                      return (
                        <circle key={slice.key} cx="50" cy="50" r={baseRadius} stroke={slice.color} strokeWidth="16" fill="transparent" strokeDasharray={`${dashLen} ${circumference - dashLen}`} strokeDashoffset={strokeOffset} className="transition-all duration-500" />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{pieTotal}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{pieStatusFilter} Tasks</span>
                  </div>
                </div>
              );
            })()}

            <div className="w-full space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800">
              {(chartMetric === "status"
                ? [
                    { key: "completed", label: "Completed", count: statusCounts.completed, color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
                    { key: "in_progress", label: "In Progress", count: statusCounts.in_progress, color: "bg-indigo-500", text: "text-indigo-600 dark:text-indigo-400" },
                    { key: "todo", label: "To Do", count: statusCounts.todo, color: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
                  ]
                : [
                    { key: "High", label: "High Priority", count: priorityCounts.High, color: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
                    { key: "Medium", label: "Medium Priority", count: priorityCounts.Medium, color: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
                    { key: "Low", label: "Low Priority", count: priorityCounts.Low, color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
                  ]
              ).map((item) => {
                const pct = pieTotal > 0 ? Math.round((item.count / pieTotal) * 100) : 0;
                return (
                  <div key={item.key} className="flex items-center justify-between text-xs py-0.5">
                    <span className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      {item.label}
                    </span>
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span className={item.text}>{item.count}</span>
                      <span className="text-gray-400 text-[10px]">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Categories</h3>
            <div className="space-y-1.5">
              {Object.keys(categoryCounts).length === 0 ? (
                <p className="text-xs text-gray-400">No category data yet.</p>
              ) : (
                Object.entries(categoryCounts).map(([cat, count]) => {
                  const pct = totalTasks ? Math.round((count / totalTasks) * 100) : 0;
                  return (
                    <div key={cat} className="flex items-center justify-between text-xs py-1 border-b border-gray-100 dark:border-gray-800/60 last:border-none">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{cat}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{count} tasks</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{pct}%</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
