"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/react";

const getTodayString = () => new Date().toISOString().split("T")[0];
const getTomorrowString = () => new Date(Date.now() + 86400000).toISOString().split("T")[0];
const getDayAfterTomorrowString = () => new Date(Date.now() + 172800000).toISOString().split("T")[0];

const INITIAL_TASKS = [
  {
    id: 1,
    title: "build to do list",
    category: "Work",
    priority: "Medium",
    dueDate: getTodayString(),
    dueTime: "14:30",
    boardStatus: "in_progress",
    completed: false,
    subtasks: [
      { id: 101, title: "Design UI mockup", completed: true },
      { id: 102, title: "Connect database backend", completed: false },
    ],
  },
  {
    id: 2,
    title: "30-minute daily morning run",
    category: "Health",
    priority: "Medium",
    dueDate: getTodayString(),
    dueTime: "07:00",
    boardStatus: "completed",
    completed: true,
    subtasks: [
      { id: 201, title: "Stretch 5 mins", completed: true },
      { id: 202, title: "Run 3km", completed: true },
    ],
  },
  {
    id: 3,
    title: "Team weekly sync & roadmap discussion",
    category: "Work",
    priority: "High",
    dueDate: getTomorrowString(),
    dueTime: "10:00",
    boardStatus: "todo",
    completed: false,
    subtasks: [
      { id: 301, title: "Prepare slides", completed: false },
      { id: 302, title: "Gather Q3 metrics", completed: false },
    ],
  },
  {
    id: 4,
    title: "Read 15 pages of productivity book",
    category: "Personal",
    priority: "Low",
    dueDate: getDayAfterTomorrowString(),
    dueTime: "20:00",
    boardStatus: "todo",
    completed: false,
    subtasks: [],
  },
];

const CATEGORIES = ["Work", "Personal", "Health"];
const PRIORITIES = ["Low", "Medium", "High"];
const KANBAN_COLUMNS = [
  { id: "todo", title: "To Do", color: "bg-blue-500", border: "border-blue-200 dark:border-blue-900" },
  { id: "in_progress", title: "In Progress", color: "bg-amber-500", border: "border-amber-200 dark:border-amber-900" },
  { id: "completed", title: "Completed", color: "bg-emerald-500", border: "border-emerald-200 dark:border-emerald-900" },
];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Strict Subtask & Column Sanitizer
const sanitizeTaskStatus = (task) => {
  const subs = task.subtasks || [];
  if (subs.length > 0) {
    const completedCount = subs.filter((s) => s.completed).length;
    const totalCount = subs.length;

    if (completedCount === 0) {
      return { ...task, boardStatus: "todo", completed: false };
    } else if (completedCount > 0 && completedCount < totalCount) {
      return { ...task, boardStatus: "in_progress", completed: false };
    } else if (completedCount === totalCount && totalCount > 0) {
      return { ...task, boardStatus: "completed", completed: true };
    }
  }
  return task;
};

