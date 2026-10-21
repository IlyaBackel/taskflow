import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBoards, createBoard, deleteBoard } from '../services/boardService';
import { useUserData } from './useUserData';
import { notifyError } from '../utils/toast';
import type { Board } from '../types/board';

export const useBoards = () => {
    const { user, isLoading: loadingUser } = useUserData();
    const queryClient = useQueryClient();
    const queryKey = ['boards', user?.id];

    const { data: boards, isLoading, error } = useQuery<Board[]>({
        queryKey,
        queryFn: () => fetchBoards(user!.id),
        enabled: !!user && !loadingUser,
    });

    const createBoardMutation = useMutation({
        mutationFn: ({ title, coverImage }: { title: string; coverImage?: string }) => {
            if (!user) throw new Error('User not authenticated');
            return createBoard(title, user.id, coverImage);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
        onError: (err) => {
            notifyError(err, "Couldn't create board");
        },
    });

    const deleteBoardMutation = useMutation({
        mutationFn: (boardId: string) => {
            if (!user) throw new Error('User not authenticated');
            return deleteBoard(boardId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
        onError: (err) => {
            notifyError(err, "Couldn't delete board");
        },
    });

    return {
        boards,
        isLoading: isLoading || loadingUser,
        error,
        user,
        createBoard: createBoardMutation.mutateAsync,
        deleteBoard: deleteBoardMutation.mutateAsync,
        isCreating: createBoardMutation.isPending,
        isDeleting: deleteBoardMutation.isPending,
    };
};