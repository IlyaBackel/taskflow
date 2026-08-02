import type { Board } from "../../types/board";

interface BoardItemProps {
    board: Board;
    onNavigate: (id: string) => void;
    onDelete?: () => void;
}

export default function BoardItem({ board, onNavigate, onDelete }: BoardItemProps) {
    return (
        <div
            className="group h-fit relative rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-card-bg hover:bg-card-hover-bg"
            onClick={() => onNavigate(board.id)}
        >
            <div className="relative h-48 sm:h-56 md:h-70 lg:h-70 bg-gray-200 dark:bg-gray-700">
                {board.cover_image ? (
                    <img
                        src={board.cover_image}
                        alt={board.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src="/not-found-image.svg"
                        alt="not found"
                        className="w-full h-full object-center"
                    />
                )}
            </div>

            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                    className="px-3 py-1.5 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 disabled:opacity-50 shadow-md cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete()
                    }}
                >
                    Delete
                </button>
            </div>

            <div className="p-4 pl-7">
                <h3 className="font-medium text-xl text-primary-text truncate">{board.title}</h3>
            </div>
        </div>
    );
}