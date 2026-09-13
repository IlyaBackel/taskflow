import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormData } from '../../schemas/task.schema';
import Modal from '../shared/Modal';
import Input from '../shared/Input';
import AssigneeSelect from './AssigneeSelect';
import { useBoardMembers } from '../../hooks/useBoardMembers';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    boardId: string;
    onCreate: (data: TaskFormData) => Promise<void>;
    isLoading?: boolean;
}

export default function CreateTaskModal({
    isOpen,
    onClose,
    boardId,
    onCreate,
    isLoading,
}: CreateTaskModalProps) {
    const { members } = useBoardMembers(boardId);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            due_date: '',
            assignee_id: '',
        },
    });

    const onSubmit = async (data: TaskFormData) => {
        await onCreate(data);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    const today = new Date().toISOString().split('T')[0];

    return (
        <Modal onClose={onClose}>
            <div className="bg-[var(--color-card-bg)] p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">
                    Create Task
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input
                        label="Title *"
                        type="text"
                        placeholder="Task title"
                        {...register('title')}
                        error={errors.title?.message}
                    />

                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--color-text-primary)]">
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            placeholder="Add a description (optional)..."
                            className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--color-text-primary)]">
                            Priority
                        </label>
                        <select
                            {...register('priority')}
                            className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-[var(--color-text-primary)]">
                            Deadline *
                        </label>
                        <input
                            type="date"
                            min={today}
                            {...register('due_date')}
                            className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                        {errors.due_date && (
                            <p className="text-sm text-red-500 mt-1">{errors.due_date.message}</p>
                        )}
                    </div>

                    <Controller
                        name="assignee_id"
                        control={control}
                        render={({ field }) => (
                            <AssigneeSelect
                                members={members || []}
                                value={field.value || ''}
                                onChange={field.onChange}
                                error={errors.assignee_id?.message}
                            />
                        )}
                    />

                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)] text-[var(--color-text-primary)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}