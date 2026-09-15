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
                    className="px-4 py-2 border border-border-primary rounded-lg hover:bg-border-primary text-primary-text transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors"
                >
                    {isLoading
                        ? mode === 'create' ? 'Creating...' : 'Saving...'
                        : mode === 'create' ? 'Create Task' : 'Save'}
                </button>
            </div>
        </div>
    );
}