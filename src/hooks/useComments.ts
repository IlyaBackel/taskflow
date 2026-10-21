import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchComments, addComment, deleteComment } from '../services/commentService';
import { useUserData } from './useUserData';
import { notifyError } from '../utils/toast';
import type { CommentWithAuthor } from '../types/comments';

export const useComments = (taskId: string) => {
    const { user } = useUserData();
    const queryClient = useQueryClient();
    const queryKey = ['comments', taskId];

    const { data: comments, isLoading, error } = useQuery<CommentWithAuthor[]>({
        queryKey,
        queryFn: () => fetchComments(taskId),
        enabled: !!taskId,
    });

    const addMutation = useMutation({
        mutationFn: (content: string) => {
            if (!user) throw new Error('User not authenticated');
            return addComment(taskId, user.id, content);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
        onError: (err) => {
            notifyError(err, "Couldn't add comment");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (commentId: string) => deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
        onError: (err) => {
            notifyError(err, "Couldn't delete comment");
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