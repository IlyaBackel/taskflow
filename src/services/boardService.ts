import type { Board } from "../types/board";
import { supabase } from "./supabaseClient";

export const fetchBoards = async (userId: string): Promise<Board[]> => {
    const { data: memberships, error: membershipsError } = await supabase
        .from('board_members')
        .select('board_id')
        .eq('user_id', userId);

    if (membershipsError) throw membershipsError;
    if (!memberships || memberships.length === 0) return [];

    const boardIds = memberships.map(m => m.board_id);

    const { data: boards, error: boardsError } = await supabase
        .from('boards')
        .select('*')
        .in('id', boardIds)
        .order('created_at', { ascending: false });

    if (boardsError) throw boardsError;
    return boards || [];
};

export const createBoard = async (
    title: string,
    ownerId: string,
    coverImage?: string
): Promise<Board> => {
    const { data, error } = await supabase.rpc('create_board_with_defaults', {
        p_title: title,
        p_owner_id: ownerId,
        p_cover_image: coverImage ?? null,
    });

    if (error) {
        console.error('Error creating board:', error);
        throw new Error(error.message);
    }

    return data;
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