import { useComments } from '../../../hooks/useComments';
import { useUserData } from '../../../hooks/useUserData';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface CommentsSectionProps {
    taskId: string;
}

export default function CommentsSection({ taskId }: CommentsSectionProps) {
    const { user } = useUserData();
    const { comments, isLoading, addComment, deleteComment, isAdding, isDeleting } =
        useComments(taskId);

    const handleDelete = async (commentId: string) => {
        if (window.confirm('Delete this comment?')) {
            await deleteComment(commentId);
        }
    };

    return (
        <div className="mt-4 border-t border-border-primary pt-4">
            <h3 className="font-medium text-primary-text mb-2">
                Comments
            </h3>

            {isLoading ? (
                <p className="text-sm text-secondary-text">Loading...</p>
            ) : (
                <CommentList
                    comments={comments}
                    currentUserId={user?.id}
                    isDeleting={isDeleting}
                    onDelete={handleDelete}
                />
            )}

            <CommentForm onSubmit={addComment} isLoading={isAdding} />
        </div>
    );
}