import TaskCard from './TaskCard';
import type { Task } from '../../../types/task';

interface TaskListProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

export default function TaskList({ tasks, onTaskClick }: TaskListProps) {
    return (
        <div className="space-y-2">
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))}
        </div>
    );
}