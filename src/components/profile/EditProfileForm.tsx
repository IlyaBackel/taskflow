import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormData } from '../../schemas/profile.schema';
import Input from '../shared/Input';
import AvatarUpload from './AvatarUpload';

interface EditProfileFormProps {
    userId: string;
    currentName: string;
    currentAvatarUrl?: string | null;
    onSubmit: (data: ProfileFormData) => Promise<void>;
    isLoading: boolean;
    onCancel: () => void;
}

export default function EditProfileForm({
    userId,
    currentName,
    currentAvatarUrl,
    onSubmit,
    isLoading,
    onCancel,
}: EditProfileFormProps) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: currentName,
            avatar_url: currentAvatarUrl || '',
        },
    });

    const handleAvatarUpload = (url: string) => {
        setValue('avatar_url', url);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
                label="Full Name"
                type="text"
                placeholder="Your name"
                {...register('name')}
                error={errors.name?.message}
            />

            <div>
                <label className="block text-sm font-medium mb-1 text-primary-text ">Avatar</label>
                <AvatarUpload
                    userId={userId}
                    currentAvatarUrl={currentAvatarUrl}
                    onUploadSuccess={handleAvatarUpload}
                />
                <input type="hidden" className='' {...register('avatar_url')} />
            </div>

            <div className="flex gap-3 justify-end mt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-border-primary rounded-lg hover:bg-btn-hover text-primary-text transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors"
                >
                    {isLoading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
}