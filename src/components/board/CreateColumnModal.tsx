import { useState } from 'react';
import Input from '../shared/Input';
import { COLORS } from '../../constants/colors';

interface CreateColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (title: string, color: string) => void;
    isCreating: boolean;
}

export default function CreateColumnModal({
    isOpen,
    onClose,
    onCreate,
    isCreating,
}: CreateColumnModalProps) {
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('#3b83f66e');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onCreate(title.trim(), color);
        setTitle('');
        setColor('#3b82f6');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card-bg p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-primary-text">
                    Add New Column
                </h2>
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Column Name"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter column name..."
                        autoFocus
                        className="mb-4"
                    />
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-primary-text">
                            Color
                        </label>
                        <div className="flex gap-2 flex-wrap">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`w-8 h-8 rounded-full border-2 ${color === c
                                        ? 'border-black dark:border-white'
                                        : 'border-transparent'
                                        }`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-border-primary rounded-lg text-primary-text"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating || !title.trim()}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}