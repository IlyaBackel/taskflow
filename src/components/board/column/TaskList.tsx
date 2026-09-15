import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task } from '../../../types/task';
import TaskCard from '../../task/TaskCard';

interface TaskListProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

export default function TaskList({ tasks, onTaskClick }: TaskListProps) {
    return (
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 min-h-12.5">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                ))}
            </div>
        </SortableContext>
    );
}