import type { Board } from "../types/board";
import { supabase } from "./supabaseClient";

export const fetchBoards = async (userId: string): Promise<Board[]> => {
    try {
        const { data, error } = await supabase
            .from('boards')
            .select('*')
            .eq('owner_id', userId);

        if (error) throw new Error(error.message);
        return data || [];
    } catch (error) {
        console.error('Error fetching boards:', error);
        throw error;
    }
};

export const createBoard = async (title: string, ownerId: string, coverImage?: string): Promise<Board> => {
    try {
        const { data: board, error: boardError } = await supabase
            .from('boards')
            .insert({ title, owner_id: ownerId, cover_image: coverImage || null })
            .select()
            .single();

        if (boardError) throw new Error(boardError.message);

        const { error: memberError } = await supabase
            .from('board_members')
            .insert({ board_id: board.id, user_id: ownerId, role: 'owner' });

        if (memberError) {
            await supabase.from('boards').delete().eq('id', board.id);
            throw new Error(memberError.message);
        }

        const defaultColumns = [
            { title: 'To Do', position: 0, color: "#3b83f66e" },
            { title: 'In Progress', position: 1, color: "#f59f0b70" },
            { title: 'Done', position: 2, color: "#10b9816c" },
        ];

        const { error: columnsError } = await supabase
            .from('columns')
            .insert(defaultColumns.map(col => ({ ...col, board_id: board.id })));

        if (columnsError) {
            await supabase.from('boards').delete().eq('id', board.id);
            throw new Error(columnsError.message);
        }

        return board;
    } catch (error) {
        console.error('Error creating board:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to create board');
    }
};

export const deleteBoard = async (boardId: string): Promise<void> => {
    const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', boardId);

    if (error) {
        console.error('Error deleting board:', error);
        throw new Error(error.message);
    }
};