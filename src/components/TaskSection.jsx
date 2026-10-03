"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/react";

const getTodayString = () => new Date().toISOString().split("T")[0];
const getTomorrowString = () => new Date(Date.now() + 86400000).toISOString().split("T")[0];

const INITIAL_TASKS = [];
const CATEGORIES = ["Work", "Personal", "Health"];
const PRIORITIES = ["Low", "Medium", "High"];
const KANBAN_COLUMNS = [
  { id: "todo", title: "To Do", color: "bg-blue-600" },
  { id: "in_progress", title: "In Progress", color: "bg-amber-500" },
  { id: "completed", title: "Completed", color: "bg-emerald-600" },
];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Subtask Status Sanitizer
const sanitizeTaskStatus = (task) => {
  const subs = task.subtasks || [];
  if (subs.length > 0) {
    const completedCount = subs.filter((s) => s.completed).length;
    const totalCount = subs.length;

    if (completedCount === 0) return { ...task, boardStatus: "todo", completed: false };
    if (completedCount < totalCount) return { ...task, boardStatus: "in_progress", completed: false };
    return { ...task, boardStatus: "completed", completed: true };
  }
  return task;
};

// 12-Hour AM/PM Time Formatter
const formatTimeLabel = (timeStr) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hours = parseInt(h, 10);
  return `${hours % 12 || 12}:${m} ${hours >= 12 ? "PM" : "AM"}`;
};

