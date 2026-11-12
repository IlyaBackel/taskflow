import { describe, it, expect } from 'vitest';
import { taskSchema } from './task.schema';

describe('taskSchema', () => {
    it('валидна с одним только title', () => {
        const result = taskSchema.safeParse({ title: 'Fix header' });
        expect(result.success).toBe(true);
    });

    it('невалидна без title', () => {
        const result = taskSchema.safeParse({ title: '' });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0]?.message).toBe('Title is required');
        }
    });

    it('принимает прошедшую дату', () => {
        const result = taskSchema.safeParse({
            title: 'Overdue task',
            due_date: '2020-01-01',
        });
        expect(result.success).toBe(true);
    });
});