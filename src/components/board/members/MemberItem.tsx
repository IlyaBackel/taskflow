import type { BoardMemberWithProfile } from "../../../types/boardMember";

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
        <li className="flex justify-between items-center p-2 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2">
                {profile.avatar_url ? (
                    <img
                        src={profile.avatar_url}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">
                        {(profile.name || profile.email).charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <span className="font-medium text-[var(--color-text-primary)]">
                        {profile.name || profile.email}
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)] ml-2">
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