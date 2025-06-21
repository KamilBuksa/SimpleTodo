import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track which fields have been touched by the user
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (description && description.length > MAX_DESCRIPTION) newErrors.description = "Description is too long";
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

        await onSubmit(updates as UpdateTodoCommandDTO);
      } else {
        // For creating, send all fields
        await onSubmit({ title: title.trim(), description: description.trim() || null, deadline: deadline || null });
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
