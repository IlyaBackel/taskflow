import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, updateProfile } from '../services/profileService';

export const useProfileQuery = (userId?: string) => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['profile', userId],
        queryFn: () => fetchProfile(userId!),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    const updateMutation = useMutation({
        mutationFn: (updates: { name?: string; avatar_url?: string }) =>
            updateProfile(userId!, updates),
        onSuccess: (updatedData) => {
            queryClient.setQueryData(['profile', userId], updatedData);
        },
    });

    return {
        profile: data,
        isLoading,
        error,
        updateProfile: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
    };
};