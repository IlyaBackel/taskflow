import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoards } from '../hooks/useBoards';
import CreateBoardModal from '../components/board/CreateBoardModal';
import BoardItem from '../components/board/BoardItem';

export default function Boards() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const {
        boards,
        isLoading,
        error,
        deleteBoard,
    } = useBoards();

    const handleDeleteBoard = async (boardId: string) => {
        try {
            await deleteBoard(boardId);
        } catch (err) {
            console.error('Failed to delete board:', err);
            alert('Failed to delete board');
        }
    };

    if (isLoading) return <div>Loading boards...</div>;
    if (error) return <div>Error: {error.message}</div>;


    return (
        <div className="sm:p-4">
            <h1 className="text-2xl font-bold mb-4">My Boards</h1>

            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg"
            >
                + New Board
            </button>

            <CreateBoardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {boards?.length === 0 && <p>No boards yet. Create one!</p>}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {boards?.map((board) => (
                    <BoardItem
                        key={board.id}
                        board={board}
                        onNavigate={(id) => navigate(`/board/${id}`)}
                        onDelete={() => handleDeleteBoard(board.id)}
                    />
                ))}
            </div>
        </div>
    );
}