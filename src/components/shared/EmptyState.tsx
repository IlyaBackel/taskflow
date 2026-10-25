import type { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
}

export default function EmptyState({
    icon = '📋',
    title,
    description,
    action,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="text-4xl mb-3">{icon}</div>
            <p className="text-[var(--color-text-primary)] font-medium mb-1">{title}</p>
            {description && (
                <p className="text-sm text-[var(--color-text-secondary)] mb-4 max-w-md">
                    {description}
                </p>
            )}
            {action}
        </div>
    );
}