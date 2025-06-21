import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDeadlineStatus(deadline: string | null): {
  status: "none" | "overdue" | "due-today" | "due-soon" | "future";
  color: string;
  textColor: string;
  label?: string;
} {
  if (!deadline) {
    return { status: "none", color: "", textColor: "" };
  }

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffInHours = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const diffInDays = Math.ceil(diffInHours / 24);

  if (diffInHours < 0) {
    return {
      status: "overdue",
      color: "bg-red-100 dark:bg-red-900/20",
      textColor: "text-red-700 dark:text-red-300",
      label: "Overdue",
    };
  }

  if (diffInHours <= 24) {
    return {
      status: "due-today",
      color: "bg-orange-100 dark:bg-orange-900/20",
      textColor: "text-orange-700 dark:text-orange-300",
      label: diffInHours <= 1 ? "Due in 1 hour" : "Due today",
    };
  }

  if (diffInDays <= 3) {
    return {
      status: "due-soon",
      color: "bg-yellow-100 dark:bg-yellow-900/20",
      textColor: "text-yellow-700 dark:text-yellow-300",
      label: `Due in ${diffInDays} days`,
    };
  }

  return {
    status: "future",
    color: "bg-green-100 dark:bg-green-900/20",
    textColor: "text-green-700 dark:text-green-300",
    label: `Due in ${diffInDays} days`,
  };
}

export function formatDeadline(deadline: string | null): string {
  if (!deadline) return "";

  const date = new Date(deadline);
  const now = new Date();
  const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Tomorrow";
  if (diffInDays === -1) return "Yesterday";
  if (diffInDays < -1) return `${Math.abs(diffInDays)} days ago`;

  return date.toLocaleDateString();
}

// CSV Import/Export utilities
import type { TaskViewModel } from "../types";

export function exportTasksToCSV(tasks: TaskViewModel[]): string {
  const headers = ["Title", "Description", "Deadline", "Priority", "Time Estimate", "Completed", "Created", "Updated"];

  const csvContent = [
    headers.join(","),
    ...tasks.map((task) =>
      [
        `"${(task.title || "").replace(/"/g, '""')}"`,
        `"${(task.description || "").replace(/"/g, '""')}"`,
        task.deadline || "",
        task.priority || "medium",
        task.time_estimate ? formatTimeEstimate(task.time_estimate) : "",
        task.completed ? "Yes" : "No",
        task.created_at || "",
        task.updated_at || "",
      ].join(",")
    ),
  ].join("\n");

  return csvContent;
}

export function downloadCSV(content: string, filename = "tasks.csv"): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function parseCSVToTasks(csvContent: string): Partial<TaskViewModel>[] {
  const lines = csvContent.split("\n");
  if (lines.length < 2) return [];

  const tasks = [];

  for (const line of lines.slice(1)) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const values = parseCSVLine(trimmedLine);
    if (values.length >= 6) {
      const timeEstimateStr = values[4]?.replace(/""/g, '"').replace(/^"|"$/g, "") || "";
      const timeEstimate = timeEstimateStr ? parseTimeEstimate(timeEstimateStr) : null;

      tasks.push({
        title: values[0]?.replace(/""/g, '"').replace(/^"|"$/g, "") || "",
        description: values[1]?.replace(/""/g, '"').replace(/^"|"$/g, "") || null,
        deadline: values[2] || null,
        priority: (values[3] as "low" | "medium" | "high" | "urgent") || "medium",
        time_estimate: timeEstimate,
        completed: values[5]?.toLowerCase() === "yes",
      });
    }
  }

  return tasks;
}

function parseCSVLine(line: string): string[] {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

// Search functionality
export function searchTasks(tasks: TaskViewModel[], searchTerm: string): TaskViewModel[] {
  if (!searchTerm.trim()) return tasks;

  const term = searchTerm.toLowerCase();
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(term) || (task.description && task.description.toLowerCase().includes(term))
  );
}

// Statistics utilities
export function calculateTaskStats(tasks: TaskViewModel[]) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const overdue = tasks.filter((t) => {
    if (!t.deadline || t.completed) return false;
    return new Date(t.deadline) < new Date();
  }).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Tasks created today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const createdToday = tasks.filter((t) => {
    const created = new Date(t.created_at);
    created.setHours(0, 0, 0, 0);
    return created.getTime() === today.getTime();
  }).length;

  // Tasks completed today
  const completedToday = tasks.filter((t) => {
    if (!t.completed) return false;
    const updated = new Date(t.updated_at);
    updated.setHours(0, 0, 0, 0);
    return updated.getTime() === today.getTime();
  }).length;

  return {
    total,
    completed,
    active,
    overdue,
    completionRate,
    createdToday,
    completedToday,
  };
}

// Priority utilities
export function getPriorityColor(priority: "low" | "medium" | "high" | "urgent"): string {
  switch (priority) {
    case "low":
      return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700";
    case "medium":
      return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
    case "high":
      return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30";
    case "urgent":
      return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
    default:
      return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700";
  }
}

export function getPriorityIcon(priority: "low" | "medium" | "high" | "urgent"): string {
  switch (priority) {
    case "low":
      return "🔵";
    case "medium":
      return "🟡";
    case "high":
      return "🟠";
    case "urgent":
      return "🔴";
    default:
      return "🔵";
  }
}

export function getPriorityLabel(priority: "low" | "medium" | "high" | "urgent"): string {
  switch (priority) {
    case "low":
      return "Low";
    case "medium":
      return "Medium";
    case "high":
      return "High";
    case "urgent":
      return "Urgent";
    default:
      return "Medium";
  }
}

// Time estimate utilities
export function formatTimeEstimate(minutes: number | null): string {
  if (!minutes) return "";

  if (minutes < 60) {
    return `${minutes}m`;
  } else if (minutes < 1440) {
    // Less than 24 hours
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}m`;
  } else {
    // 24 hours or more
    const days = Math.floor(minutes / 1440);
    const remainingHours = Math.floor((minutes % 1440) / 60);
    if (remainingHours === 0) {
      return `${days}d`;
    }
    return `${days}d ${remainingHours}h`;
  }
}

export function parseTimeEstimate(input: string): number | null {
  if (!input.trim()) return null;

  // Remove all spaces and convert to lowercase
  const cleanInput = input.replace(/\s+/g, "").toLowerCase();

  // Match patterns like: 2h, 30m, 2h30m, 1d, 1d2h, etc.
  const timePattern = /^(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?$/;
  const match = cleanInput.match(timePattern);

  if (!match) {
    // Try to parse as just a number (assume minutes)
    const numberMatch = cleanInput.match(/^(\d+)$/);
    if (numberMatch) {
      return parseInt(numberMatch[1], 10);
    }
    return null;
  }

  const [, days, hours, minutes] = match;
  let totalMinutes = 0;

  if (days) totalMinutes += parseInt(days, 10) * 1440; // 24 * 60
  if (hours) totalMinutes += parseInt(hours, 10) * 60;
  if (minutes) totalMinutes += parseInt(minutes, 10);

  return totalMinutes > 0 ? totalMinutes : null;
}
