import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types/task';
import { isOverdue } from '../../utils/dueDate';
import { getPriorityColor } from '../../utils/priority';

interface TaskCardProps {
    task: Task;
    onClick: (task: Task) => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, data: { type: 'task' } });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? transition : undefined,
        opacity: isDragging ? 0.4 : 1,
    };

    const overdue = isOverdue(task.due_date);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onDoubleClick={() => onClick(task)}
            role="button"
            aria-roledescription="sortable task"
            aria-label={`${task.title}. Double-click to edit.${overdue ? ' Overdue.' : ''}`}
            className={`p-2 rounded shadow-sm cursor-grab active:cursor-grabbing transition-colors focus:outline-none focus:ring-2 focus:ring-primary touch-none select-none ${overdue
                ? 'bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800'
                : 'bg-primary-bg'
                }`}
            title={overdue ? 'This task is overdue' : 'Double-click to edit'}
        >
            <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-primary-text text-sm">
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
                <p
                    className={`text-xs mt-1 flex items-center gap-1 ${overdue
                        ? 'text-red-600 dark:text-red-400 font-medium'
                        : 'text-secondary-text'
                        }`}
                >
                    📅 {new Date(task.due_date).toLocaleDateString()}
                    {overdue && (
                        <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-[10px] uppercase tracking-wide">
                            Overdue
                        </span>
                    )}
                </p>
            )}

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(task);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="mt-2 text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-1"
                aria-label={`Open task: ${task.title}`}
            >
                Open
            </button>
        </div>
    );
}