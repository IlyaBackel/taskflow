import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../shared/Input';
import BoardCoverUpload from './BoardCoverUpload';

const boardSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    cover_image: z.string().optional(),
});

type BoardFormData = z.infer<typeof boardSchema>;

interface CreateBoardFormProps {
    userId: string;
    onSubmit: (data: BoardFormData) => Promise<void>;
    isLoading: boolean;
    onCancel: () => void;
}

export default function CreateBoardForm({
    userId,
    onSubmit,
    isLoading,
    onCancel,
}: CreateBoardFormProps) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<BoardFormData>({
        resolver: zodResolver(boardSchema),
        defaultValues: { title: '', cover_image: '' },
    });

    const handleCoverUpload = (url: string) => {
        setValue('cover_image', url);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
                label="Board Title"
                type="text"
                placeholder="My awesome board"
                {...register('title')}
                error={errors.title?.message}
            />

            <div>
                <label className="block text-sm font-medium mb-1 text-primary-text">
                    Cover Image (optional)
                </label>
                <BoardCoverUpload userId={userId} onUploadSuccess={handleCoverUpload} />
                <input type="hidden" {...register('cover_image')} />
            </div>

            <div className="flex gap-3 justify-end mt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-border-primary rounded-lg text-primary-text transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors"
                >
                    {isLoading ? 'Creating...' : 'Create Board'}
                </button>
            </div>
        </form>
    );
}