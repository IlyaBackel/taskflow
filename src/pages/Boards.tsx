import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoards } from '../hooks/useBoards';
import CreateBoardModal from '../components/boards/CreateBoardModal';
import BoardItem from '../components/boards/BoardItem';

export default function Boards() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const navigate = useNavigate();

    const {
        boards,
        isLoading,
        error,
        deleteBoard,
        user,
    } = useBoards();

    const myBoards = boards?.filter((b) => b.owner_id === user?.id) || [];
    const sharedBoards = boards?.filter((b) => b.owner_id !== user?.id) || [];

    const handleDeleteBoard = async (boardId: string) => {
        if (!window.confirm('Delete this board? All columns and tasks will be lost.')) return;
        setDeletingId(boardId);
        try {
            await deleteBoard(boardId);
        } catch (err) {
            console.error('Failed to delete board:', err);
            alert('Failed to delete board');
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading) return <div className="p-4">Loading boards...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

    return (
        <div className="sm:p-4 w-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary-text">Your Boards</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
                >
                    + New Board
                </button>
            </div>

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-3 text-primary-text">Created by me</h2>
                {myBoards.length === 0 ? (
                    <p className="text-secondary-text">You don't have any boards yet. Create one!</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {myBoards.map((board) => (
                            <BoardItem
                                key={board.id}
                                board={board}
                                isOwner={true}
                                isDeleting={deletingId === board.id}
                                onNavigate={(id) => navigate(`/board/${id}`)}
                                onDelete={() => handleDeleteBoard(board.id)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {sharedBoards.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-primary-text">Shared with me</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sharedBoards.map((board) => (
                            <BoardItem
                                key={board.id}
                                board={board}
                                isOwner={false}
                                onNavigate={(id) => navigate(`/board/${id}`)}
                            />
                        ))}
                    </div>
                </section>
            )}

            <CreateBoardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}