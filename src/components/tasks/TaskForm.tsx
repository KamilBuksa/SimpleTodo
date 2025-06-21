import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { getPriorityLabel, parseTimeEstimate, formatTimeEstimate } from "../../lib/utils";
import type { CreateTodoCommandDTO, UpdateTodoCommandDTO } from "../../types";

interface TaskFormProps {
  initialValues?: Partial<CreateTodoCommandDTO>;
  onSubmit: (values: CreateTodoCommandDTO | UpdateTodoCommandDTO) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

const MAX_DESCRIPTION = 4000;

export const TaskForm: React.FC<TaskFormProps> = ({ initialValues, onSubmit, onCancel, isEditing }) => {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [deadline, setDeadline] = useState(initialValues?.deadline ?? "");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">(initialValues?.priority ?? "medium");
  const [timeEstimateInput, setTimeEstimateInput] = useState(
    initialValues?.time_estimate ? formatTimeEstimate(initialValues.time_estimate) : ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track which fields have been touched by the user
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (description && description.length > MAX_DESCRIPTION) newErrors.description = "Description is too long";

    // Validate time estimate
    if (timeEstimateInput.trim()) {
      const parsedTime = parseTimeEstimate(timeEstimateInput);
      if (parsedTime === null) {
        newErrors.time_estimate = "Invalid time format. Use formats like: 2h, 30m, 2h30m, 1d";
      } else if (parsedTime > 10080) {
        newErrors.time_estimate = "Time estimate cannot exceed 7 days";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        // For editing, only send fields that were touched by the user
        const updates: Partial<UpdateTodoCommandDTO> = {};

        if (touchedFields.has("title")) {
          updates.title = title.trim();
        }

        if (touchedFields.has("description")) {
          updates.description = description.trim() || null;
        }

        if (touchedFields.has("deadline")) {
          updates.deadline = deadline || null;
        }

        if (touchedFields.has("priority")) {
          updates.priority = priority;
        }

        if (touchedFields.has("time_estimate")) {
          updates.time_estimate = timeEstimateInput.trim() ? parseTimeEstimate(timeEstimateInput) : null;
        }

        await onSubmit(updates as UpdateTodoCommandDTO);
      } else {
        // For creating, send all fields
        const timeEstimate = timeEstimateInput.trim() ? parseTimeEstimate(timeEstimateInput) : null;
        await onSubmit({
          title: title.trim(),
          description: description.trim() || null,
          deadline: deadline || null,
          priority,
          time_estimate: timeEstimate,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTouchedFields((prev) => new Set(prev).add("title"));
          }}
          className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setTouchedFields((prev) => new Set(prev).add("description"));
          }}
          rows={3}
          className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Deadline (optional)
        </label>
        <input
          id="deadline"
          type="date"
          value={deadline ?? ""}
          onChange={(e) => {
            setDeadline(e.target.value);
            setTouchedFields((prev) => new Set(prev).add("deadline"));
          }}
          className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value as "low" | "medium" | "high" | "urgent");
            setTouchedFields((prev) => new Set(prev).add("priority"));
          }}
          className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
        >
          <option value="low">🔵 {getPriorityLabel("low")}</option>
          <option value="medium">🟡 {getPriorityLabel("medium")}</option>
          <option value="high">🟠 {getPriorityLabel("high")}</option>
          <option value="urgent">🔴 {getPriorityLabel("urgent")}</option>
        </select>
      </div>

      <div>
        <label htmlFor="time_estimate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Time Estimate (optional)
        </label>
        <input
          id="time_estimate"
          type="text"
          value={timeEstimateInput}
          onChange={(e) => {
            setTimeEstimateInput(e.target.value);
            setTouchedFields((prev) => new Set(prev).add("time_estimate"));
          }}
          placeholder="e.g., 2h, 30m, 2h30m, 1d"
          className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Format: 2h (hours), 30m (minutes), 2h30m (combined), 1d (days)
        </p>
        {errors.time_estimate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.time_estimate}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
