import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchBoardMembers,
    addBoardMember,
    removeBoardMember,
    searchUsersByEmail,
} from '../services/memberService';
import { notifyError } from '../utils/toast';

export const useBoardMembers = (boardId: string) => {
    const queryClient = useQueryClient();
    const queryKey = ['boardMembers', boardId];

    const { data: members, isLoading, error } = useQuery({
        queryKey,
        queryFn: () => fetchBoardMembers(boardId),
        enabled: !!boardId,
    });

    const searchUsers = async (query: string) => {
        if (!query.trim()) return [];
        return searchUsersByEmail(query);
    };

    const addMemberMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: string; role?: 'member' | 'owner' }) =>
            addBoardMember(boardId, userId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
        onError: (err) => {
            notifyError(err, "Couldn't add member");
        },
    });

    const removeMemberMutation = useMutation({
        mutationFn: (memberId: string) => removeBoardMember(memberId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
        onError: (err) => {
            notifyError(err, "Couldn't remove member");
        },
    });

    return {
        members,
        isLoading,
        error,
        searchUsers,
        addMember: addMemberMutation.mutateAsync,
        removeMember: removeMemberMutation.mutateAsync,
        isAdding: addMemberMutation.isPending,
        isRemoving: removeMemberMutation.isPending,
    };
};