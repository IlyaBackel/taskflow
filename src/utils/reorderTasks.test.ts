import { describe, it, expect } from 'vitest';
import { reorderTasks } from './reorderTasks';
import type { Task } from '../types/task';

const makeTask = (id: string, column_id: string, position: number): Task => ({
    id,
    column_id,
    board_id: 'board-1',
    title: `Task ${id}`,
    description: null,
    priority: 'medium',
    due_date: null,
    assignee_id: null,
    position,
    created_by: 'user-1',
    created_at: new Date().toISOString(),
});

describe('reorderTasks', () => {
    it('переставляет задачу вниз внутри колонки', () => {
        const tasks = [
            makeTask('A', 'col-1', 0),
            makeTask('B', 'col-1', 1),
            makeTask('C', 'col-1', 2),
        ];

        const result = reorderTasks(tasks, 'A', 'C', 'col-1');

        expect(result).not.toBeNull();

        const sorted = [...result!.newTasks].sort((a, b) => a.position - b.position);
        expect(sorted.map((t) => t.id)).toEqual(['B', 'C', 'A']);
    });

    it('переставляет задачу вверх внутри колонки', () => {
        const tasks = [
            makeTask('A', 'col-1', 0),
            makeTask('B', 'col-1', 1),
            makeTask('C', 'col-1', 2),
        ];

        const result = reorderTasks(tasks, 'C', 'A', 'col-1');

        expect(result).not.toBeNull();

        const sorted = [...result!.newTasks].sort((a, b) => a.position - b.position);
        expect(sorted.map((t) => t.id)).toEqual(['C', 'A', 'B']);
    });

    it('переносит задачу в другую колонку', () => {
        const tasks = [
            makeTask('A', 'col-1', 0),
            makeTask('B', 'col-2', 0),
            makeTask('C', 'col-2', 1),
        ];

        const result = reorderTasks(tasks, 'A', 'B', 'col-2');

        expect(result).not.toBeNull();

        const sortedCol2 = result!.newTasks
            .filter((t) => t.column_id === 'col-2')
            .sort((a, b) => a.position - b.position)
            .map((t) => t.id);

        expect(sortedCol2).toEqual(['A', 'B', 'C']);
    });

    it('переносит задачу в конец пустой колонки', () => {
        const tasks = [
            makeTask('A', 'col-1', 0),
            makeTask('B', 'col-1', 1),
        ];

        const result = reorderTasks(tasks, 'A', 'col-2', 'col-2');

        expect(result).not.toBeNull();
        const moved = result!.newTasks.find((t) => t.id === 'A');
        expect(moved?.column_id).toBe('col-2');
    });

    it('возвращает null, если задача не найдена', () => {
        const tasks = [makeTask('A', 'col-1', 0)];
        const result = reorderTasks(tasks, 'UNKNOWN', 'A', 'col-1');
        expect(result).toBeNull();
    });
});