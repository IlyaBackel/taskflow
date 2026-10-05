import type { Profile } from './profile';

export interface Comment {
    id: string;
    board_id: string;
    task_id: string;
    user_id: string;
    content: string;
    created_at: string;
}

export interface CommentWithAuthor extends Comment {
    profiles: Profile[];
}