// Priority Styles Map with Maximum High Contrast
const PRIORITY_MAP = {
  High: { label: "High", dot: "bg-rose-600", badge: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-800 font-extrabold" },
  Medium: { label: "Medium", dot: "bg-amber-600", badge: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800 font-extrabold" },
  Low: { label: "Low", dot: "bg-emerald-600", badge: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800 font-extrabold" },
};

export default function TaskSection() {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Work");
  const [selectedPriority, setSelectedPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(getTodayString());
  const [dueTime, setDueTime] = useState("09:00");

  // Keyboard Shortcuts & Toast State
  const addInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // View & Filter State
  const [viewMode, setViewMode] = useState("kanban");
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCalendarView, setShowCalendarView] = useState(true);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k" && !e.shiftKey) {
        e.preventDefault();
        searchInputRef.current?.focus();
        triggerToast("Focused Search (Ctrl+K)", "info");
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        addInputRef.current?.focus();
        triggerToast("Focused Add Task (Ctrl+N)", "info");
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setViewMode((prev) => (prev === "list" ? "kanban" : "list"));
        triggerToast("Toggled View Mode", "info");
      } else if (e.key === "Escape") {
        setSearchQuery("");
        setShowShortcutsModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Notifications permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Load & Save tasks
  useEffect(() => {
    const saved = localStorage.getItem("dailytrack_tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved).map(sanitizeTaskStatus));
      } catch (e) {
        setTasks(INITIAL_TASKS);
      }
    } else {
      setTasks(INITIAL_TASKS);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("dailytrack_tasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  // Calendar Helpers
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDateFilter(getTodayString());
    setDueDate(getTodayString());
  };

  const getMonthDays = () => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = Array(firstDayIndex).fill(null);
    for (let d = 1; d <= totalDays; d++) {
      const mStr = String(currentMonth + 1).padStart(2, "0");
      const dStr = String(d).padStart(2, "0");
      days.push({ day: d, dateStr: `${currentYear}-${mStr}-${dStr}` });
    }
    return days;
  };

  const taskStatusByDate = {};
  tasks.forEach((task) => {
    if (!task.dueDate) return;
    if (!taskStatusByDate[task.dueDate]) {
      taskStatusByDate[task.dueDate] = { hasCompleted: false, hasHighPriority: false, hasPending: false, total: 0 };
    }
    const info = taskStatusByDate[task.dueDate];
    info.total += 1;
    if (task.completed || task.boardStatus === "completed") {
      info.hasCompleted = true;
    } else {
      info.hasPending = true;
      if (task.priority === "High") info.hasHighPriority = true;
    }
  });

  // Task Actions
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      category: selectedCategory,
      priority: selectedPriority,
      dueDate: dueDate || getTodayString(),
      dueTime: dueTime || "09:00",
      boardStatus: "todo",
      completed: false,
      subtasks: [],
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    triggerToast(`Task "${newTask.title}" added!`);

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification("DailyTrack Reminder", {
        body: `Task "${newTask.title}" set for ${formatTimeLabel(newTask.dueTime)}`,
      });
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const isComp = !task.completed;
          const updatedSubtasks = (task.subtasks || []).map((s) => ({ ...s, completed: isComp }));
          triggerToast(isComp ? "Task completed!" : "Task marked pending", isComp ? "success" : "info");
          return sanitizeTaskStatus({
            ...task,
            completed: isComp,
            boardStatus: isComp ? "completed" : "todo",
            subtasks: updatedSubtasks,
          });
        }
        return task;
      })
    );
  };

  const moveTaskToColumn = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const subtaskArr = task.subtasks || [];
          let updatedSubtasks = subtaskArr;

          if (newStatus === "completed") updatedSubtasks = subtaskArr.map((s) => ({ ...s, completed: true }));
          else if (newStatus === "todo") updatedSubtasks = subtaskArr.map((s) => ({ ...s, completed: false }));
          else if (newStatus === "in_progress" && !subtaskArr.some((s) => s.completed)) {
            updatedSubtasks = subtaskArr.map((s, idx) => ({ ...s, completed: idx === 0 }));
          }

          triggerToast(`Moved to ${newStatus.replace("_", " ")}`);
          return sanitizeTaskStatus({
            ...task,
            boardStatus: newStatus,
            completed: newStatus === "completed",
            subtasks: updatedSubtasks,
          });
        }
        return task;
      })
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    triggerToast("Task deleted", "info");
  };

  // Subtask Actions
  const handleAddSubtask = (taskId, e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = [...(task.subtasks || []), { id: Date.now(), title: newSubtaskTitle.trim(), completed: false }];
          triggerToast("Subtask added");
          return sanitizeTaskStatus({ ...task, subtasks: updatedSubtasks });
        }
        return task;
      })
    );
    setNewSubtaskTitle("");
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = (task.subtasks || []).map((sub) =>
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          );
          return sanitizeTaskStatus({ ...task, subtasks: updatedSubtasks });
        }
        return task;
      })
    );
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = (task.subtasks || []).filter((sub) => sub.id !== subtaskId);
          return sanitizeTaskStatus({ ...task, subtasks: updatedSubtasks });
        }
        return task;
      })
    );
  };

  // Drag & Drop
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId.toString());
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (draggedTaskId) {
      moveTaskToColumn(draggedTaskId, colId);
      setDraggedTaskId(null);
    }
  };

  // Metrics
  const completedCount = tasks.filter((t) => t.completed || t.boardStatus === "completed").length;
  const totalCount = tasks.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const formatDueDateLabel = (dateStr) => {
    if (!dateStr) return "No Due Date";
    if (dateStr === getTodayString()) return "Today";
    if (dateStr === getTomorrowString()) return "Tomorrow";
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  // Filtering
  const filteredTasks = tasks.map(sanitizeTaskStatus).filter((task) => {
    const isDone = task.completed || task.boardStatus === "completed";
    const matchesStatus = statusFilter === "All" ? true : statusFilter === "Completed" ? isDone : !isDone;
    const matchesDate = !selectedDateFilter ? true : task.dueDate === selectedDateFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesDate && matchesSearch;
  });

  // Group by Date for List View
  const groupedTasksByDate = {};
  filteredTasks.forEach((task) => {
    const key = task.dueDate || "No Date";
    if (!groupedTasksByDate[key]) groupedTasksByDate[key] = [];
    groupedTasksByDate[key].push(task);
  });

  const sortedDateKeys = Object.keys(groupedTasksByDate).sort((a, b) => {
    if (a === "No Date") return 1;
    if (b === "No Date") return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-4 py-2.5 rounded-2xl shadow-xl border border-gray-700 dark:border-gray-200 text-xs font-semibold animate-bounce">
          <span>🔔</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
              <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span>⌨️</span> Keyboard Shortcuts
              </h3>
              <button type="button" onClick={() => setShowShortcutsModal(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-xs cursor-pointer">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-800 dark:text-gray-200 font-semibold">Focus Search Input</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded font-mono font-bold">Ctrl + K</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-800 dark:text-gray-200 font-semibold">Focus Add Task Input</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded font-mono font-bold">Ctrl + N</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-800 dark:text-gray-200 font-semibold">Toggle View Mode</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded font-mono font-bold">Ctrl + Shift + K</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-800 dark:text-gray-200 font-semibold">Clear Search / Close</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded font-mono font-bold">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Task App Container */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
        
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              My Daily Tasks
            </h2>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 font-bold">
              {completedCount} of {totalCount} tasks completed ({progressPercent}%)
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowShortcutsModal(true)}
              className="px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-gray-200 hover:bg-gray-200 cursor-pointer"
              title="Keyboard Shortcuts">
              ⌨️ <span className="hidden sm:inline">Shortcuts</span>
            </button>

            <div className="flex p-1 bg-gray-200/80 dark:bg-gray-800/80 rounded-xl border border-gray-300/60 dark:border-gray-700/60">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}>
                <span>☰</span> List
              </button>
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === "kanban"
                    ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}>
                <span>🤹</span> Kanban
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowCalendarView(!showCalendarView)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                showCalendarView
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-200"
              }`}>
              📅 <span>{showCalendarView ? "Hide Calendar" : "Show Calendar"}</span>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        {showCalendarView && (
          <div className="bg-gray-100/70 dark:bg-gray-800/40 border border-gray-300/80 dark:border-gray-700/60 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </h3>
                <button
                  type="button"
                  onClick={goToToday}
                  className="text-[10px] font-black text-blue-700 dark:text-blue-300 hover:underline px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-950">
                  Today
                </button>
              </div>

              <div className="flex items-center gap-1">
                {selectedDateFilter && (
                  <button
                    type="button"
                    onClick={() => setSelectedDateFilter(null)}
                    className="text-xs font-bold text-gray-800 dark:text-gray-300 hover:text-blue-600 mr-2">
                    Clear Date ({selectedDateFilter})
                  </button>
                )}
                <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 font-bold cursor-pointer">◀</button>
                <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 font-bold cursor-pointer">▶</button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center mb-2">
              {DAY_LABELS.map((day) => (
                <div key={day} className="text-xs font-extrabold text-gray-800 dark:text-gray-200 py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {getMonthDays().map((item, index) => {
                if (!item) return <div key={`empty-${index}`} className="h-10 sm:h-11" />;

                const { day, dateStr } = item;
                const isToday = dateStr === getTodayString();
                const isSelected = selectedDateFilter === dateStr;
                const dateTasks = taskStatusByDate[dateStr];

                let bgBadge = "";
                if (dateTasks) {
                  if (dateTasks.hasHighPriority) bgBadge = "bg-rose-600 text-white";
                  else if (dateTasks.hasPending) bgBadge = "bg-blue-600 text-white";
                  else if (dateTasks.hasCompleted) bgBadge = "bg-emerald-600 text-white";
                }

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => {
                      setSelectedDateFilter(isSelected ? null : dateStr);
                      setDueDate(dateStr);
                    }}
                    className={`h-10 sm:h-11 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-600/40 bg-blue-100 dark:bg-blue-950/60"
                        : isToday
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 font-black"
                        : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-400"
                    }`}>
                    <span className={`text-xs font-extrabold ${
                      isToday
                        ? "text-blue-600 dark:text-blue-400"
                        : isSelected
                        ? "text-blue-800 dark:text-blue-200"
                        : "text-gray-900 dark:text-white"
                    }`}>
                      {day}
                    </span>
                    {dateTasks && (
                      <span className={`mt-0.5 px-1.5 py-0.2 text-[9px] font-black rounded-full ${bgBadge}`}>
                        {dateTasks.total}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Form Bar */}
        <form onSubmit={handleAddTask}>
          <div className="flex flex-col sm:flex-row gap-2 bg-gray-100/90 dark:bg-gray-800/60 p-2 rounded-2xl border border-gray-300 dark:border-gray-700 focus-within:border-blue-600 transition-all">
            <input
              ref={addInputRef}
              type="text"
              placeholder="Add a new task... (Ctrl+N)"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 bg-transparent px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
            />
            <div className="flex flex-wrap items-center gap-2 px-1">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  setSelectedDateFilter(e.target.value);
                }}
                className="bg-white dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
              />
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="bg-white dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer">
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 font-semibold">
                    {cat}
                  </option>
                ))}
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-white dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer">
                {PRIORITIES.map((p) => (
                  <option key={p} value={p} className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 font-semibold">
                    {p}
                  </option>
                ))}
              </select>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0">
                + Add Task
              </Button>
            </div>
          </div>
        </form>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex bg-gray-200/80 dark:bg-gray-800/80 p-1 rounded-xl w-full sm:w-auto border border-gray-300/50 dark:border-gray-700/50">
            {["All", "Pending", "Completed"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}>
                {status}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Filter tasks... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100/90 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 text-xs font-semibold rounded-xl pl-8 pr-3 py-1.5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-600"
            />
            <span className="absolute left-2.5 top-2 text-gray-500 text-xs">🔍</span>
          </div>
        </div>

        {/* LIST VIEW */}
        {viewMode === "list" && (
          <div className="space-y-6">
            {sortedDateKeys.length === 0 ? (
              <div className="py-12 text-center text-gray-600 dark:text-gray-400">
                <p className="text-sm font-extrabold">No tasks found</p>
                {selectedDateFilter && (
                  <button type="button" onClick={() => setSelectedDateFilter(null)} className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    Clear date filter
                  </button>
                )}
              </div>
            ) : (
              sortedDateKeys.map((dateKey) => {
                const dayTasks = groupedTasksByDate[dateKey];
                return (
                  <div key={dateKey} className="space-y-2">
                    <div className="flex items-center justify-between px-1 py-1 border-b border-gray-200 dark:border-gray-800">
                      <h3 className="text-xs font-black text-gray-900 dark:text-white">
                        {formatDueDateLabel(dateKey === "No Date" ? "" : dateKey)} {dateKey !== "No Date" && <span className="font-semibold text-gray-600 dark:text-gray-400">({dateKey})</span>}
                      </h3>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        {dayTasks.length} {dayTasks.length === 1 ? "task" : "tasks"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {dayTasks.map((task) => {
                        const priorityInfo = PRIORITY_MAP[task.priority] || PRIORITY_MAP.Low;
                        const subtaskArr = task.subtasks || [];
                        const completedSubtasks = subtaskArr.filter((s) => s.completed).length;
                        const isExpanded = expandedTaskId === task.id;
                        const isDone = task.completed || task.boardStatus === "completed";

                        return (
                          <div key={task.id} className={`group flex flex-col rounded-2xl border transition-all ${isDone ? "bg-gray-100/70 dark:bg-gray-800/30 border-gray-300/70 dark:border-gray-800/50 opacity-75" : "bg-white dark:bg-gray-800/60 border-gray-300 dark:border-gray-700/60 shadow-xs"}`}>
                            <div className="flex items-center justify-between p-3">
                              <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                                <button type="button" onClick={() => toggleTask(task.id)} className={`w-5 h-5 rounded-lg flex items-center justify-center border font-black transition-all cursor-pointer ${isDone ? "bg-blue-600 border-blue-600 text-white" : "border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"}`}>
                                  {isDone && "✓"}
                                </button>
                                <span className={`text-xs font-bold truncate ${isDone ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"}`}>
                                  {task.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {task.dueTime && (
                                  <span className="text-[10px] font-extrabold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                                    ⏰ {formatTimeLabel(task.dueTime)}
                                  </span>
                                )}
                                <button type="button" onClick={() => setExpandedTaskId(isExpanded ? null : task.id)} className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg border bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700">
                                  📋 {subtaskArr.length > 0 ? `${completedSubtasks}/${subtaskArr.length}` : "+ Subtask"}
                                </button>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${priorityInfo.badge}`}>
                                  {priorityInfo.label}
                                </span>
                                <button type="button" onClick={() => deleteTask(task.id)} className="text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 px-1 text-xs cursor-pointer font-bold">
                                  ✕
                                </button>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="px-4 pb-3 pt-2 border-t border-gray-200 dark:border-gray-800 bg-gray-100/60 dark:bg-gray-900/40 rounded-b-2xl space-y-2">
                                {subtaskArr.map((sub) => (
                                  <div key={sub.id} className="flex items-center justify-between text-xs">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input type="checkbox" checked={sub.completed} onChange={() => toggleSubtask(task.id, sub.id)} className="w-3.5 h-3.5 accent-blue-600 rounded" />
                                      <span className={sub.completed ? "line-through text-gray-500 dark:text-gray-400 font-medium" : "text-gray-900 dark:text-gray-100 font-bold"}>{sub.title}</span>
                                    </label>
                                    <button type="button" onClick={() => deleteSubtask(task.id, sub.id)} className="text-gray-500 hover:text-rose-600 text-xs font-bold">✕</button>
                                  </div>
                                ))}
                                <form onSubmit={(e) => handleAddSubtask(task.id, e)} className="flex items-center gap-2 pt-1">
                                  <input type="text" placeholder="Add subtask item..." value={newSubtaskTitle} onChange={(e) => setNewSubtaskTitle(e.target.value)} className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-2.5 py-1 text-xs text-gray-900 dark:text-white font-semibold placeholder-gray-500 focus:outline-none" />
                                  <button type="submit" className="bg-blue-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg hover:bg-blue-700 cursor-pointer">Add</button>
                                </form>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* KANBAN BOARD VIEW */}
        {viewMode === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 overflow-x-auto custom-scrollbar pb-2">
            {KANBAN_COLUMNS.map((col) => {
              const colTasks = filteredTasks.filter((t) => (t.boardStatus || (t.completed ? "completed" : "todo")) === col.id);
              const isDragOver = dragOverColumn === col.id;

              return (
                <div
                  key={col.id}
                  onDragOver={(e) => { e.preventDefault(); setDragOverColumn(col.id); }}
                  onDragLeave={(e) => { e.preventDefault(); }}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={`bg-gray-100/80 dark:bg-gray-800/40 border-2 rounded-2xl p-3.5 transition-all h-[560px] flex flex-col ${
                    isDragOver ? "border-blue-600 bg-blue-100/50 dark:bg-blue-950/30" : "border-dashed border-gray-300 dark:border-gray-700"
                  }`}>
                  
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-300 dark:border-gray-700 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${col.color}`} />
                      <h3 className="text-xs font-black text-gray-900 dark:text-white">{col.title}</h3>
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    {colTasks.length === 0 ? (
                      <div className="h-full min-h-[120px] flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-700 dark:text-gray-300 font-extrabold">Drag tasks here</p>
                      </div>
                    ) : (
                      colTasks.map((task) => {
                        const priorityInfo = PRIORITY_MAP[task.priority] || PRIORITY_MAP.Low;
                        const subtaskArr = task.subtasks || [];
                        const completedSubtasks = subtaskArr.filter((s) => s.completed).length;

                        return (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700/80 rounded-xl p-3 shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing space-y-2">
                            
                            <div className="flex items-start justify-between gap-1.5">
                              <p className="text-xs font-extrabold text-gray-900 dark:text-white flex-1 leading-snug">
                                {task.title}
                              </p>
                              <button type="button" onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-rose-600 text-xs font-bold cursor-pointer">✕</button>
                            </div>

                            {subtaskArr.length > 0 && (
                              <div className="space-y-1 bg-gray-100/80 dark:bg-gray-900/40 p-2 rounded-lg border border-gray-200 dark:border-gray-700/50 text-[10px]">
                                <div className="flex justify-between font-extrabold text-gray-800 dark:text-gray-300">
                                  <span>Subtasks</span>
                                  <span className="text-blue-600 dark:text-blue-400 font-black">{completedSubtasks}/{subtaskArr.length}</span>
                                </div>
                                <div className="w-full bg-gray-300 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${Math.round((completedSubtasks / subtaskArr.length) * 100)}%` }} />
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center justify-between gap-1 pt-0.5">
                              <div className="flex items-center gap-1">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${priorityInfo.badge}`}>
                                  {priorityInfo.label}
                                </span>
                                {task.dueTime && (
                                  <span className="text-[9px] font-black text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-1.5 py-0.5 rounded-md">
                                    ⏰ {formatTimeLabel(task.dueTime)}
                                  </span>
                                )}
                              </div>

                              <select
                                value={task.boardStatus || (task.completed ? "completed" : "todo")}
                                onChange={(e) => moveTaskToColumn(task.id, e.target.value)}
                                className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-[10px] font-extrabold text-gray-900 dark:text-gray-100 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer">
                                <option value="todo" className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 font-semibold">To Do</option>
                                <option value="in_progress" className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 font-semibold">In Progress</option>
                                <option value="completed" className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 font-semibold">Completed</option>
                              </select>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
