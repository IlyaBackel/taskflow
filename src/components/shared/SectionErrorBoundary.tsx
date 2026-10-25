import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import type { ReactNode } from 'react';

interface SectionErrorBoundaryProps {
    children: ReactNode;
    fallbackTitle?: string;
    resetKeys?: unknown[];
}

interface SectionFallbackProps extends FallbackProps {
    title: string;
}

function SectionFallback({ error, resetErrorBoundary, title }: SectionFallbackProps) {
    const message = error instanceof Error ? error.message : String(error);

    return (
        <div className="flex flex-col items-center justify-center p-6 text-center bg-[var(--color-card-bg)] border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-[var(--color-text-primary)] font-medium mb-1">
                {title}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 max-w-sm">
                {message || 'An unexpected error occurred'}
            </p>
            <button
                onClick={resetErrorBoundary}
                className="px-3 py-1.5 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
            >
                Try again
            </button>
        </div>
    );
}

export default function SectionErrorBoundary({
    children,
    fallbackTitle = 'Something went wrong',
    resetKeys,
}: SectionErrorBoundaryProps) {
    return (
        <ErrorBoundary
            FallbackComponent={(props: FallbackProps) => (
                <SectionFallback {...props} title={fallbackTitle} />
            )}
            onError={(error, info) => {
                console.error(`[${fallbackTitle}]`, error, info);
            }}
            resetKeys={resetKeys}
        >
            {children}
        </ErrorBoundary>
    );
}