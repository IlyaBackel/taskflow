import Column from './column/Column';
import type { Column as ColumnType } from '../../types/column';
import type { Task } from '../../types/task';

interface BoardContentProps {
    columns: ColumnType[];
    tasks: Task[];
    onAddColumnClick: () => void;
    onRenameColumn: (columnId: string, title: string) => void;
    onDeleteColumn: (columnId: string) => void;
    onAddTask: (columnId: string) => void;
    onTaskClick: (task: Task) => void;
}

export default function BoardContent({
    columns,
    tasks,
    onAddColumnClick,
    onRenameColumn,
    onDeleteColumn,
    onAddTask,
    onTaskClick,
}: BoardContentProps) {
    return (
        <>
            <button
                onClick={onAddColumnClick}
                className="my-5 lg:w-20 lg:h-20 w-10 h-10 flex items-center cursor-pointer justify-center text-4xl text-[var(--color-text-secondary)] bg-[var(--color-card-bg)] rounded-full shadow border border-[var(--color-border)] transition-colors hover:bg-[var(--color-border)]"
            >
                +
            </button>

            <div className="flex gap-4 overflow-x-auto pb-4">
                {columns.map((column) => (
                    <Column
                        key={column.id}
                        column={column}
                        tasks={tasks.filter((task) => task.column_id === column.id)}
                        onRename={onRenameColumn}
                        onDelete={onDeleteColumn}
                        onAddTask={() => onAddTask(column.id)}
                        onTaskClick={onTaskClick}
                    />
                ))}
            </div>
        </>
    );
}