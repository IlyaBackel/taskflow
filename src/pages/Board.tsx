import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBoard } from '../hooks/useBoard';
import { useColumns } from '../hooks/useColumns';
import Input from '../components/shared/Input';
import Column from '../components/board/Column';

export default function Board() {
    const { id } = useParams<{ id: string }>();
    const { board, columns, tasks, isLoading, error } = useBoard(id!);
    const { createColumn, updateColumn, deleteColumn, isCreating } = useColumns(id!);
    const [newColumnTitle, setNewColumnTitle] = useState('');

    if (isLoading) return <div>Loading board...</div>;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;
    if (!board) return <div>Board not found</div>;

    const handleAddColumn = async () => {
        if (!newColumnTitle.trim()) return;
        await createColumn({ title: newColumnTitle.trim(), position: columns.length });
        setNewColumnTitle('');
    };

    const handleAddTask = async () => {
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{board.title}</h1>
            {board.cover_image && (
                <img src={board.cover_image} alt={board.title} className="w-full h-48 object-cover rounded-lg mb-4" />
            )}

            <div className="flex gap-4 overflow-x-auto pb-4">
                {columns.map((column) => (
                    <Column
                        key={column.id}
                        column={column}
                        tasks={tasks.filter((task) => task.column_id === column.id)}
                        onRename={(id, title) => updateColumn({ columnId: id, updates: { title } })}
                        onDelete={deleteColumn}
                        onAddTask={handleAddTask}
                    />
                ))}

                <div className="min-w-62.5 p-3 bg-card-bg rounded shadow border border-dashed border-border-primary">
                    <form onSubmit={(e) => { e.preventDefault(); handleAddColumn(); }} className="flex flex-col gap-2">
                        <Input
                            value={newColumnTitle}
                            onChange={(e) => setNewColumnTitle(e.target.value)}
                            placeholder="New column..."
                            disabled={isCreating}
                            className="text-sm"
                        />
                        <button
                            type="submit"
                            disabled={isCreating || !newColumnTitle.trim()}
                            className="text-sm bg-primary text-white py-1 px-2 rounded hover:bg-primary-hover disabled:opacity-50"
                        >
                            Add Column
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}