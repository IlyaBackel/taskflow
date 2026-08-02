import { useState } from 'react';
import Input from '../shared/Input';

interface ColumnProps {
    column: any;
    tasks: any[];
    onRename: (columnId: string, newTitle: string) => void;
    onDelete: (columnId: string) => void;
    onAddTask: (columnId: string, title: string) => void;
}

export default function Column({ column, tasks, onRename, onDelete }: ColumnProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingTitle, setEditingTitle] = useState(column.title);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleRename = () => {
        if (editingTitle.trim()) {
            onRename(column.id, editingTitle.trim());
            setIsEditing(false);
        }
    };

    const handleAddTask = () => {
    };

    return (
        <div className="min-w-30 min-h-70 bg-card-bg p-3 rounded shadow"
            style={{ backgroundColor: `${column.color}` }}>
            <div className="flex items-center justify-between mb-2">
                {isEditing ? (
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleRename(); }}
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
                        className="font-semibold cursor-pointer text-primary-text hover:text-primary"
                        onDoubleClick={() => setIsEditing(true)}
                    >
                        {column.title}
                    </h3>
                )}
                <button
                    onClick={() => onDelete(column.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                >
                    ✕
                </button>
            </div>

            <div className="space-y-2">
                {tasks.map((task) => (
                    <div key={task.id} className="p-2 bg-primary-bg rounded shadow-sm flex justify-between items-center">
                        <span>{task.title}</span>
                        <button
                            className="text-xs text-red-400 hover:text-red-600"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-2 flex gap-1">
                <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add task..."
                    className="text-sm flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <button
                    onClick={handleAddTask}
                    className="text-sm bg-primary text-white px-2 py-1 rounded hover:bg-primary-hover"
                >
                    +
                </button>
            </div>
        </div>
    );
}