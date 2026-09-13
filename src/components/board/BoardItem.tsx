import type { Board } from '../../types/board';

interface BoardItemProps {
    board: Board;
    onNavigate: (id: string) => void;
    onDelete?: () => void;
    isOwner: boolean;
    isDeleting?: boolean;
}

export default function BoardItem({ board, onNavigate, onDelete, isOwner, isDeleting }: BoardItemProps) {
    return (
        <div
            className="group relative flex flex-col overflow-hidden rounded-xl bg-[var(--color-card-bg)] shadow hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNavigate(board.id)}
        >
            <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
                {board.cover_image ? (
                    <img
                        src={board.cover_image}
                        alt={board.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/not-found-image.svg';
                        }}
                    />
                ) : (
                    <img
                        src="/not-found-image.svg"
                        alt="No cover"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {isOwner && onDelete && (
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        disabled={isDeleting}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 disabled:opacity-50 shadow-md"
                    >
                        {isDeleting ? '...' : 'Delete'}
                    </button>
                </div>
            )}

            <div className="p-4">
                <h3 className="font-medium text-xl text-[var(--color-text-primary)] truncate">
                    {board.title}
                </h3>
            </div>
        </div>
    );
}