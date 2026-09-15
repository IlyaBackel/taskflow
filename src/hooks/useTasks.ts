import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask, deleteTask, updateTasksBulk } from '../services/taskService';
import { useUserData } from './useUserData';
import type { Priority, Task } from '../types/task';

interface CreateTaskArgs {
    columnId: string;
    title: string;
    position: number;
    description?: string;
    priority?: Priority;
    due_date?: string;
    assignee_id?: string;
}

export const useTasks = (boardId: string) => {
    const { user } = useUserData();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (args: CreateTaskArgs) => {
            if (!user) throw new Error('User not authenticated');
            return createTask({ ...args, userId: user.id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) =>
            updateTask(taskId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (taskId: string) => deleteTask(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
        },
    });

    const bulkUpdateMutation = useMutation({
        mutationFn: (updates: Array<{ id: string; column_id: string; position: number }>) =>
            updateTasksBulk(updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
        },
    });

    return {
        createTask: createMutation.mutateAsync,
        updateTask: updateMutation.mutateAsync,
        deleteTask: deleteMutation.mutateAsync,
        updateTasksBulk: bulkUpdateMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};