import { supabase } from './supabaseClient';

export const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', userId)
        .single();

    if (error) throw new Error(error.message);
    return data;
};

export const updateProfile = async (userId: string, updates: { name?: string; avatar_url?: string }) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};