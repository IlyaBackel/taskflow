import { useState } from 'react';

interface CommentFormProps {
    onSubmit: (content: string) => Promise<unknown>;
    isLoading: boolean;
}

export default function CommentForm({ onSubmit, isLoading }: CommentFormProps) {
    const [content, setContent] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        await onSubmit(content.trim());
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="flex-1 px-3 py-2 rounded-lg border border-border-primary bg-card-bg text-primary-text placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <button
                type="submit"
                disabled={isLoading || !content.trim()}
                className="self-end px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors"
            >
                {isLoading ? '...' : 'Send'}
            </button>
        </form>
    );
}