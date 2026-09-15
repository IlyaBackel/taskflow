import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createBoard } from '../../services/boardService';
import { useUserData } from '../../hooks/useUserData';
import Modal from '../shared/Modal';
import CreateBoardForm from './CreateBoardForm';

interface CreateBoardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateBoardModal({ isOpen, onClose }: CreateBoardModalProps) {
    const { user } = useUserData();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const handleSubmit = async (data: { title: string; cover_image?: string }) => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            await createBoard(data.title, user.id, data.cover_image);
            queryClient.invalidateQueries({ queryKey: ['boards', user.id] });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create board');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal onClose={onClose}>
            <div className="bg-card-bg p-6 border-border-primary max-w-md w-full rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-primary-text">Create Board</h2>
                {error && (
                    <div className="p-3 text-sm bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md mb-4">
                        {error}
                    </div>
                )}
                <CreateBoardForm
                    userId={user?.id || ''}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    onCancel={onClose}
                />
            </div>
        </Modal>
    );
}