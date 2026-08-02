import type { Column } from '../types/column';
import { supabase } from './supabaseClient';

export const createColumn = async (boardId: string, title: string, position: number, color?: string): Promise<Column> => {
    const { data, error } = await supabase
        .from('columns')
        .insert({
            board_id: boardId,
            title,
            position,
            color: color,
        })
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const updateColumn = async (columnId: string, updates: { title?: string; position?: number; color?: string }): Promise<Column> => {
    const { data, error } = await supabase
        .from('columns')
        .update(updates)
        .eq('id', columnId)
        .select()
        .single();
    if (error) throw error;
    return data;
};
export const deleteColumn = async (columnId: string) => {
    const { error } = await supabase
        .from('columns')
        .delete()
        .eq('id', columnId);
    if (error) throw error;
};