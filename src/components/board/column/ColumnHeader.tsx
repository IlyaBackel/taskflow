import { useState } from 'react';
import Input from '../../shared/Input';

interface ColumnHeaderProps {
    title: string;
    color?: string;
    onRename: (newTitle: string) => void;
    onDelete: () => void;
    onAddTask: (id: string) => void;
}

export default function ColumnHeader({ title, color, onRename, onDelete, onAddTask }: ColumnHeaderProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingTitle, setEditingTitle] = useState(title);

    const handleRename = () => {
        if (editingTitle.trim()) {
            onRename(editingTitle.trim());
            setIsEditing(false);
        }
    };

    return (
        <div className="flex items-center justify-between mb-2">
            <div className='flex flex-row gap-3 items-center'>
                {isEditing ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleRename();
                        }}
                        className="flex-1"
                    >
                        <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={handleRename}
                            autoFocus
                            className="text-sm text-nowrap"
                        />
                    </form>
                ) : (
                    <h3
                        className="font-semibold cursor-pointer hover:text-primary text-nowrap"
                        onDoubleClick={() => setIsEditing(true)}
                        style={{ color: color || 'var(--color-text-primary)' }}
                    >
                        {title}
                    </h3>
                )}

                <button
                    onClick={() => onAddTask(title)}
                    className="text-lg w-7 h-7 sm:w-10 sm:h-10 text-secondary-text hover:bg-border-primary py-2 rounded-[50%] transition-colors flex items-center justify-center border "
                >
                    +
                </button>
            </div>
            <button
                onClick={onDelete}
                className="text-xs text-red-500 hover:text-red-700 w-fit"
            >
                ✕
            </button>
        </div>
    );
}