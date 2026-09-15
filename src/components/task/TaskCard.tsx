import { useSortable } from '@dnd-kit/react/sortable';
import { getPriorityColor } from '../../utils/priority';
import type { Task } from '../../types/task';

interface TaskCardProps {
    task: Task;
    index: number;
    columnId: string;
    onClick: (task: Task) => void;
}

export default function TaskCard({ task, index, columnId, onClick }: TaskCardProps) {
    const { ref, isDragging } = useSortable({
        id: task.id,
        index,
        type: 'task',
        accept: 'task',
        group: columnId,
    });

    return (
        <div
            ref={ref}
            data-dragging={isDragging}
            onClick={() => onClick(task)}
            className={`p-2 bg-primary-bg rounded shadow-sm cursor-grab active:cursor-grabbing transition-opacity ${isDragging ? 'opacity-40' : 'opacity-100'
                }`}
        >
            <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-primary-text">{task.title}</span>
                {task.priority && (
                    <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                    </span>
                )}
            </div>
            {task.due_date && (
                <p className="text-xs text-secondary-text mt-1">
                    {new Date(task.due_date).toLocaleDateString()}
                </p>
            )}
        </div>
    );
}