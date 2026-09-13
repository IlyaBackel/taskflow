import type { BoardMemberWithProfile } from '../types/boardMember';
import type { Profile } from '../types/profile';
import { supabase } from './supabaseClient';

export const searchUsersByEmail = async (query: string): Promise<Profile[]> => {
    if (!query.trim()) return [];
    const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url')
        .or(`name.ilike.%${query}%, email.ilike.%${query}%`)
        .limit(10);
    if (error) throw error;
    return data || [];
};

export const fetchBoardMembers = async (boardId: string): Promise<BoardMemberWithProfile[]> => {
    const { data: members, error: membersError } = await supabase
        .from('board_members')
        .select('id, board_id, user_id, role')
        .eq('board_id', boardId);

    if (membersError) throw membersError;
    if (!members || members.length === 0) return [];

    const userIds = members.map(m => m.user_id);
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url')
        .in('id', userIds);

    if (profilesError) throw profilesError;

    const profileMap: Record<string, Profile> = {};
    profiles?.forEach(p => { profileMap[p.id] = p; });

    return members.map(member => ({
        ...member,
        profiles: profileMap[member.user_id] ? [profileMap[member.user_id]] : [],
    }));
};

export const addBoardMember = async (boardId: string, userId: string, role: 'member' | 'owner' = 'member') => {
    const { data, error } = await supabase
        .from('board_members')
        .insert({ board_id: boardId, user_id: userId, role })
        .select()
        .single();

    if (error) {
        if (error.code === '23505') throw new Error('User is already a member');
        throw error;
    }
    return data;
};

export const removeBoardMember = async (memberId: string) => {
    const { error } = await supabase
        .from('board_members')
        .delete()
        .eq('id', memberId);
    if (error) throw error;
};