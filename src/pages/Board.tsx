import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBoard } from '../hooks/useBoard';
import { useColumns } from '../hooks/useColumns';
import Column from '../components/board/Column';
import BoardHeader from '../components/board/BoardHeader';
import CreateColumnModal from '../components/board/CreateColumnModal';

export default function Board() {
    const { id } = useParams<{ id: string }>();
    const { board, columns, tasks, isLoading, error } = useBoard(id!);
    const { createColumn, updateColumn, deleteColumn, isCreating } = useColumns(id!);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) return <div>Loading board...</div>;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;
    if (!board) return <div>Board not found</div>;

    const handleAddColumn = async (title: string, color: string) => {
        await createColumn({
            title,
            position: columns.length,
            color,
        });
    };

    const handleAddTask = async (columnId: string, title: string) => {
        console.log('Add task:', columnId, title);
    };

    return (
        <div className="p-4 w-full">
            <BoardHeader board={board} />

            <button
                onClick={() => setIsModalOpen(true)}
                className="my-5 lg:w-20 lg:h-20 w-10 h-10 sm:w-13 sm:h-13 md:w-16 md:h-16 flex items-center cursor-pointer p-5 justify-center sm:text-xl md:text-2xl lg:text-4xl text-secondary-text bg-card-bg rounded-full shadow border border-border-primary transition-colors"
            >
                +
            </button>

            <div className="flex gap-4 overflow-x-auto pb-4">
                {columns.map((column) => (
                    <Column
                        key={column.id}
                        column={column}
                        tasks={tasks.filter((task) => task.column_id === column.id)}
                        onRename={(id, title) =>
                            updateColumn({ columnId: id, updates: { title } })
                        }
                        onDelete={deleteColumn}
                        onAddTask={handleAddTask}
                    />
                ))}
            </div>

            <CreateColumnModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleAddColumn}
                isCreating={isCreating}
            />
        </div>
    );
}