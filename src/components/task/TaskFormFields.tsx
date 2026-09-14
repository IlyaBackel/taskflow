import { Controller, type UseFormRegister, type Control, type FieldErrors } from 'react-hook-form';
import Input from '../shared/Input';
import AssigneeSelect from './AssigneeSelect';
import { useBoardMembers } from '../../hooks/useBoardMembers';
import type { TaskFormData } from '../../schemas/task.schema';

interface TaskFormFieldsProps {
    register: UseFormRegister<TaskFormData>;
    control: Control<TaskFormData>;
    errors: FieldErrors<TaskFormData>;
    boardId: string;
}

export default function TaskFormFields({ register, control, errors, boardId }: TaskFormFieldsProps) {
    const { members } = useBoardMembers(boardId);
    const today = new Date().toISOString().split('T')[0];

    return (
        <>
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
        </>
    );
}