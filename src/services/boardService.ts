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

export const createBoard = async (title: string, ownerId: string): Promise<Board> => {
    try {
        const { data: board, error: boardError } = await supabase
            .from('boards')
            .insert({ title, owner_id: ownerId })
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

        return board;
    } catch (error) {
        console.error('Error creating board:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to create board');
    }
};