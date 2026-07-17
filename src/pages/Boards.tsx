import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoards } from '../hooks/useBoards';
import ThemeToggle from '../components/shared/ThemeToggle';

export default function Boards() {
    const [title, setTitle] = useState('');
    const navigate = useNavigate();

    const {
        boards,
        isLoading,
        error,
        createBoard,
        isCreating,
    } = useBoards();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        await createBoard(title);
        setTitle('');
    };

    if (isLoading) return <div>Loading boards...</div>;
    if (error) return <div>Error: {error.message}</div>;


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Boards</h1>

            <form onSubmit={handleCreate} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Board title..."
                    className="flex-1 px-3 py-2 border rounded"
                />
                <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    {isCreating ? 'Creating...' : 'Create Board'}
                </button>
            </form>

            {boards?.length === 0 && <p>No boards yet. Create one!</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {boards?.map((board) => (
                    <div
                        key={board.id}
                        className="p-4 border rounded shadow hover:shadow-md transition"
                    >
                        <h3 className="text-lg font-semibold">{board.title}</h3>
                        <p className="text-sm text-gray-500">
                            Created: {new Date(board.created_at).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => navigate(`/boards/${board.id}`)}
                                className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                            >
                                Open
                            </button>
                            <button
                                className="px-3 py-1 bg-red-500 text-white rounded text-sm disabled:opacity-50"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}