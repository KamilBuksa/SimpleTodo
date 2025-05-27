import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title cannot be longer than 255 characters'),
  description: z.string()
    .max(4000, 'Description cannot be longer than 4000 characters')
    .nullable()
    .optional(),
  deadline: z.string()
    .datetime('Deadline must be a valid ISO 8601 date string')
    .refine(
      (date) => !date || new Date(date) > new Date(),
      'Deadline cannot be in the past'
    )
    .nullable()
    .optional(),
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>; 