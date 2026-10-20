import { useState, useRef } from 'react';
import {
    DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners,
    type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core';
import Column from './column/Column';
import TaskCard from '../task/TaskCard';
import type { Column as ColumnType } from '../../types/column';
import type { Task } from '../../types/task';
import { reorderTasks } from '../../utils/reorderTasks';

interface BoardContentProps {
    boardId: string;
    columns: ColumnType[];
    tasks: Task[];
    updateTasksBulk: (args: {
        updates: Array<{ id: string; column_id: string; position: number }>;
        newTasks: Task[];
    }) => Promise<void>;
    onAddColumnClick: () => void;
    onRenameColumn: (columnId: string, title: string) => void;
    onDeleteColumn: (columnId: string) => void;
    onAddTask: (columnId: string) => void;
    onTaskClick: (task: Task) => void;
}

const byPosition = (a: Task, b: Task) => a.position - b.position;

export default function BoardContent({
    columns, tasks, updateTasksBulk,
    onAddColumnClick, onRenameColumn, onDeleteColumn, onAddTask, onTaskClick,
}: BoardContentProps) {
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const dragStartColumnRef = useRef<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const findColumnId = (id: string): string | null => {
        if (columns.some((c) => c.id === id)) return id;
        return tasks.find((t) => t.id === id)?.column_id ?? null;
    };

    const handleDragStart = ({ active }: DragStartEvent) => {
        const task = tasks.find((t) => t.id === active.id);
        if (task) {
            setActiveTask(task);
            dragStartColumnRef.current = task.column_id;
        }
    };

    const handleDragEnd = async ({ active, over }: DragEndEvent) => {
        setActiveTask(null);

        const originalColumnId = dragStartColumnRef.current;
        dragStartColumnRef.current = null;
        if (!over || !originalColumnId) return;

        const overId = String(over.id);
        const targetColumnId = findColumnId(overId);
        if (!targetColumnId) return;

        const activeTask = tasks.find((t) => t.id === active.id);
        if (!activeTask) return;

        const tasksWithOriginal = tasks.map((t) =>
            t.id === activeTask.id ? { ...t, column_id: originalColumnId } : t
        );

        const result = reorderTasks(tasksWithOriginal, String(active.id), overId, targetColumnId);
        if (!result) return;

        await updateTasksBulk({
            updates: result.updates,
            newTasks: result.newTasks,
        });
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
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