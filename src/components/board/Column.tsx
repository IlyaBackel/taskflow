import { useState } from 'react';
import Input from '../shared/Input';

interface ColumnProps {
    column: any;
    tasks: any[];
    onRename: (id: string, title: string) => void;
    onDelete: (id: string) => void;
    onAddTask: () => void;
    onTaskClick: (task: any) => void;
}

export default function Column({
    column,
    tasks,
    onRename,
    onDelete,
    onAddTask,
    onTaskClick,
}: ColumnProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingTitle, setEditingTitle] = useState(column.title);

    const handleRename = () => {
        if (editingTitle.trim()) {
            onRename(column.id, editingTitle.trim());
            setIsEditing(false);
        }
    };

    const priorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'low':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <div
            className="min-w-[250px] bg-[var(--color-card-bg)] p-3 rounded shadow border-l-4"
            style={{ borderLeftColor: column.color || '#e2e8f0' }}
        >
            <div className="flex items-center justify-between mb-2">
                {isEditing ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleRename();
                        }}
                        className="flex-1"
                    >
                        <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={handleRename}
                            autoFocus
                            className="text-sm"
                        />
                    </form>
                ) : (
                    <h3
                        className="font-semibold cursor-pointer hover:text-[var(--color-primary)]"
                        onDoubleClick={() => setIsEditing(true)}
                        style={{ color: column.color || 'var(--color-text-primary)' }}
                    >
                        {column.title}
                    </h3>
                )}
                <button
                    onClick={() => onDelete(column.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                >
                    ✕
                </button>
            </div>

            <div className="space-y-2">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className="p-2 bg-[var(--color-primary-bg)] rounded shadow-sm cursor-pointer hover:bg-[var(--color-border)] transition-colors"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <span className="font-medium text-[var(--color-text-primary)]">
                                {task.title}
                            </span>
                            {task.priority && (
                                <span
                                    className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${priorityColor(task.priority)}`}
                                >
                                    {task.priority}
                                </span>
                            )}
                        </div>
                        {task.due_date && (
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                📅 {new Date(task.due_date).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={onAddTask}
                className="mt-2 w-full text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-border)] py-2 rounded transition-colors flex items-center justify-center gap-1"
            >
                + Add task
            </button>
        </div>
    );
}