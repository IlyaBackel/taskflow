import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createColumn, updateColumn, deleteColumn } from '../services/columnService';

export const useColumns = (boardId: string) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: ({ title, position, color }: { title: string; position: number; color?: string }) =>
            createColumn(boardId, title, position, color),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['columns', boardId] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ columnId, updates }: { columnId: string; updates: { title?: string; position?: number; color?: string } }) =>
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