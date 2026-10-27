import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '../shared/Modal';
import EditProfileForm from './EditProfileForm';
import { updateProfile } from '../../services/profileService';
import { notifyError } from '../../utils/toast';
import type { ProfileFormData } from '../../schemas/profile.schema';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    currentName: string;
    currentAvatarUrl?: string | null;
}

export default function EditModal({
    isOpen,
    onClose,
    userId,
    currentName,
    currentAvatarUrl,
}: EditModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const handleSubmit = async (data: ProfileFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            await updateProfile(userId, {
                name: data.name,
                avatar_url: data.avatar_url || undefined,
            });
            queryClient.invalidateQueries({ queryKey: ['profile', userId] });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
            notifyError(err, "Couldn't update profile");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal onClose={onClose} labelledBy="edit-profile-title">
            <div className="bg-card-bg p-6 max-w-md w-full rounded-lg shadow-xl">
                <h2
                    id="edit-profile-title"
                    className="text-2xl font-bold mb-4 text-primary-text"
                >
                    Edit Profile
                </h2>
                {error && (
                    <div className="p-3 text-sm bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md mb-4">
                        {error}
                    </div>
                )}
                <EditProfileForm
                    userId={userId}
                    currentName={currentName}
                    currentAvatarUrl={currentAvatarUrl}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    onCancel={onClose}
                />
            </div>
        </Modal>
    );
}