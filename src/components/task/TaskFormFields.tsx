import { Controller, type UseFormRegister, type Control, type FieldErrors } from 'react-hook-form';
import Input from '../shared/Input';
import AssigneeSelect from './AssigneeSelect';
import { useBoardMembers } from '../../hooks/useBoardMembers';
import type { TaskFormInput } from '../../schemas/task.schema';

interface TaskFormFieldsProps {
    register: UseFormRegister<TaskFormInput>;
    control: Control<TaskFormInput>;
    errors: FieldErrors<TaskFormInput>;
    boardId: string;
}

export default function TaskFormFields({
    register,
    control,
    errors,
    boardId,
}: TaskFormFieldsProps) {
    const { members } = useBoardMembers(boardId);

    const newLocal = "block text-sm font-medium mb-1 text-primary-text";
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
                <label className={newLocal}>
                    Description
                </label>
                <textarea
                    {...register('description')}
                    rows={4}
                    placeholder="Add a description (optional)..."
                    className="w-full px-3 py-2 rounded-lg border border-border-primary bg-card-bg text-primary-text placeholder-placeholder focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-primary-text">
                    Priority
                </label>
                <select
                    {...register('priority')}
                    className="w-full px-3 py-2 rounded-lg border border-border-primary bg-card-bg text-primary-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-primary-text">
                    Deadline
                </label>
                <input
                    type="date"
                    {...register('due_date')}
                    className="w-full px-3 py-2 rounded-lg border border-border-primary bg-card-bg text-primary-text focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-secondary-text mt-1">
                    Past dates are allowed. Overdue tasks are highlighted on the board.
                </p>
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