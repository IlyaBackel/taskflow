import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { profileSchema, type ProfileFormData } from '../../schemas/profile.schema';
import { updateProfile } from '../../services/profileService';
import { supabase } from '../../services/supabaseClient';
import Modal from '../shared/Modal';
import Input from '../shared/Input';
import ProfileAvatar from '../shared/ProfileAvatar';

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
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    console.log(userId)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: currentName,
            avatar_url: currentAvatarUrl || '',
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
            alert('Please upload an image (max 5MB)');
            return;
        }

        setUploading(true);
        try {
            const filePath = `${userId}/${Date.now()}.${file.name.split('.').pop()}`;
            const { error } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true, contentType: file.type });
            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setValue('avatar_url', publicUrl);
            setPreviewUrl(publicUrl);
        } catch {
            alert('Upload failed');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
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
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal onClose={onClose}>
            <div className="p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4 text-primary-text">Edit Profile</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="Your name"
                        {...register('name')}
                        error={errors.name?.message}
                    />

                    <div>
                        <label className="block text-sm font-medium mb-1 text-primary-text">
                            Avatar
                        </label>
                        <div className="flex items-center gap-4 flex-wrap">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Avatar preview"
                                    className="w-16 h-16 rounded-full object-cover border"
                                />
                            ) :
                                <ProfileAvatar size={50} />
                            }
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={uploading}
                                className="flex-1 border rounded-2xl px-3 py-4  text-primary-text disabled:opacity-50"
                            />
                            {uploading && <span className="text-sm">Uploading...</span>}
                        </div>
                        <input
                            type="hidden"
                            {...register('avatar_url')}
                        />
                    </div>

                    {error && (
                        <div className="p-3 text-sm bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 justify-end mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg text-primary-text transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || uploading}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}