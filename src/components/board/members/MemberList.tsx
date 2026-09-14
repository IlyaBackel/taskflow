import type { BoardMemberWithProfile } from '../../../types/boardMember';
import MemberItem from './MemberItem';

interface MemberListProps {
    members: BoardMemberWithProfile[];
    currentUserId?: string;
    isCurrentUserOwner: boolean;
    isRemoving: boolean;
    onRemove: (memberId: string, memberUserId: string, memberRole: string) => void;
}

export default function MemberList({
    members,
    currentUserId,
    isCurrentUserOwner,
    isRemoving,
    onRemove,
}: MemberListProps) {
    return (
        <div>
            <h3 className="font-medium mb-2 text-[var(--color-text-primary)]">
                Current Members
            </h3>
            {members.length === 0 && (
                <p className="text-sm text-[var(--color-text-secondary)]">No members yet.</p>
            )}
            <ul className="space-y-1">
                {members.map((member) => {
                    const profile = member.profiles?.[0];
                    if (!profile) return null;

                    const canRemove =
                        isCurrentUserOwner &&
                        member.role !== 'owner' &&
                        profile.id !== currentUserId;

                    return (
                        <MemberItem
                            key={member.id}
                            member={member}
                            canRemove={canRemove}
                            isRemoving={isRemoving}
                            onRemove={() => onRemove(member.id, profile.id, member.role)}
                        />
                    );
                })}
            </ul>
        </div>
    );
}