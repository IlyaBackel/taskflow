import type { CommentWithAuthor } from '../types/comments';
import type { Profile } from '../types/profile';
import { supabase } from './supabaseClient';

export const fetchComments = async (taskId: string): Promise<CommentWithAuthor[]> => {
    const { data: comments, error } = await supabase
        .from('comments')
        .select('id, task_id, user_id, content, created_at')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    if (!comments || comments.length === 0) return [];

    const userIds = [...new Set(comments.map((c) => c.user_id))];
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url')
        .in('id', userIds);

    if (profilesError) throw profilesError;

    const profileMap: Record<string, Profile> = {};
    profiles?.forEach((p) => { profileMap[p.id] = p; });

    return comments.map((c) => ({
        ...c,
        profiles: profileMap[c.user_id] ? [profileMap[c.user_id]] : [],
    }));
};

export const addComment = async (
    taskId: string,
    userId: string,
    content: string
): Promise<Comment> => {
    const { data, error } = await supabase
        .from('comments')
        .insert({ task_id: taskId, user_id: userId, content })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
    if (error) throw error;
};