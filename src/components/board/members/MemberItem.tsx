import type { BoardMemberWithProfile } from "../../../types/boardMember";
import ProfileAvatar from "../../shared/ProfileAvatar";

interface MemberItemProps {
    member: BoardMemberWithProfile;
    canRemove: boolean;
    isRemoving: boolean;
    onRemove: () => void;
}

export default function MemberItem({ member, canRemove, isRemoving, onRemove }: MemberItemProps) {
    const profile = member.profiles?.[0];
    if (!profile) return null;

    return (
        <li className="flex justify-between items-center p-2 border-b border-border-primary">
            <div className="flex items-center gap-2">
                <ProfileAvatar profile={profile} size={28} />
                <div>
                    <span className="font-medium text-primary-text">
                        {profile.name || profile.email}
                    </span>
                    <span className="text-xs text-secondary-text ml-2">
                        {member.role}
                    </span>
                </div>
            </div>
            {canRemove && (
                <button
                    onClick={onRemove}
                    disabled={isRemoving}
                    className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                    Remove
                </button>
            )}
        </li>
    );
}