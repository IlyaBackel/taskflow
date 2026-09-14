import { useState } from 'react';
import type { Task } from '../types/task';
import type { TaskFormData } from '../schemas/task.schema';
import { useColumns } from './useColumns';
import { useTasks } from './useTasks';

export const useBoardActions = (boardId: string, tasks: Task[], columnsCount: number) => {
    const { createColumn, updateColumn, deleteColumn, isCreating: isCreatingColumn } = useColumns(boardId);
    const {
        createTask,
        updateTask,
        deleteTask,
        isCreating: isCreatingTask,
        isUpdating,
    } = useTasks(boardId);

    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const handleAddColumn = async (title: string, color: string) => {
        await createColumn({ title, position: columnsCount, color });
    };

    const handleRenameColumn = (columnId: string, title: string) =>
        updateColumn({ columnId, updates: { title } });

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

    return {
        isColumnModalOpen,
        setIsColumnModalOpen,
        isCreatingColumn,
        handleAddColumn,
        handleRenameColumn,
        deleteColumn,

        isCreateTaskModalOpen,
        handleOpenCreateTask,
        handleCloseCreateTask,
        isCreatingTask,
        handleCreateTask,

        selectedTask,
        setSelectedTask,
        handleSaveTask,
        handleDeleteTask,
        isUpdating,

        isMembersModalOpen,
        setIsMembersModalOpen,
    };
};