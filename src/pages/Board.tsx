import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBoard } from '../hooks/useBoard';
import { useColumns } from '../hooks/useColumns';
import { useTasks } from '../hooks/useTasks';
import BoardHeader from '../components/board/BoardHeader';
import BoardContent from '../components/board/BoardContent';
import CreateColumnModal from '../components/board/CreateColumnModal';
import BoardMembersModal from '../components/board/members/BoardMembersModal';
import TaskFormModal from '../components/task/TaskFormModal';
import type { Task } from '../types/task';
import type { TaskFormData } from '../schemas/task.schema';

export default function Board() {
    const { id } = useParams<{ id: string }>();
    const { board, columns, tasks, isLoading, error } = useBoard(id!);

    const {
        createColumn,
        updateColumn,
        deleteColumn,
        isCreating: isCreatingColumn,
    } = useColumns(id!);

    const {
        createTask,
        updateTask,        // ← ДОБАВЛЕНО
        updateTasksBulk,
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

    const handleCloseCreateTask = () => {
        setIsCreateTaskModalOpen(false);
        setActiveColumnId(null);
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
        // ✅ используем updateTask, а не updateTasksBulk
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

            <BoardContent
                boardId={board.id}
                columns={columns}
                tasks={tasks}
                updateTasksBulk={updateTasksBulk}
                onAddColumnClick={() => setIsColumnModalOpen(true)}
                onRenameColumn={(colId, title) => updateColumn({ columnId: colId, updates: { title } })}
                onDeleteColumn={deleteColumn}
                onAddTask={handleOpenCreateTask}
                onTaskClick={setSelectedTask}
            />

            <CreateColumnModal
                isOpen={isColumnModalOpen}
                onClose={() => setIsColumnModalOpen(false)}
                onCreate={handleAddColumn}
                isCreating={isCreatingColumn}
            />

            <BoardMembersModal
                isOpen={isMembersModalOpen}
                onClose={() => setIsMembersModalOpen(false)}
                boardId={board.id}
            />

            <TaskFormModal
                isOpen={isCreateTaskModalOpen}
                onClose={handleCloseCreateTask}
                boardId={board.id}
                mode="create"
                onSubmit={handleCreateTask}
                isLoading={isCreatingTask}
            />

            <TaskFormModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                boardId={board.id}
                mode="edit"
                task={selectedTask}
                onSubmit={handleSaveTask}
                onDelete={handleDeleteTask}
                isLoading={isUpdating}
            />
        </div>
    );
}