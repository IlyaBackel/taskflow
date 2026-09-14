interface TaskFormButtonsProps {
    mode: 'create' | 'edit';
    isLoading?: boolean;
    onCancel: () => void;
    onDelete?: () => void;
}

export default function TaskFormButtons({
    mode,
    isLoading,
    onCancel,
    onDelete,
}: TaskFormButtonsProps) {
    return (
        <div className="flex justify-between mt-2">
            <div>
                {mode === 'edit' && onDelete && (
                    <button
                        type="button"
                        onClick={() => {
                            if (window.confirm('Delete this task?')) {
                                onDelete();
                            }
                        }}
                        className="px-4 py-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                        Delete
                    </button>
                )}
            </div>
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)] text-[var(--color-text-primary)] transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-colors"
                >
                    {isLoading
                        ? mode === 'create' ? 'Creating...' : 'Saving...'
                        : mode === 'create' ? 'Create Task' : 'Save'}
                </button>
            </div>
        </div>
    );
}