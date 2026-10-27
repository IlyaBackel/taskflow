import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types/task';
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
    } = useSortable({
        id: task.id,
        data: { type: 'task' },
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? transition : undefined,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onDoubleClick={() => onClick(task)}
            role="button"
            aria-roledescription="sortable task"
            aria-label={`${task.title}. Double-click to edit, or press Space to drag.`}
            className="p-2 bg-primary-bg rounded shadow-sm cursor-grab active:cursor-grabbing transition-colors focus:outline-none focus:ring-2 focus:ring-primary touch-none select-none"
            title="Double-click to edit"
        >
            <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-primary text-sm">
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
                <p className="text-xs text-secondary-text text-center">
                    {new Date(task.due_date).toLocaleDateString()}
                </p>
            )}
        </div>
    );
}