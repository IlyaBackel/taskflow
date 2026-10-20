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

interface UpdateTaskArgs {
    taskId: string;
    updates: Partial<Task>;
}

interface ReorderArgs {
    updates: Array<{ id: string; column_id: string; position: number }>;
    newTasks: Task[];
}

export const useTasks = (boardId: string) => {
    const { user } = useUserData();
    const queryClient = useQueryClient();
    const queryKey = ['tasks', boardId];

    const createMutation = useMutation({
        mutationFn: (args: CreateTaskArgs) => {
            if (!user) throw new Error('User not authenticated');
            return createTask({ ...args, userId: user.id });
        },
        onMutate: async (args) => {
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<Task[]>(queryKey);

            const tempId = `temp-${Date.now()}`;
            const optimistic: Task = {
                id: tempId,
                column_id: args.columnId,
                board_id: boardId,
                title: args.title,
                description: args.description ?? null,
                priority: args.priority ?? 'medium',
                due_date: args.due_date ?? null,
                assignee_id: args.assignee_id ?? null,
                position: args.position,
                created_by: user?.id ?? '',
                created_at: new Date().toISOString(),
            };

            queryClient.setQueryData<Task[]>(queryKey, (old = []) => [...old, optimistic]);
            return { previous, tempId };
        },
        onSuccess: (created, _args, ctx) => {
            queryClient.setQueryData<Task[]>(queryKey, (old = []) => {
                if (old.some((t) => t.id === created.id)) {
                    return old.filter((t) => t.id !== ctx?.tempId);
                }
                return old.map((t) => (t.id === ctx?.tempId ? created : t));
            });
        },
        onError: (_err, _args, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ taskId, updates }: UpdateTaskArgs) => updateTask(taskId, updates),
        onMutate: async ({ taskId, updates }) => {
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<Task[]>(queryKey);
            queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
                old.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
            );
            return { previous };
        },
        onError: (_, __, context) => {
            if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (taskId: string) => deleteTask(taskId),
        onMutate: async (taskId) => {
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<Task[]>(queryKey);
            queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
                old.filter((t) => t.id !== taskId)
            );
            return { previous };
        },
        onError: (_, __, context) => {
            if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const reorderMutation = useMutation({
        mutationFn: ({ updates }: ReorderArgs) => updateTasksBulk(updates),
        onMutate: async ({ newTasks }) => {
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<Task[]>(queryKey);

            // Оптимистично ставим новый порядок, чтобы карточка не залипала при дропе
            queryClient.setQueryData<Task[]>(queryKey, newTasks);

            return { previous };
        },
        onError: (_, __, context) => {
            // Если сервер вернул ошибку, откатываемся к старой позиции
            if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
        },
        //onSettled УДАЛЕН — кэш обновит подписка Supabase
    });
    return {
        createTask: createMutation.mutateAsync,
        updateTask: updateMutation.mutateAsync,
        deleteTask: deleteMutation.mutateAsync,
        updateTasksBulk: reorderMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isReordering: reorderMutation.isPending,
    };
};