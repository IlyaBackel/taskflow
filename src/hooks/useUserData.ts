import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../services/profileService';
import { useAuth } from '../providers/AuthProvider';

export const useUserData = () => {
    const { user, loading: authLoading, signOut } = useAuth();

    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ['profile', user?.id],
        queryFn: () => fetchProfile(user!.id),
        enabled: !!user,
        staleTime: Infinity,
        gcTime: 24 * 60 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return {
        user,
        profile,
        isLoading: authLoading || profileLoading,
        signOut,
    };
};