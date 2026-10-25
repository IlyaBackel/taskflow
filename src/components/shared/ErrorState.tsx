interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({
    message = 'Something went wrong',
    onRetry,
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3">
                <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-[var(--color-text-primary)] font-medium mb-1">Error</p>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4 max-w-md">
                {message}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors text-sm"
                >
                    Try again
                </button>
            )}
        </div>
    );
}