import React from "react";
import { calculateTaskStats } from "../../lib/utils";
import type { TaskViewModel } from "../../types";

interface DashboardProps {
  tasks: TaskViewModel[];
  allTasks: TaskViewModel[];
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, allTasks }) => {
  const stats = calculateTaskStats(allTasks);

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: "📋",
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: "✅",
      color: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
      border: "border-green-200 dark:border-green-800",
    },
    {
      title: "Active",
      value: stats.active,
      icon: "⏳",
      color: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300",
      border: "border-yellow-200 dark:border-yellow-800",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: "🚨",
      color: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",
      border: "border-red-200 dark:border-red-800",
    },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.title} className={`p-4 rounded-lg border ${stat.color} ${stat.border}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress and Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Completion Rate */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Completion Rate</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stats.completionRate}%</span>
          </div>
        </div>

        {/* Today's Activity */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Today's Activity</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Created:</span>
              <span className="font-medium">{stats.createdToday}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Completed:</span>
              <span className="font-medium text-green-600 dark:text-green-400">{stats.completedToday}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
