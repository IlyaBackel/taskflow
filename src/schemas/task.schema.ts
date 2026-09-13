import { z } from 'zod';

export const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional().or(z.literal('')),
    priority: z.enum(['low', 'medium', 'high']),
    due_date: z.string().min(1, 'Deadline is required'),
    assignee_id: z.string().min(1, 'Assignee is required'),
}).refine((data) => {
    if (!data.due_date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(data.due_date);
    return dueDate >= today;
}, {
    message: 'Deadline cannot be in the past',
    path: ['due_date'],
});

export type TaskFormData = z.infer<typeof taskSchema>;