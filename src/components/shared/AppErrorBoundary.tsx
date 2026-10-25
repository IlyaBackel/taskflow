import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import type { ReactNode } from 'react';

interface AppErrorBoundaryProps {
    children: ReactNode;
}

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
    const message = error instanceof Error ? error.message : String(error);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--color-primary-bg)] text-[var(--color-text-primary)]">
            <div className="max-w-md w-full text-center">
                <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
                <p className="text-[var(--color-text-secondary)] mb-6">
                    An unexpected error occurred. We've logged it and will look into it.
                </p>

                <details className="mb-6 text-left text-sm bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-lg p-3">
                    <summary className="cursor-pointer font-medium">
                        Error details
                    </summary>
                    <pre className="mt-2 overflow-auto text-xs text-[var(--color-text-secondary)]">
                        {message}
                    </pre>
                </details>

                <button
                    onClick={resetErrorBoundary}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}

export default function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
    return (
        <ErrorBoundary
            FallbackComponent={Fallback}
            onError={(error, info) => {
                console.error('Uncaught error:', error, info);
            }}
            onReset={() => {
                window.location.href = '/';
            }}
        >
            {children}
        </ErrorBoundary>
    );
}