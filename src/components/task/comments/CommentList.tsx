import type { CommentWithAuthor } from '../../../types/comments';
import CommentItem from './CommentItem';

interface CommentListProps {
    comments: CommentWithAuthor[];
    currentUserId?: string;
    isDeleting: boolean;
    onDelete: (commentId: string) => void;
}

export default function CommentList({
    comments,
    currentUserId,
    isDeleting,
    onDelete,
}: CommentListProps) {
    if (comments.length === 0) {
        return (
            <p className="text-sm text-secondary-text py-2">
                No comments yet.
            </p>
        );
    }

    return (
        <ul className="space-y-1">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUserId={currentUserId}
                    isDeleting={isDeleting}
                    onDelete={() => onDelete(comment.id)}
                />
            ))}
        </ul>
    );
}