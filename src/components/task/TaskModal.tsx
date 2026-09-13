import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormData } from '../../schemas/task.schema';
import Modal from '../shared/Modal';
import Input from '../shared/Input';
import AssigneeSelect from './AssigneeSelect';
import { useBoardMembers } from '../../hooks/useBoardMembers';
import type { Task } from '../../types/task';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    boardId: string;
    task: Task | null;
    onSave: (data: TaskFormData) => Promise<void>;
    onDelete?: () => Promise<void>;
    isLoading?: boolean;
}

export default function TaskModal({
    isOpen,
    onClose,
    boardId,
    task,
    onSave,
    onDelete,
    isLoading,
}: TaskModalProps) {
    const { members } = useBoardMembers(boardId);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
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

    useEffect(() => {
        if (task) {
            reset({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'medium',
                due_date: task.due_date || '',
                assignee_id: task.assignee_id || '',
            });
        }
    }, [task, reset]);

    if (!isOpen || !task) return null;

    const today = new Date().toISOString().split('T')[0];

    return (
        <Modal onClose={onClose}>
            <div className="bg-[var(--color-card-bg)] p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">
                    Task Details
                </h2>

                <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
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
                            rows={4}
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

                    <div className="flex justify-between mt-2">
                        <div>
                            {onDelete && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm('Delete this task?')) {
                                            onDelete();
                                        }
                                    }}
                                    className="px-4 py-2 text-red-500 hover:text-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                        <div className="flex gap-3">
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
                                {isLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}