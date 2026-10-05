import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient';
import type { Task } from '../types/task';
import type { Column } from '../types/column';
import type { BoardMember } from '../types/boardMember';
import type { Board } from '../types/board';
import type { Comment, CommentWithAuthor } from '../types/comments';

export const useRealtimeBoard = (boardId?: string) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!boardId) return;

        const channel = supabase
            .channel(`board-${boardId}`)

            .on<Task>(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tasks',
                    filter: `board_id=eq.${boardId}`,
                },
                (payload) => {
                    const { eventType, new: newRow, old: oldRow } = payload;
                    queryClient.setQueryData<Task[]>(['tasks', boardId], (old = []) => {
                        if (eventType === 'INSERT') return [...old, newRow];
                        if (eventType === 'UPDATE')
                            return old.map((t) => (t.id === newRow.id ? newRow : t));
                        if (eventType === 'DELETE')
                            return old.filter((t) => t.id !== oldRow.id);
                        return old;
                    });
                }
            )

            .on<Column>(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'columns',
                    filter: `board_id=eq.${boardId}`,
                },
                (payload) => {
                    const { eventType, new: newRow, old: oldRow } = payload;
                    queryClient.setQueryData<Column[]>(['columns', boardId], (old = []) => {
                        if (eventType === 'INSERT') return [...old, newRow];
                        if (eventType === 'UPDATE')
                            return old.map((c) => (c.id === newRow.id ? newRow : c));
                        if (eventType === 'DELETE')
                            return old.filter((c) => c.id !== oldRow.id);
                        return old;
                    });
                }
            )

            .on<BoardMember>(
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

            .on<Board>(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'boards',
                    filter: `id=eq.${boardId}`,
                },
                (payload) => {
                    if (payload.eventType === 'UPDATE') {
                        queryClient.setQueryData<Board>(['board', boardId], payload.new);
                    }
                }
            )

            .on<Comment>(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'comments',
                    filter: `board_id=eq.${boardId}`,
                },
                (payload) => {
                    const { eventType, new: newRow, old: oldRow } = payload;

                    if (eventType === 'INSERT') {
                        queryClient.setQueryData<CommentWithAuthor[]>(
                            ['comments', newRow.task_id],
                            (old = []) => [...old, { ...newRow, profiles: [] }]
                        );
                    } else if (eventType === 'DELETE') {
                        queryClient.setQueryData<CommentWithAuthor[]>(
                            ['comments', oldRow.task_id],
                            (old = []) => old.filter((c) => c.id !== oldRow.id)
                        );
                    }
                }
            )

            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [boardId, queryClient]);
};