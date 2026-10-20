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

            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'tasks', filter: `board_id=eq.${boardId}` },
                (payload) => {
                    const { eventType, new: newRow, old: oldRow } = payload;

                    queryClient.setQueryData<Task[]>(['tasks', boardId], (old = []) => {
                        if (eventType === 'INSERT') {
                            if (old.some((t) => t.id === (newRow as Task).id)) return old;
                            return [...old, newRow as Task];
                        }
                        if (eventType === 'UPDATE') {
                            return old.map((t) => (t.id === (newRow as Task).id ? (newRow as Task) : t));
                        }
                        if (eventType === 'DELETE') {
                            return old.filter((t) => t.id !== (oldRow as Task).id);
                        }
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
                    const inserted = newRow as Column;
                    const deleted = oldRow as Column;

                    queryClient.setQueryData<Column[]>(['columns', boardId], (old = []) => {
                        if (eventType === 'INSERT') {
                            if (old.some((c) => c.id === inserted.id)) return old;
                            return [...old, inserted];
                        }
                        if (eventType === 'UPDATE') {
                            return old.map((c) => (c.id === inserted.id ? inserted : c));
                        }
                        if (eventType === 'DELETE') {
                            return old.filter((c) => c.id !== deleted.id);
                        }
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