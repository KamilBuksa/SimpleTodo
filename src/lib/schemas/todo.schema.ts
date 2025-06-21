import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title cannot be longer than 255 characters"),
  description: z.string().max(4000, "Description cannot be longer than 4000 characters").nullable().optional(),
  deadline: z
    .string()
    .refine((date) => {
      if (!date) return true;
      // Accept both date (YYYY-MM-DD) and datetime (ISO 8601) formats
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
      return dateRegex.test(date) || datetimeRegex.test(date);
    }, "Deadline must be a valid date")
    .refine((date) => {
      if (!date) return true;
      const deadlineDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
      return deadlineDate >= today;
    }, "Deadline cannot be in the past")
    .nullable()
    .optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title cannot be longer than 255 characters").optional(),
  description: z.string().max(4000, "Description cannot be longer than 4000 characters").nullable().optional(),
  deadline: z
    .string()
    .refine((date) => {
      if (!date) return true;
      // Accept both date (YYYY-MM-DD) and datetime (ISO 8601) formats
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
      return dateRegex.test(date) || datetimeRegex.test(date);
    }, "Deadline must be a valid date")
    // Note: Past date validation removed for updates to allow editing existing tasks
    // with deadlines that may have passed since creation
    .nullable()
    .optional(),
});

export const toggleTodoStatusSchema = z.object({
  completed: z.boolean(),
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>;
export type UpdateTodoSchema = z.infer<typeof updateTodoSchema>;
export type ToggleTodoStatusSchema = z.infer<typeof toggleTodoStatusSchema>;
