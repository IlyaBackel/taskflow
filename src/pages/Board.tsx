import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBoard } from '../hooks/useBoard';
import { useColumns } from '../hooks/useColumns';
import { useTasks } from '../hooks/useTasks';
import { useRealtimeBoard } from '../hooks/useRealtimeBoard';
import BoardHeader from '../components/board/BoardHeader';
import BoardContent from '../components/board/BoardContent';
import CreateColumnModal from '../components/board/CreateColumnModal';
import BoardMembersModal from '../components/board/members/BoardMembersModal';
import TaskFormModal from '../components/task/TaskFormModal';
import SectionErrorBoundary from '../components/shared/SectionErrorBoundary';
import ErrorState from '../components/shared/ErrorState';
import { BoardSkeleton } from '../components/shared/LoadingSkeleton';
import type { Task } from '../types/task';
import type { TaskFormData } from '../schemas/task.schema';

export default function Board() {
    const { id } = useParams<{ id: string }>();

    const { board, columns, tasks, isLoading, error } = useBoard(id!);

    useRealtimeBoard(id);

    const { createColumn, updateColumn, deleteColumn, isCreating: isCreatingColumn } =
        useColumns(id!);

    const {
        createTask,
        updateTask,
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

    if (isLoading) return <BoardSkeleton />;
    if (error)
        return (
            <ErrorState
                message={error.message}
                onRetry={() => window.location.reload()}
            />
        );
    if (!board || !id) return <ErrorState message="Board not found" />;

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
                <BoardHeader
                    board={board}
                    onMembersClick={() => setIsMembersModalOpen(true)}
                />
            </div>

            <SectionErrorBoundary
                fallbackTitle="Board couldn't be displayed"
                resetKeys={[board.id]}
            >
                <BoardContent
                    boardId={board.id}
                    columns={columns}
                    tasks={tasks}
                    updateTasksBulk={updateTasksBulk}
                    onAddColumnClick={() => setIsColumnModalOpen(true)}
                    onRenameColumn={(colId, title) =>
                        updateColumn({ columnId: colId, updates: { title } })
                    }
                    onDeleteColumn={deleteColumn}
                    onAddTask={handleOpenCreateTask}
                    onTaskClick={setSelectedTask}
                />
            </SectionErrorBoundary>

            <CreateColumnModal
                isOpen={isColumnModalOpen}
                onClose={() => setIsColumnModalOpen(false)}
                onCreate={handleAddColumn}
                isCreating={isCreatingColumn}
            />

            <SectionErrorBoundary
                fallbackTitle="Members list failed"
                resetKeys={[board.id]}
            >
                <BoardMembersModal
                    isOpen={isMembersModalOpen}
                    onClose={() => setIsMembersModalOpen(false)}
                    boardId={board.id}
                />
            </SectionErrorBoundary>

            <SectionErrorBoundary
                fallbackTitle="Task form failed"
                resetKeys={[isCreateTaskModalOpen]}
            >
                <TaskFormModal
                    isOpen={isCreateTaskModalOpen}
                    onClose={handleCloseCreateTask}
                    boardId={board.id}
                    mode="create"
                    onSubmit={handleCreateTask}
                    isLoading={isCreatingTask}
                />
            </SectionErrorBoundary>

            <SectionErrorBoundary
                fallbackTitle="Task form failed"
                resetKeys={[selectedTask?.id]}
            >
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
            </SectionErrorBoundary>
        </div>
    );
}