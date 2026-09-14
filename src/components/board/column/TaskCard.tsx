import { getPriorityColor } from '../../../utils/priority';
import type { Task } from '../../../types/task';

interface TaskCardProps {
    task: Task;
    onClick: (task: Task) => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    return (
        <div
            onClick={() => onClick(task)}
            className="p-2 bg-[var(--color-primary-bg)] rounded shadow-sm cursor-pointer hover:bg-[var(--color-border)] transition-colors"
        >
            <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-[var(--color-text-primary)]">
                    {task.title}
                </span>
                {task.priority && (
                    <span
                        className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${getPriorityColor(task.priority)}`}
                    >
                        {task.priority}
                    </span>
                )}
            </div>
            {task.due_date && (
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {new Date(task.due_date).toLocaleDateString()}
                </p>
            )}
        </div>
    );
}