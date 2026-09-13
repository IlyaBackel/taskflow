export type Priority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    column_id: string;
    title: string;
    description: string | null;
    priority: Priority;
    due_date: string | null;
    assignee_id: string | null;
    position: number;
    created_by: string;
    created_at: string;
}

export interface TaskFormData {
    title: string;
    description: string;
    priority: Priority;
    due_date: string;
    assignee_id: string;
}