interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`animate-pulse bg-[var(--color-border)] rounded ${className}`} />
    );
}

export function BoardSkeleton() {
    return (
        <div className="p-4 w-full">
            <Skeleton className="w-full h-48 sm:h-56 md:h-64 lg:h-72 rounded-xl mb-4" />
            <div className="flex gap-4 overflow-x-auto pb-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="min-w-[250px] bg-[var(--color-card-bg)] p-3 rounded shadow"
                    >
                        <Skeleton className="h-5 w-32 mb-3" />
                        <div className="space-y-2">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function BoardsSkeleton() {
    return (
        <div className="p-4">
            <Skeleton className="h-8 w-40 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-[var(--color-card-bg)] rounded-xl overflow-hidden shadow"
                    >
                        <Skeleton className="w-full h-48" />
                        <div className="p-4">
                            <Skeleton className="h-5 w-32" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CommentsSkeleton() {
    return (
        <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
        </div>
    );
}