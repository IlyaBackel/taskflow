import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient';
import { useMemo } from 'react';

export const fetchBoard = async (boardId: string) => {
    const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .single();
    if (error) throw error;
    return data;
};

export const fetchColumns = async (boardId: string) => {
    const { data, error } = await supabase
        .from('columns')
        .select('*')
        .eq('board_id', boardId)
        .order('position', { ascending: true });
    if (error) throw error;
    return data || [];
};

export const fetchTasks = async (columnIds: string[]) => {
    if (!columnIds.length) return [];
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .in('column_id', columnIds)
        .order('position', { ascending: true });
    if (error) throw error;
    return data || [];
};

export const useBoard = (boardId: string) => {
    const boardQuery = useQuery({
        queryKey: ['board', boardId],
        queryFn: () => fetchBoard(boardId),
        enabled: !!boardId,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const columnsQuery = useQuery({
        queryKey: ['columns', boardId],
        queryFn: () => fetchColumns(boardId),
        enabled: !!boardId,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const columnIds = useMemo(
        () => columnsQuery.data?.map((c) => c.id) ?? [],
        [columnsQuery.data]
    );
    const tasksQuery = useQuery({
        queryKey: ['tasks', boardId],
        queryFn: () => fetchTasks(columnIds),
        enabled: !!boardId && columnIds.length > 0,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return {
        board: boardQuery.data,
        columns: columnsQuery.data || [],
        tasks: tasksQuery.data || [],
        isLoading: boardQuery.isLoading || columnsQuery.isLoading || tasksQuery.isLoading,
        error: boardQuery.error || columnsQuery.error || tasksQuery.error,
    };
};