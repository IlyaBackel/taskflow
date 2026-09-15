import { useDroppable } from '@dnd-kit/react';
import { CollisionPriority } from '@dnd-kit/abstract';
import ColumnHeader from './ColumnHeader';
import TaskList from './TaskList';
import type { Task } from '../../../types/task';

interface ColumnProps {
    column: any;
    tasks: Task[];
    onRename: (id: string, title: string) => void;
    onDelete: (id: string) => void;
    onAddTask: () => void;
    onTaskClick: (task: Task) => void;
}

export default function Column({ column, tasks, onRename, onDelete, onAddTask, onTaskClick }: ColumnProps) {
    const { ref, isDropTarget } = useDroppable({
        id: column.id,
        type: 'column',
        accept: 'task',
        collisionPriority: CollisionPriority.Low,
    });

    return (
        <div
            ref={ref}
            className={`min-w-62.5 bg-card-bg p-3 rounded shadow border-l-4 transition-colors ${isDropTarget ? 'bg-border-primary' : ''
                }`}
            style={{ borderLeftColor: column.color || '#e2e8f0' }}
        >
            <ColumnHeader
                title={column.title}
                color={column.color}
                onRename={(newTitle) => onRename(column.id, newTitle)}
                onDelete={() => onDelete(column.id)}
            />
            <TaskList tasks={tasks} columnId={column.id} onTaskClick={onTaskClick} />
            <button
                onClick={onAddTask}
                className="mt-2 w-full text-sm text-secondary-text hover:text-primary hover:bg-border-primary py-2 rounded transition-colors flex items-center justify-center gap-1"
            >
                + Add task
            </button>
        </div>
    );
}