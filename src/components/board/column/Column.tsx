import { useDroppable } from '@dnd-kit/core';
import ColumnHeader from './ColumnHeader';
import TaskList from './TaskList';
import type { Task } from '../../../types/task';
import type { Column } from '../../../types/column';

interface ColumnProps {
    column: Column;
    tasks: Task[];
    onRename: (id: string, title: string) => void;
    onDelete: (id: string) => void;
    onAddTask: () => void;
    onTaskClick: (task: Task) => void;
}

export default function Column({ column, tasks, onRename, onDelete, onAddTask, onTaskClick }: ColumnProps) {
    const { setNodeRef } = useDroppable({
        id: column.id,
        data: { type: 'column', columnId: column.id },
    });

    return (
        <div
            ref={setNodeRef}
            className="min-w-62.5 bg-card-bg p-3 rounded shadow border-l-4 pb-9"
            style={{ borderLeftColor: column.color || '#e2e8f0' }}
        >
            <ColumnHeader
                title={column.title}
                color={column.color}
                onRename={(t) => onRename(column.id, t)}
                onDelete={() => onDelete(column.id)}
                onAddTask={onAddTask}
            />
            <TaskList tasks={tasks} onTaskClick={onTaskClick} />

        </div>
    );
}