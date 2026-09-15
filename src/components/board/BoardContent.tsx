import { useQueryClient } from '@tanstack/react-query';
import { DragDropProvider } from '@dnd-kit/react';
import Column from './column/Column';
import type { Column as ColumnType } from '../../types/column';
import type { Task } from '../../types/task';

interface BoardContentProps {
    boardId: string;
    columns: ColumnType[];
    tasks: Task[];
    updateTask: (args: { taskId: string; updates: Partial<Task> }) => Promise<unknown>;
    onAddColumnClick: () => void;
    onRenameColumn: (columnId: string, title: string) => void;
    onDeleteColumn: (columnId: string) => void;
    onAddTask: (columnId: string) => void;
    onTaskClick: (task: Task) => void;
}

export default function BoardContent({
    boardId,
    columns,
    tasks,
    updateTask,
    onAddColumnClick,
    onRenameColumn,
    onDeleteColumn,
    onAddTask,
    onTaskClick,
}: BoardContentProps) {
    const queryClient = useQueryClient();

    const handleDragEnd = async (event: any) => {
        if (event.canceled) return;

        const { source, target } = event.operation;
        if (!source || !target) return;

        const taskId = source.id as string;
        const targetId = target.id as string;

        const activeTask = tasks.find((t) => t.id === taskId);
        if (!activeTask) return;

        const isTargetColumn = target.type === 'column';
        const targetTask = tasks.find((t) => t.id === targetId);
        const targetColumnId = isTargetColumn
            ? (targetId as string)
            : targetTask?.column_id;

        if (!targetColumnId) return;

        const targetTasks = tasks
            .filter((t) => t.column_id === targetColumnId && t.id !== taskId)
            .sort((a, b) => a.position - b.position);

        const newPosition = isTargetColumn
            ? targetTasks.length
            : Math.max(0, targetTasks.findIndex((t) => t.id === targetId));

        const previousTasks = queryClient.getQueryData<Task[]>(['tasks', boardId]);

        queryClient.setQueryData<Task[]>(['tasks', boardId], (old = []) => {
            const updated = old.map((t) =>
                t.id === taskId
                    ? { ...t, column_id: targetColumnId, position: newPosition }
                    : t
            );

            const columnTasks = updated
                .filter((t) => t.column_id === targetColumnId)
                .sort((a, b) => {
                    if (a.id === taskId) return newPosition - (b.position ?? 0);
                    if (b.id === taskId) return (a.position ?? 0) - newPosition;
                    return (a.position ?? 0) - (b.position ?? 0);
                });

            return updated.map((t) => {
                const idx = columnTasks.findIndex((ct) => ct.id === t.id);
                if (idx === -1) return t;
                return { ...t, position: idx };
            });
        });

        try {
            await updateTask({
                taskId,
                updates: {
                    column_id: targetColumnId,
                    position: newPosition,
                },
            });
        } catch (err) {
            console.error('Drag & drop failed:', err);
            if (previousTasks) {
                queryClient.setQueryData(['tasks', boardId], previousTasks);
            }
        }
    };

    return (
        <DragDropProvider onDragEnd={handleDragEnd}>
            <button
                onClick={onAddColumnClick}
                className="my-5 lg:w-20 lg:h-20 w-10 h-10 flex items-center cursor-pointer justify-center text-4xl text-secondary-text bg-card-bg rounded-full shadow border border-border-primary transition-colors hover:bg-border-primary"
            >
                +
            </button>
            <div className="flex gap-4 overflow-x-auto pb-4">
                {columns.map((column) => (
                    <Column
                        key={column.id}
                        column={column}
                        tasks={tasks
                            .filter((task) => task.column_id === column.id)
                            .sort((a, b) => a.position - b.position)}
                        onRename={onRenameColumn}
                        onDelete={onDeleteColumn}
                        onAddTask={() => onAddTask(column.id)}
                        onTaskClick={onTaskClick}
                    />
                ))}
            </div>
        </DragDropProvider>
    );
}