// Time Formatter Helper (24h -> 12h AM/PM)
const formatTimeLabel = (timeStr) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hours = parseInt(h, 10);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${m} ${suffix}`;
};

export default function TaskSection() {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Work");
  const [selectedPriority, setSelectedPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(getTodayString());
  const [dueTime, setDueTime] = useState("09:00");

  // Step 3: Refs for Keyboard Shortcuts
  const addInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // Step 2: Toast notification state
  const [toast, setToast] = useState(null);

  const triggerToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // View Mode: 'list' | 'kanban'
  const [viewMode, setViewMode] = useState("kanban");

  // Drag & Drop state
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Subtask UI state
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  
  // Calendar View State
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);

  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCalendarView, setShowCalendarView] = useState(true);

  // Step 3: Keyboard Shortcuts Event Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K: Focus Search Input
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k" && !e.shiftKey) {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          triggerToast("Focused Search (Ctrl+K)", "info");
        }
      }
      // Ctrl+N or Cmd+N: Focus Add Task Input
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        if (addInputRef.current) {
          addInputRef.current.focus();
          triggerToast("Focused Add Task (Ctrl+N)", "info");
        }
      }
      // Ctrl+Shift+K: Toggle View Mode
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setViewMode((prev) => (prev === "list" ? "kanban" : "list"));
        triggerToast("Toggled View Mode", "info");
      }
      // Escape: Clear search / close modal
      else if (e.key === "Escape") {
        setSearchQuery("");
        setShowShortcutsModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Request browser Notification permissions for reminders
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  // Load tasks from localStorage on client mount & sanitize status
  useEffect(() => {
    const saved = localStorage.getItem("dailytrack_tasks");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const sanitized = parsed.map(sanitizeTaskStatus);
        setTasks(sanitized);
      } catch (e) {
        setTasks(INITIAL_TASKS.map(sanitizeTaskStatus));
      }
    } else {
      setTasks(INITIAL_TASKS.map(sanitizeTaskStatus));
    }
    setIsLoaded(true);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("dailytrack_tasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  // Calendar Helper Logic
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

  // Generate calendar grid days for current month
  const getMonthDays = () => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    for (let d = 1; d <= totalDays; d++) {
      const mStr = String(currentMonth + 1).padStart(2, "0");
      const dStr = String(d).padStart(2, "0");
      const dateStr = `${currentYear}-${mStr}-${dStr}`;
      days.push({ day: d, dateStr });
    }

    return days;
  };

  // Map of tasks by date for color marking
  const taskStatusByDate = {};
  tasks.forEach((task) => {
    if (!task.dueDate) return;
    if (!taskStatusByDate[task.dueDate]) {
      taskStatusByDate[task.dueDate] = {
        hasCompleted: false,
        hasHighPriority: false,
        hasPending: false,
        total: 0,
      };
    }
    const info = taskStatusByDate[task.dueDate];
    info.total += 1;
    if (task.completed || task.boardStatus === "completed") {
      info.hasCompleted = true;
    } else {
      info.hasPending = true;
      if (task.priority === "High") {
        info.hasHighPriority = true;
      }
    }
  });

  // Add Parent Task
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
      new Notification("DailyTrack Reminder Set", {
        body: `Task "${newTask.title}" set for ${formatTimeLabel(newTask.dueTime)}`,
      });
    }
  };

  // Toggle Parent Completion
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const isComp = !task.completed;
          const subtaskArr = task.subtasks || [];
          const updatedSubtasks = subtaskArr.map((s) => ({ ...s, completed: isComp }));
          
          triggerToast(isComp ? `Task completed!` : `Task marked as pending`, isComp ? "success" : "info");

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

  // Move Task to Kanban Column
  const moveTaskToColumn = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const subtaskArr = task.subtasks || [];
          let updatedSubtasks = subtaskArr;

          if (newStatus === "completed" && subtaskArr.length > 0) {
            updatedSubtasks = subtaskArr.map((s) => ({ ...s, completed: true }));
          } else if (newStatus === "todo" && subtaskArr.length > 0) {
            updatedSubtasks = subtaskArr.map((s) => ({ ...s, completed: false }));
          } else if (newStatus === "in_progress" && subtaskArr.length > 0) {
            const hasComp = subtaskArr.some((s) => s.completed);
            if (!hasComp) {
              updatedSubtasks = subtaskArr.map((s, idx) => ({ ...s, completed: idx === 0 }));
            }
          }

          triggerToast(`Moved task to ${newStatus.replace("_", " ")}`);

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

  // Drag and Drop Event Handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (draggedTaskId) {
      moveTaskToColumn(draggedTaskId, colId);
      setDraggedTaskId(null);
    }
  };

  // Delete Parent Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    triggerToast("Task deleted", "info");
  };

  // Subtask Management Handlers
  const handleAddSubtask = (taskId, e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newSub = {
            id: Date.now(),
            title: newSubtaskTitle.trim(),
            completed: false,
          };
          const updatedSubtasks = [...(task.subtasks || []), newSub];
          
          triggerToast(`Subtask item added`);

          return sanitizeTaskStatus({
            ...task,
            subtasks: updatedSubtasks,
          });
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
          
          return sanitizeTaskStatus({
            ...task,
            subtasks: updatedSubtasks,
          });
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
          return sanitizeTaskStatus({
            ...task,
            subtasks: updatedSubtasks,
          });
        }
        return task;
      })
    );
  };

  // Computed stats
  const completedCount = tasks.filter((t) => t.completed || t.boardStatus === "completed").length;
  const totalCount = tasks.length;
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Date Label Helper
  const formatDueDateLabel = (dateStr) => {
    if (!dateStr) return "No Due Date";
    const todayStr = getTodayString();
    const tomorrowStr = getTomorrowString();

    if (dateStr === todayStr) return "Today";
    if (dateStr === tomorrowStr) return "Tomorrow";

    const dateObj = new Date(dateStr + "T00:00:00");
    return dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  // Filtered & Sanitized tasks
  const filteredTasks = tasks.map(sanitizeTaskStatus).filter((task) => {
    const isCompleted = task.completed || task.boardStatus === "completed";
    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Completed"
          ? isCompleted
          : !isCompleted;

    const matchesCategory =
      categoryFilter === "All" ? true : task.category === categoryFilter;

    const matchesDate =
      !selectedDateFilter ? true : task.dueDate === selectedDateFilter;

    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesDate && matchesSearch;
  });

  // Group tasks by Date for List View
  const groupedTasksByDate = {};
  filteredTasks.forEach((task) => {
    const dateKey = task.dueDate || "No Date";
    if (!groupedTasksByDate[dateKey]) {
      groupedTasksByDate[dateKey] = [];
    }
    groupedTasksByDate[dateKey].push(task);
  });

  const sortedDateKeys = Object.keys(groupedTasksByDate).sort((a, b) => {
    if (a === "No Date") return 1;
    if (b === "No Date") return -1;
    return a.localeCompare(b);
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return {
          label: "High",
          dot: "bg-rose-500",
          badge: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/40",
        };
      case "Medium":
        return {
          label: "Medium",
          dot: "bg-amber-500",
          badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40",
        };
      case "Low":
        return {
          label: "Low",
          dot: "bg-emerald-500",
          badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40",
        };
      default:
        return {
          label: priority,
          dot: "bg-gray-400",
          badge: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        };
    }
  };

  const monthDays = getMonthDays();
  const todayString = getTodayString();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 relative">
      
      {/* Floating Toast Notification Container (Step 2) */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-4 py-3 rounded-2xl shadow-xl border border-gray-700 dark:border-gray-200 text-xs font-semibold animate-bounce">
          <span>🔔</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Keyboard Shortcuts Modal (Step 3) */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>⌨️</span> Keyboard Shortcuts
              </h3>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-white text-xs">
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600 dark:text-gray-300">Focus Search Input</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-mono">Ctrl + K</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600 dark:text-gray-300">Focus Add Task Input</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-mono">Ctrl + N</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600 dark:text-gray-300">Toggle View Mode</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-mono">Ctrl + Shift + K</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600 dark:text-gray-300">Clear Search / Close</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded font-mono">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* App Main Card Container */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              My Daily Tasks
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {completedCount} of {totalCount} tasks completed ({progressPercent}%)
            </p>
          </div>
          
          {/* Controls: View Switcher, Shortcuts & Calendar Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Keyboard Shortcuts Button (Step 3) */}
            <button
              type="button"
              onClick={() => setShowShortcutsModal(true)}
              className="px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 cursor-pointer"
              title="Keyboard Shortcuts">
              ⌨️ <span className="hidden sm:inline">Shortcuts</span>
            </button>

            <div className="flex p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}>
                <span>☰</span>
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === "kanban"
                    ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}>
                <span>🤹</span>
                <span>Kanban Board</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowCalendarView(!showCalendarView)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                showCalendarView
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
              }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{showCalendarView ? "Hide Calendar" : "Show Calendar"}</span>
            </button>
          </div>
        </div>

        {/* Full Interactive Calendar Grid Section */}
        {showCalendarView && (
          <div className="bg-gray-50/60 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/60 rounded-2xl p-4 sm:p-6 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </h3>
                <button
                  type="button"
                  onClick={goToToday}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60">
                  Today
                </button>
              </div>

              <div className="flex items-center gap-1">
                {selectedDateFilter && (
                  <button
                    type="button"
                    onClick={() => setSelectedDateFilter(null)}
                    className="text-xs font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white mr-2">
                    Clear Date Filter ({selectedDateFilter})
                  </button>
                )}
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400 mb-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> High Priority
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Pending Task
              </span>
            </div>

            <div className="grid grid-cols-7 text-center mb-2">
              {DAY_LABELS.map((day) => (
                <div key={day} className="text-xs font-semibold text-gray-400 dark:text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {monthDays.map((item, index) => {
                if (!item) {
                  return <div key={`empty-${index}`} className="h-10 sm:h-12" />;
                }

                const { day, dateStr } = item;
                const isToday = dateStr === todayString;
                const isSelected = selectedDateFilter === dateStr;
                const dateTasks = taskStatusByDate[dateStr];

                let bgBadgeClass = "";
                if (dateTasks) {
                  if (dateTasks.hasHighPriority) {
                    bgBadgeClass = "bg-rose-500 text-white";
                  } else if (dateTasks.hasPending) {
                    bgBadgeClass = "bg-blue-600 text-white";
                  } else if (dateTasks.hasCompleted) {
                    bgBadgeClass = "bg-emerald-600 text-white";
                  }
                }

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => {
                      setSelectedDateFilter(isSelected ? null : dateStr);
                      setDueDate(dateStr);
                    }}
                    className={`relative h-10 sm:h-12 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-500/30 bg-blue-50 dark:bg-blue-950/40"
                        : isToday
                        ? "border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/30 font-bold"
                        : "border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}>
                    <span
                      className={`text-xs ${
                        isToday ? "font-bold text-blue-600 dark:text-blue-400" : "text-gray-800 dark:text-gray-200"
                      }`}>
                      {day}
                    </span>

                    {dateTasks && (
                      <span
                        className={`mt-1 px-1.5 py-0.2 text-[9px] font-extrabold rounded-full ${
                          bgBadgeClass || "bg-gray-400 text-white"
                        }`}>
                        {dateTasks.total}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Task Input Bar with Date & Time Picker */}
        <form onSubmit={handleAddTask}>
          <div className="flex flex-col sm:flex-row gap-2 bg-gray-50 dark:bg-gray-800/60 p-2 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 focus-within:border-blue-500 transition-all">
            <input
              ref={addInputRef}
              type="text"
              placeholder="Add a new task... (Ctrl+N)"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            />

            <div className="flex flex-wrap items-center gap-2 px-1">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  setSelectedDateFilter(e.target.value);
                }}
                className="bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
                title="Due Date"
              />

              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
                title="Reminder Time"
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer">
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer">
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0">
                + Add Task
              </Button>
            </div>
          </div>
        </form>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl w-full sm:w-auto">
            {["All", "Pending", "Completed"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}>
                {status}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-48">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Filter tasks... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 text-xs rounded-xl pl-8 pr-3 py-1.5 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
            <svg
              className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* --- VIEW MODE 1: LIST VIEW (Grouped by Day) --- */}
        {viewMode === "list" && (
          <div className="space-y-6">
            {sortedDateKeys.length === 0 ? (
              <div className="py-12 text-center text-gray-400 dark:text-gray-500">
                <svg
                  className="w-10 h-10 mx-auto mb-2 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-sm font-medium">No tasks found</p>
                {selectedDateFilter && (
                  <button
                    type="button"
                    onClick={() => setSelectedDateFilter(null)}
                    className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    Clear date filter
                  </button>
                )}
              </div>
            ) : (
              sortedDateKeys.map((dateKey) => {
                const dayTasks = groupedTasksByDate[dateKey];
                const formattedDate = formatDueDateLabel(dateKey === "No Date" ? "" : dateKey);

                return (
                  <div key={dateKey} className="space-y-2.5">
                    <div className="flex items-center justify-between px-1 pt-2 pb-1 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                          {formattedDate} {dateKey !== "No Date" && <span className="text-xs font-normal text-gray-400 dark:text-gray-500">({dateKey})</span>}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        {dayTasks.length} {dayTasks.length === 1 ? "task" : "tasks"}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {dayTasks.map((task) => {
                        const priorityInfo = getPriorityBadge(task.priority);
                        const subtaskArr = task.subtasks || [];
                        const completedSubtasks = subtaskArr.filter((s) => s.completed).length;
                        const isExpanded = expandedTaskId === task.id;
                        const isTaskCompleted = task.completed || task.boardStatus === "completed";

                        return (
                          <div
                            key={task.id}
                            className={`group flex flex-col rounded-2xl border transition-all ${
                              isTaskCompleted
                                ? "bg-gray-50/60 dark:bg-gray-800/30 border-gray-200/50 dark:border-gray-800/50 opacity-70"
                                : "bg-white dark:bg-gray-800/60 border-gray-200/80 dark:border-gray-700/60 hover:border-blue-300 dark:hover:border-blue-800 shadow-2xs"
                            }`}>
                            
                            <div className="flex items-center justify-between p-3.5">
                              <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                                <button
                                  type="button"
                                  onClick={() => toggleTask(task.id)}
                                  className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                                    isTaskCompleted
                                      ? "bg-blue-600 border-blue-600 text-white"
                                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-500"
                                  }`}>
                                  {isTaskCompleted && (
                                    <svg
                                      className="w-3 h-3 stroke-[3]"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </button>
                                
                                <span
                                  className={`text-sm font-medium truncate ${
                                    isTaskCompleted
                                      ? "line-through text-gray-400 dark:text-gray-500"
                                      : "text-gray-800 dark:text-gray-100"
                                  }`}>
                                  {task.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {task.dueTime && (
                                  <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-900/40">
                                    ⏰ {formatTimeLabel(task.dueTime)}
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                                  className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                                    subtaskArr.length > 0
                                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900"
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200/50 dark:border-gray-700/50"
                                  }`}>
                                  <span>📋</span>
                                  <span>
                                    {subtaskArr.length > 0 ? `${completedSubtasks}/${subtaskArr.length}` : "+ Subtask"}
                                  </span>
                                </button>

                                <span className="hidden sm:inline-block text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                                  {task.category}
                                </span>

                                <span
                                  className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${priorityInfo.badge}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.dot}`} />
                                  {priorityInfo.label}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => deleteTask(task.id)}
                                  className="p-1 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                                  aria-label="Delete task">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="1.8"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Nested Subtasks Container */}
                            {isExpanded && (
                              <div className="px-4 pb-3 pt-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 rounded-b-2xl space-y-2">
                                {subtaskArr.length > 0 && (
                                  <div className="space-y-1.5 pl-4">
                                    {subtaskArr.map((sub) => (
                                      <div key={sub.id} className="flex items-center justify-between group/sub">
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            checked={sub.completed}
                                            onChange={() => toggleSubtask(task.id, sub.id)}
                                            className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                                          />
                                          <span
                                            className={`text-xs ${
                                              sub.completed
                                                ? "line-through text-gray-400 dark:text-gray-500"
                                                : "text-gray-700 dark:text-gray-300"
                                            }`}>
                                            {sub.title}
                                          </span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => deleteSubtask(task.id, sub.id)}
                                          className="text-gray-400 hover:text-red-500 text-xs px-1 transition-opacity opacity-0 group-hover/sub:opacity-100 cursor-pointer">
                                          ✕
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <form
                                  onSubmit={(e) => handleAddSubtask(task.id, e)}
                                  className="flex items-center gap-2 pt-1 pl-4">
                                  <input
                                    type="text"
                                    placeholder="Add subtask item..."
                                    value={newSubtaskTitle}
                                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                    className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                                  />
                                  <button
                                    type="submit"
                                    className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                                    Add
                                  </button>
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

        {/* --- VIEW MODE 2: KANBAN BOARD VIEW (Drag & Drop Columns) --- */}
        {viewMode === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 overflow-x-auto custom-scrollbar pb-2">
            {KANBAN_COLUMNS.map((col) => {
              const colTasks = filteredTasks.filter((t) => {
                const status = t.boardStatus || (t.completed ? "completed" : "todo");
                return status === col.id;
              });

              const isDragOver = dragOverColumn === col.id;

              return (
                <div
                  key={col.id}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={`bg-gray-50/70 dark:bg-gray-800/40 border-2 rounded-2xl p-4 transition-all h-[580px] min-w-[260px] md:min-w-0 flex flex-col ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20"
                      : "border-dashed border-gray-200 dark:border-gray-700/60"
                  }`}>
                  
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60 dark:border-gray-700/60 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">{col.title}</h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gray-200/70 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Column Task Cards Area with Custom Scrollbar */}
                  <div className="space-y-3 flex-1 overflow-y-auto pr-1.5 custom-scrollbar">
                    {colTasks.length === 0 ? (
                      <div className="h-full min-h-[140px] flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-400">Drag tasks here</p>
                      </div>
                    ) : (
                      colTasks.map((task) => {
                        const priorityInfo = getPriorityBadge(task.priority);
                        const subtaskArr = task.subtasks || [];
                        const completedSubtasks = subtaskArr.filter((s) => s.completed).length;

                        return (
                          <div
                            key={task.id}
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-3.5 shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing group space-y-2">
                            
                            {/* Card Header: Drag Handle & Title */}
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs text-gray-300 dark:text-gray-600 cursor-grab">⋮⋮</span>
                              <p className="text-xs font-semibold text-gray-900 dark:text-white flex-1 leading-snug break-words">
                                {task.title}
                              </p>
                              <button
                                type="button"
                                onClick={() => deleteTask(task.id)}
                                className="text-gray-400 hover:text-rose-600 text-xs transition-colors cursor-pointer opacity-50 group-hover:opacity-100 shrink-0">
                                ✕
                              </button>
                            </div>

                            {/* Subtasks Progress Bar & Interactive Checklist inside Kanban Card */}
                            {subtaskArr.length > 0 && (
                              <div className="pt-1 space-y-1.5 bg-gray-50/60 dark:bg-gray-900/40 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50">
                                <div className="flex justify-between text-[10px] font-medium text-gray-500">
                                  <span>Subtasks</span>
                                  <span className="text-blue-600 dark:text-blue-400 font-bold">{completedSubtasks}/{subtaskArr.length}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${Math.round((completedSubtasks / subtaskArr.length) * 100)}%` }}
                                  />
                                </div>

                                <div className="space-y-1 pt-1 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                                  {subtaskArr.map((sub) => (
                                    <div key={sub.id} className="flex items-center gap-1.5">
                                      <input
                                        type="checkbox"
                                        checked={sub.completed}
                                        onChange={() => toggleSubtask(task.id, sub.id)}
                                        className="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer shrink-0"
                                      />
                                      <span className={`text-[10px] truncate ${sub.completed ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
                                        {sub.title}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Card Badges, Reminder Time & Column Selector */}
                            <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                              <div className="flex items-center gap-1">
                                <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${priorityInfo.badge}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.dot}`} />
                                  {priorityInfo.label}
                                </span>

                                {task.dueTime && (
                                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded-md">
                                    ⏰ {formatTimeLabel(task.dueTime)}
                                  </span>
                                )}
                              </div>

                              <select
                                value={task.boardStatus || (task.completed ? "completed" : "todo")}
                                onChange={(e) => moveTaskToColumn(task.id, e.target.value)}
                                className="bg-gray-100 dark:bg-gray-700 text-[10px] font-medium text-gray-600 dark:text-gray-300 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer">
                                <option value="todo">Move to To Do</option>
                                <option value="in_progress">Move to In Progress</option>
                                <option value="completed">Move to Completed</option>
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
