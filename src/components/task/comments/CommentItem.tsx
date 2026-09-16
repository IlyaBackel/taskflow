import type { CommentWithAuthor } from "../../../types/comments";
import ProfileAvatar from "../../shared/ProfileAvatar";

interface CommentItemProps {
    comment: CommentWithAuthor;
    currentUserId?: string;
    isDeleting: boolean;
    onDelete: () => void;
}

export default function CommentItem({
    comment,
    currentUserId,
    isDeleting,
    onDelete,
}: CommentItemProps) {
    const profile = comment.profiles?.[0];
    if (!profile) return null;

    const isOwn = profile.id === currentUserId;

    return (
        <li className="flex gap-2 p-2 border-b border-border-primary">
            <ProfileAvatar profile={profile} size={32} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-2 min-w-0">
                        <span className="font-medium text-sm text-primary-text truncate">
                            {profile.name || profile.email}
                        </span>
                        <span className="text-xs text-secondary-text whitespace-nowrap">
                            {new Date(comment.created_at).toLocaleString()}
                        </span>
                    </div>
                    {isOwn && (
                        <button
                            onClick={onDelete}
                            disabled={isDeleting}
                            className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                            Delete
                        </button>
                    )}
                </div>
                <p className="text-sm text-primary-text mt-1 whitespace-pre-wrap wrap-break-words">
                    {comment.content}
                </p>
            </div>
        </li>
    );
}