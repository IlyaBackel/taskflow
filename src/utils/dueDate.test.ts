import { describe, it, expect } from 'vitest';
import { isOverdue } from './dueDate';

describe('isOverdue', () => {
    it('возвращает true для прошедшей даты', () => {
        expect(isOverdue('2020-01-01')).toBe(true);
    });

    it('возвращает false для будущей даты', () => {
        const future = new Date();
        future.setFullYear(future.getFullYear() + 1);
        expect(isOverdue(future.toISOString().split('T')[0])).toBe(false);
    });

    it('возвращает false для null/undefined', () => {
        expect(isOverdue(null)).toBe(false);
        expect(isOverdue(undefined)).toBe(false);
    });
});