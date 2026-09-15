import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormData } from '../../schemas/task.schema';
import Modal from '../shared/Modal';
import TaskFormFields from './TaskFormFields';
import type { Task } from '../../types/task';
import TaskFormButtons from './TaskFormButtons';
import CommentsSection from './comments/CommentsSection';

interface TaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    boardId: string;
    mode: 'create' | 'edit';
    task?: Task | null;
    onSubmit: (data: TaskFormData) => Promise<void>;
    onDelete?: () => Promise<void>;
    isLoading?: boolean;
}

export default function TaskFormModal({
    isOpen,
    onClose,
    boardId,
    mode,
    task,
    onSubmit,
    onDelete,
    isLoading,
}: TaskFormModalProps) {
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
        if (mode === 'edit' && task) {
            reset({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'medium',
                due_date: task.due_date || '',
                assignee_id: task.assignee_id || '',
            });
        }
        if (mode === 'create') {
            reset({
                title: '',
                description: '',
                priority: 'medium',
                due_date: '',
                assignee_id: '',
            });
        }
    }, [mode, task, reset]);

    const handleFormSubmit = async (data: TaskFormData) => {
        await onSubmit(data);
        if (mode === 'create') reset();
        onClose();
    };

    if (!isOpen) return null;
    if (mode === 'edit' && !task) return null;

    const title = mode === 'create' ? 'Create Task' : 'Task Details';

    return (
        <Modal onClose={onClose}>
            <div className="bg-card-bg p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-primary-text">
                    {title}
                </h2>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
                    <TaskFormFields
                        register={register}
                        control={control}
                        errors={errors}
                        boardId={boardId}
                    />

                    <TaskFormButtons
                        mode={mode}
                        isLoading={isLoading}
                        onCancel={onClose}
                        onDelete={onDelete}
                    />
                </form>

                {mode === 'edit' && task && <CommentsSection taskId={task.id} />}
            </div>
        </Modal>
    );
}