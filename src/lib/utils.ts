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
