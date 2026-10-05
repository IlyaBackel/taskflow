import { arrayMove } from '@dnd-kit/sortable';
import type { Task } from '../types/task';

interface ReorderResult {
    updates: Array<{ id: string; column_id: string; position: number }>;
    newTasks: Task[];
}

const byPosition = (a: Task, b: Task) => a.position - b.position;

export const reorderTasks = (
    allTasks: Task[],
    activeId: string,
    overId: string,
    targetColumnId: string,
): ReorderResult | null => {
    const activeTask = allTasks.find((t) => t.id === activeId);
    if (!activeTask) return null;

    const columnTasks = allTasks
        .filter((t) => t.column_id === targetColumnId)
        .sort(byPosition);

    const isOverColumn = !columnTasks.some((t) => t.id === overId);

    let newOrder: Task[];

    if (isOverColumn) {
        newOrder = [
            ...columnTasks.filter((t) => t.id !== activeId),
            activeTask,
        ];
    } else if (activeTask.column_id === targetColumnId) {
        const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
        const newIndex = columnTasks.findIndex((t) => t.id === overId);

        if (oldIndex === newIndex || oldIndex < 0 || newIndex < 0) return null;

        newOrder = arrayMove(columnTasks, oldIndex, newIndex);
    } else {
        const without = columnTasks.filter((t) => t.id !== activeId);
        const overIndex = columnTasks.findIndex((t) => t.id === overId);
        const newIndex = overIndex >= 0 ? overIndex : without.length;

        newOrder = [
            ...without.slice(0, newIndex),
            activeTask,
            ...without.slice(newIndex),
        ];
    }

    const updates = newOrder.map((t, i) => ({
        id: t.id,
        column_id: targetColumnId,
        position: i,
    }));

    if (activeTask.column_id !== targetColumnId) {
        allTasks
            .filter((t) => t.column_id === activeTask.column_id && t.id !== activeId)
            .sort(byPosition)
            .forEach((t, i) =>
                updates.push({ id: t.id, column_id: t.column_id, position: i })
            );
    }

    const newTasks = allTasks.map((t) => {
        const u = updates.find((x) => x.id === t.id);
        return u ? { ...t, column_id: u.column_id, position: u.position } : t;
    });

    return { updates, newTasks };
};