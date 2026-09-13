import type { Profile } from "./profile";

export interface BoardMember {
    id: string;
    board_id: string;
    user_id: string;
    role: 'owner' | 'member';
}

export interface BoardMemberWithProfile extends BoardMember {
    profiles: Profile[];
}