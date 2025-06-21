import React from "react";

interface LoadingSkeletonProps {
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = "" }) => {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />;
};

interface TaskSkeletonProps {
  count?: number;
}

export const TaskSkeleton: React.FC<TaskSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm animate-fade-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <LoadingSkeleton className="h-6 w-3/4" />
              <LoadingSkeleton className="h-4 w-1/2" />
              <LoadingSkeleton className="h-4 w-1/4" />
            </div>
            <div className="flex items-center gap-2">
              <LoadingSkeleton className="h-8 w-16" />
              <LoadingSkeleton className="h-8 w-12" />
              <LoadingSkeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="mb-6 space-y-4 animate-fade-slide-up">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-fade-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <LoadingSkeleton className="h-4 w-16" />
                <LoadingSkeleton className="h-8 w-12" />
              </div>
              <LoadingSkeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Progress Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <LoadingSkeleton className="h-4 w-24 mb-2" />
          <div className="flex items-center gap-3">
            <LoadingSkeleton className="flex-1 h-2 rounded-full" />
            <LoadingSkeleton className="h-6 w-12" />
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <LoadingSkeleton className="h-4 w-24 mb-2" />
          <div className="space-y-1">
            <div className="flex justify-between">
              <LoadingSkeleton className="h-4 w-16" />
              <LoadingSkeleton className="h-4 w-8" />
            </div>
            <div className="flex justify-between">
              <LoadingSkeleton className="h-4 w-20" />
              <LoadingSkeleton className="h-4 w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
