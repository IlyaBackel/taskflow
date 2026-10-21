import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumn, updateColumn, deleteColumn } from '../services/columnService';
import { notifyError } from '../utils/toast';
import type { Column } from '../types/column';

interface CreateColumnArgs {
    title: string;
    position: number;
    color?: string;
}

interface UpdateColumnArgs {
    columnId: string;
    updates: { title?: string; position?: number; color?: string };
}

export const useColumns = (boardId: string) => {
    const queryClient = useQueryClient();
    const queryKey = ['columns', boardId];

    const createMutation = useMutation({
        mutationFn: (args: CreateColumnArgs) =>
            createColumn(boardId, args.title, args.position, args.color),
        onMutate: async (args) => {
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<Column[]>(queryKey);

            const tempId = `temp-${Date.now()}`;
            const optimistic: Column = {
                id: tempId,
                board_id: boardId,
                title: args.title,
                position: args.position,
                color: args.color ?? '#e2e8f0',
            };

            queryClient.setQueryData<Column[]>(queryKey, (old = []) => [...old, optimistic]);
            return { previous, tempId };
        },
        onSuccess: (created, _args, ctx) => {
            queryClient.setQueryData<Column[]>(queryKey, (old = []) => {
                if (old.some((c) => c.id === created.id)) {
                    return old.filter((c) => c.id !== ctx?.tempId);
                }
                return old.map((c) => (c.id === ctx?.tempId ? created : c));
            });
        },
        onError: (err, _args, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
            notifyError(err, "Couldn't create column");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ columnId, updates }: UpdateColumnArgs) =>
            updateColumn(columnId, updates),
        onMutate: async ({ columnId, updates }) => {
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<Column[]>(queryKey);

            queryClient.setQueryData<Column[]>(queryKey, (old = []) =>
                old.map((c) => (c.id === columnId ? { ...c, ...updates } : c))
            );

            return { previous };
        },
        onError: (err, _args, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
            notifyError(err, "Couldn't update column");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (columnId: string) => deleteColumn(columnId),
        onMutate: async (columnId) => {
            await queryClient.cancelQueries({ queryKey });
            const previous = queryClient.getQueryData<Column[]>(queryKey);

            queryClient.setQueryData<Column[]>(queryKey, (old = []) =>
                old.filter((c) => c.id !== columnId)
            );

            return { previous };
        },
        onError: (err, _columnId, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
            notifyError(err, "Couldn't delete column");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return {
        createColumn: createMutation.mutateAsync,
        updateColumn: updateMutation.mutateAsync,
        deleteColumn: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};