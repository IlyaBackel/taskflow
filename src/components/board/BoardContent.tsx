import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent,
} from '@dnd-kit/core';
import { useQueryClient } from '@tanstack/react-query';
import Column from './column/Column';
import TaskCard from '../task/TaskCard';
import type { Column as ColumnType } from '../../types/column';
import type { Task } from '../../types/task';
import { reorderTasks } from '../../utils/reorderTasks';

interface BoardContentProps {
    boardId: string;
    columns: ColumnType[];
    tasks: Task[];
    updateTasksBulk: (
        updates: Array<{ id: string; column_id: string; position: number }>
    ) => Promise<void>;
    onAddColumnClick: () => void;
    onRenameColumn: (columnId: string, title: string) => void;
    onDeleteColumn: (columnId: string) => void;
    onAddTask: (columnId: string) => void;
    onTaskClick: (task: Task) => void;
}

const byPosition = (a: Task, b: Task) => a.position - b.position;

export default function BoardContent({
    boardId,
    columns,
    tasks,
    updateTasksBulk,
    onAddColumnClick,
    onRenameColumn,
    onDeleteColumn,
    onAddTask,
    onTaskClick,
}: BoardContentProps) {
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const queryClient = useQueryClient();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const findColumnId = (id: string): string | null => {
        if (columns.some((c) => c.id === id)) return id;
        return tasks.find((t) => t.id === id)?.column_id ?? null;
    };

    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveTask(tasks.find((t) => t.id === active.id) ?? null);
    };

    const handleDragOver = ({ active, over }: DragOverEvent) => {
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        const activeTask = tasks.find((t) => t.id === activeId);
        if (!activeTask) return;

        const targetColumnId = findColumnId(overId);
        if (!targetColumnId || activeTask.column_id === targetColumnId) return;

        queryClient.setQueryData<Task[]>(['tasks', boardId], (old = []) =>
            old.map((t) =>
                t.id === activeId ? { ...t, column_id: targetColumnId } : t
            )
        );
    };

    const handleDragEnd = async ({ active, over }: DragEndEvent) => {
        setActiveTask(null);
        if (!over) return;

        const overId = String(over.id);
        const targetColumnId = findColumnId(overId);
        if (!targetColumnId) return;

        const result = reorderTasks(tasks, String(active.id), overId, targetColumnId);
        if (!result) return;

        const previous = queryClient.getQueryData<Task[]>(['tasks', boardId]);
        queryClient.setQueryData(['tasks', boardId], result.newTasks);

        try {
            await updateTasksBulk(result.updates);
        } catch (err) {
            console.error('Reorder failed:', err);
            if (previous) queryClient.setQueryData(['tasks', boardId], previous);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <button
                onClick={onAddColumnClick}
                className="my-5 lg:w-20 lg:h-20 w-10 h-10 flex items-center cursor-pointer justify-center text-4xl text-secondary-text bg-card-bg rounded-full shadow border border-border-primary transition-colors hover:bg-border-primary"
            >
                +
            </button>

            <div className="flex gap-4 overflow-x-auto pb-4 items-start">
                {columns.map((column) => (
                    <Column
                        key={column.id}
                        column={column}
                        tasks={tasks
                            .filter((t) => t.column_id === column.id)
                            .sort(byPosition)}
                        onRename={onRenameColumn}
                        onDelete={onDeleteColumn}
                        onAddTask={() => onAddTask(column.id)}
                        onTaskClick={onTaskClick}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} onClick={() => { }} /> : null}
            </DragOverlay>
        </DndContext>
    );
}