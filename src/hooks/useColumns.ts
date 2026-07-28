import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createColumn, updateColumn, deleteColumn } from '../services/columnService';

export const useColumns = (boardId: string) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: ({ title, position }: { title: string; position: number }) =>
            createColumn(boardId, title, position),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['columns', boardId] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ columnId, updates }: { columnId: string; updates: { title?: string; position?: number } }) =>
            updateColumn(columnId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['columns', boardId] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (columnId: string) => deleteColumn(columnId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['columns', boardId] });
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