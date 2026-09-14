import { useState } from 'react';
import Input from '../../shared/Input';

interface ColumnHeaderProps {
    title: string;
    color?: string;
    onRename: (newTitle: string) => void;
    onDelete: () => void;
}

export default function ColumnHeader({ title, color, onRename, onDelete }: ColumnHeaderProps) {
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
                        className="text-sm"
                    />
                </form>
            ) : (
                <h3
                    className="font-semibold cursor-pointer hover:text-[var(--color-primary)]"
                    onDoubleClick={() => setIsEditing(true)}
                    style={{ color: color || 'var(--color-text-primary)' }}
                >
                    {title}
                </h3>
            )}
            <button
                onClick={onDelete}
                className="text-xs text-red-500 hover:text-red-700"
            >
                ✕
            </button>
        </div>
    );
}