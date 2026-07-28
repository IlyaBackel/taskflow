import type { Board } from "../../types/board";

interface BoardItemProps {
    board: Board;
    onNavigate: (id: string) => void;
    onDelete?: () => void;
}

export default function BoardItem({ board, onNavigate, onDelete }: BoardItemProps) {
    return (
        <div
            className="group h-fit relative rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-white"
            onClick={() => onNavigate(board.id)}
        >
            <div className="w-full">
                {board.cover_image ? (
                    <img
                        src={board.cover_image}
                        alt={board.title}
                        className="lg:w-200 lg:h-90 h-auto object-cover rounded-t-xl"
                    />
                ) : (
                    <img
                        src="/not-found-image.svg"
                        alt="not found"
                        className="lg:w-200 lg:h-90 h-auto object-cover"
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

            <div className="p-3">
                <h3 className="font-medium text-gray-800 truncate">{board.title}</h3>
            </div>
        </div>
    );
}