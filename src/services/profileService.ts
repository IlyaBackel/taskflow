import { supabase } from './supabaseClient';

export const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, email')
        .eq('id', userId)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
};

export const updateProfile = async (userId: string, updates: { name?: string; avatar_url?: string }) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
};