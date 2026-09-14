import { useParams } from 'react-router-dom';
import { useBoard } from '../hooks/useBoard';
import { useBoardActions } from '../hooks/useBoardActions';
import BoardHeader from '../components/board/BoardHeader';
import BoardContent from '../components/board/BoardContent';
import CreateColumnModal from '../components/board/CreateColumnModal';
import BoardMembersModal from '../components/board/members/BoardMembersModal';
import TaskFormModal from '../components/task/TaskFormModal';

export default function Board() {
    const { id } = useParams<{ id: string }>();
    const { board, columns, tasks, isLoading, error } = useBoard(id!);

    const actions = useBoardActions(id!, tasks, columns.length);

    if (isLoading) return <div className="p-4">Loading board...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;
    if (!board) return <div className="p-4">Board not found</div>;

    return (
        <div className="p-4 w-full">
            <div className="relative mb-4">
                <BoardHeader board={board} />
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={() => actions.setIsMembersModalOpen(true)}
                        className="px-3 py-1.5 text-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                        👥 Members
                    </button>
                </div>
            </div>

            <BoardContent
                columns={columns}
                tasks={tasks}
                onAddColumnClick={() => actions.setIsColumnModalOpen(true)}
                onRenameColumn={actions.handleRenameColumn}
                onDeleteColumn={actions.deleteColumn}
                onAddTask={actions.handleOpenCreateTask}
                onTaskClick={actions.setSelectedTask}
            />

            <CreateColumnModal
                isOpen={actions.isColumnModalOpen}
                onClose={() => actions.setIsColumnModalOpen(false)}
                onCreate={actions.handleAddColumn}
                isCreating={actions.isCreatingColumn}
            />

            <BoardMembersModal
                isOpen={actions.isMembersModalOpen}
                onClose={() => actions.setIsMembersModalOpen(false)}
                boardId={board.id}
            />

            <TaskFormModal
                isOpen={actions.isCreateTaskModalOpen}
                onClose={actions.handleCloseCreateTask}
                boardId={board.id}
                mode="create"
                onSubmit={actions.handleCreateTask}
                isLoading={actions.isCreatingTask}
            />

            <TaskFormModal
                isOpen={!!actions.selectedTask}
                onClose={() => actions.setSelectedTask(null)}
                boardId={board.id}
                mode="edit"
                task={actions.selectedTask}
                onSubmit={actions.handleSaveTask}
                onDelete={actions.handleDeleteTask}
                isLoading={actions.isUpdating}
            />
        </div>
    );
}