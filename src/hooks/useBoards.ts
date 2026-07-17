import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBoards, createBoard } from '../services/boardService';
import { supabase } from '../services/supabaseClient';
import { useEffect, useState } from 'react';
import type { Board } from '../types/board';

export const useBoards = () => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoadingUser(false);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );
        return () => subscription.unsubscribe();
    }, []);

    const { data: boards, isLoading, error } = useQuery<Board[]>({
        queryKey: ['boards', user?.id],
        queryFn: () => fetchBoards(user!.id),
        enabled: !!user && !loadingUser,
    });

    const createBoardMutation = useMutation({
        mutationFn: (title: string) => {
            if (!user) throw new Error('You must be logged in to create a board');
            return createBoard(title, user.id);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['boards', user?.id] })

    });

    return {
        boards,
        isLoading: isLoading || loadingUser,
        error,
        createBoard: createBoardMutation.mutateAsync,
        isCreating: createBoardMutation.isPending,
    };
};