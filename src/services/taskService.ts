import type { Priority, Task } from '../types/task';
import { supabase } from './supabaseClient';

interface CreateTaskParams {
    columnId: string;
    title: string;
    position: number;
    userId: string;
    description?: string;
    priority?: Priority;
    due_date?: string;
    assignee_id?: string;
}

export const createTask = async ({
    columnId,
    title,
    position,
    userId,
    description,
    priority,
    due_date,
    assignee_id,
}: CreateTaskParams): Promise<Task> => {
    const { data, error } = await supabase
        .from('tasks')
        .insert({
            column_id: columnId,
            title,
            position,
            created_by: userId,
            description: description || null,
            priority: priority || 'medium',
            due_date: due_date || null,
            assignee_id: assignee_id || null,
        })
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
    if (error) throw error;
};