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

export default function Column({
    column,
    tasks,
    onRename,
    onDelete,
    onAddTask,
    onTaskClick,
}: ColumnProps) {
    return (
        <div
            className="min-w-[250px] bg-[var(--color-card-bg)] p-3 rounded shadow border-l-4"
            style={{ borderLeftColor: column.color || '#e2e8f0' }}
        >
            <ColumnHeader
                title={column.title}
                color={column.color}
                onRename={(newTitle) => onRename(column.id, newTitle)}
                onDelete={() => onDelete(column.id)}
            />

            <TaskList tasks={tasks} onTaskClick={onTaskClick} />

            <button
                onClick={onAddTask}
                className="mt-2 w-full text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-border)] py-2 rounded transition-colors flex items-center justify-center gap-1"
            >
                + Add task
            </button>
        </div>
    );
}