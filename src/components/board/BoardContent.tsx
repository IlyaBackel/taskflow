import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    type DragStartEvent,
    type DragEndEvent,
} from '@dnd-kit/core';
import Column from './column/Column';
import TaskCard from '../task/TaskCard';
import type { Column as ColumnType } from '../../types/column';
import type { Task } from '../../types/task';

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

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveTask(tasks.find((t) => t.id === event.active.id) ?? null);
    };

    const handleDragEnd = async ({ active, over }: DragEndEvent) => {
        setActiveTask(null);
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        const activeTask = tasks.find((t) => t.id === activeId);
        if (!activeTask) return;

        const targetColumnId = columns.some((c) => c.id === overId)
            ? overId
            : tasks.find((t) => t.id === overId)?.column_id;
        if (!targetColumnId) return;

        const targetTasks = tasks
            .filter((t) => t.column_id === targetColumnId && t.id !== activeId)
            .sort(byPosition);

        const overIndex = targetTasks.findIndex((t) => t.id === overId);
        const newIndex = overIndex >= 0 ? overIndex : targetTasks.length;

        const newOrder = [
            ...targetTasks.slice(0, newIndex),
            activeTask,
            ...targetTasks.slice(newIndex),
        ];

        const updates = newOrder.map((task, i) => ({
            id: task.id,
            column_id: targetColumnId,
            position: i,
        }));

        if (activeTask.column_id !== targetColumnId) {
            tasks
                .filter((t) => t.column_id === activeTask.column_id && t.id !== activeId)
                .sort(byPosition)
                .forEach((task, i) => {
                    updates.push({ id: task.id, column_id: task.column_id, position: i });
                });
        }

        await updateTasksBulk(updates);
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

            <div className="flex gap-4 overflow-x-auto pb-4">
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