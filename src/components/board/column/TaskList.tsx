import TaskCard from '../../task/TaskCard';
import type { Task } from '../../../types/task';

interface TaskListProps {
    tasks: Task[];
    columnId: string;
    onTaskClick: (task: Task) => void;
}

export default function TaskList({ tasks, columnId, onTaskClick }: TaskListProps) {
    return (
        <div className="space-y-2 min-h-12.5">
            {tasks.map((task, index) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    columnId={columnId}
                    onClick={onTaskClick}
                />
            ))}
        </div>
    );
}