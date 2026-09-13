import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBoard } from '../hooks/useBoard';
import { useColumns } from '../hooks/useColumns';
import { useTasks } from '../hooks/useTasks';
import Column from '../components/board/Column';
import BoardHeader from '../components/board/BoardHeader';
import CreateColumnModal from '../components/board/CreateColumnModal';
import BoardMembersModal from '../components/board/BoardMembersModal';
import CreateTaskModal from '../components/task/CreateTaskModal';
import TaskModal from '../components/task/TaskModal';
import type { Task } from '../types/task';
import type { TaskFormData } from '../schemas/task.schema';

export default function Board() {
    const { id } = useParams<{ id: string }>();
    const { board, columns, tasks, isLoading, error } = useBoard(id!);
    const { createColumn, updateColumn, deleteColumn, isCreating } = useColumns(id!);
    const {
        createTask,
        updateTask,
        deleteTask,
        isCreating: isCreatingTask,
        isUpdating,
    } = useTasks(id!);

    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    if (isLoading) return <div className="p-4">Loading board...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;
    if (!board) return <div className="p-4">Board not found</div>;

    const handleAddColumn = async (title: string, color: string) => {
        await createColumn({ title, position: columns.length, color });
    };

    const handleOpenCreateTask = (columnId: string) => {
        setActiveColumnId(columnId);
        setIsCreateTaskModalOpen(true);
    };

    const handleCreateTask = async (data: TaskFormData) => {
        if (!activeColumnId) return;
        const position = tasks.filter((t) => t.column_id === activeColumnId).length;
        await createTask({
            columnId: activeColumnId,
            title: data.title,
            position,
            description: data.description,
            priority: data.priority,
            due_date: data.due_date,
            assignee_id: data.assignee_id,
        });
        setActiveColumnId(null);
    };

    const handleSaveTask = async (data: TaskFormData) => {
        if (!selectedTask) return;
        await updateTask({
            taskId: selectedTask.id,
            updates: {
                title: data.title,
                description: data.description || null,
                priority: data.priority,
                due_date: data.due_date || null,
                assignee_id: data.assignee_id || null,
            },
        });
        setSelectedTask(null);
    };

    const handleDeleteTask = async () => {
        if (!selectedTask) return;
        await deleteTask(selectedTask.id);
        setSelectedTask(null);
    };

    return (
        <div className="p-4 w-full">
            <div className="relative mb-4">
                <BoardHeader board={board} />
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={() => setIsMembersModalOpen(true)}
                        className="px-3 py-1.5 text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                        👥 Members
                    </button>
                </div>
            </div>

            <button
                onClick={() => setIsColumnModalOpen(true)}
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
                        onRename={(colId, title) =>
                            updateColumn({ columnId: colId, updates: { title } })
                        }
                        onDelete={deleteColumn}
                        onAddTask={() => handleOpenCreateTask(column.id)}
                        onTaskClick={setSelectedTask}
                    />
                ))}
            </div>

            <CreateColumnModal
                isOpen={isColumnModalOpen}
                onClose={() => setIsColumnModalOpen(false)}
                onCreate={handleAddColumn}
                isCreating={isCreating}
            />

            <BoardMembersModal
                isOpen={isMembersModalOpen}
                onClose={() => setIsMembersModalOpen(false)}
                boardId={board.id}
            />

            <CreateTaskModal
                isOpen={isCreateTaskModalOpen}
                onClose={() => {
                    setIsCreateTaskModalOpen(false);
                    setActiveColumnId(null);
                }}
                boardId={board.id}
                onCreate={handleCreateTask}
                isLoading={isCreatingTask}
            />

            <TaskModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                boardId={board.id}
                task={selectedTask}
                onSave={handleSaveTask}
                onDelete={handleDeleteTask}
                isLoading={isUpdating}
            />
        </div>
    );
}