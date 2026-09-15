import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchComments, addComment, deleteComment } from '../services/commentService';
import { useUserData } from './useUserData';
import type { CommentWithAuthor } from '../types/comments';

export const useComments = (taskId: string) => {
    const { user } = useUserData();
    const queryClient = useQueryClient();

    const { data: comments, isLoading, error } = useQuery<CommentWithAuthor[]>({
        queryKey: ['comments', taskId],
        queryFn: () => fetchComments(taskId),
        enabled: !!taskId,
    });

    const addMutation = useMutation({
        mutationFn: (content: string) => {
            if (!user) throw new Error('User not authenticated');
            return addComment(taskId, user.id, content);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (commentId: string) => deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
        },
    });

    return {
        comments: comments || [],
        isLoading,
        error,
        addComment: addMutation.mutateAsync,
        deleteComment: deleteMutation.mutateAsync,
        isAdding: addMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};