import { z } from 'zod';

export const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional().or(z.literal('')),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    due_date: z.string().optional().or(z.literal('')),
    assignee_id: z.string().optional().or(z.literal('')),
});

export type TaskFormInput = z.input<typeof taskSchema>;

export type TaskFormData = z.infer<typeof taskSchema>;