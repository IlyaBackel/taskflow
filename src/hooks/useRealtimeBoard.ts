import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient';

export const useRealtimeBoard = (boardId?: string) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!boardId) return;

        const channel = supabase
            .channel(`board-${boardId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'tasks' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'columns',
                    filter: `board_id=eq.${boardId}`,
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['columns', boardId] });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'board_members',
                    filter: `board_id=eq.${boardId}`,
                },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['boardMembers', boardId] });
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'comments' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['comments'] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [boardId, queryClient]);
};