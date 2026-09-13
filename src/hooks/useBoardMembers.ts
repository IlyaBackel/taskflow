import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBoardMembers, addBoardMember, removeBoardMember, searchUsersByEmail } from '../services/memberService';

export const useBoardMembers = (boardId: string) => {
    const queryClient = useQueryClient();

    const { data: members, isLoading, error } = useQuery({
        queryKey: ['boardMembers', boardId],
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
            queryClient.invalidateQueries({ queryKey: ['boardMembers', boardId] });
        },
    });

    const removeMemberMutation = useMutation({
        mutationFn: (memberId: string) => removeBoardMember(memberId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boardMembers', boardId] });
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