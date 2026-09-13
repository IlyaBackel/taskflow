// src/components/board/BoardMembersModal.tsx
import { useState } from 'react';
import { useBoardMembers } from '../../hooks/useBoardMembers';
import { useUserData } from '../../hooks/useUserData';
import Modal from '../shared/Modal';

interface BoardMembersModalProps {
    isOpen: boolean;
    onClose: () => void;
    boardId: string;
}

export default function BoardMembersModal({ isOpen, onClose, boardId }: BoardMembersModalProps) {
    const { members, searchUsers, addMember, removeMember, isAdding, isRemoving } = useBoardMembers(boardId);
    const { user } = useUserData();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const results = await searchUsers(query);
            // Исключаем уже добавленных участников
            const memberIds = members?.map(m => m.profiles[0]?.id) || [];
            const filtered = results.filter(u => !memberIds.includes(u.id));
            setSearchResults(filtered);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAdd = async (userId: string) => {
        await addMember({ userId });
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleRemove = async (memberId: string, memberUserId: string) => {
        if (memberUserId === user?.id) {
            alert('You cannot remove yourself.');
            return;
        }
        if (window.confirm('Remove this member?')) {
            await removeMember(memberId);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal onClose={onClose}>
            <div className="bg-[var(--color-card-bg)] p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">Board Members</h2>

                {/* Поиск */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search users by email..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 bg-[var(--color-card-bg)] text-[var(--color-text-primary)]"
                    />
                    {isSearching && <span className="text-sm text-[var(--color-text-secondary)]">Searching...</span>}
                    {searchResults.length > 0 && (
                        <ul className="mt-2 border border-[var(--color-border)] rounded-lg divide-y divide-[var(--color-border)]">
                            {searchResults.map((u) => (
                                <li key={u.id} className="flex justify-between items-center p-2 hover:bg-[var(--color-border)]">
                                    <span>{u.name || u.email}</span>
                                    <button
                                        onClick={() => handleAdd(u.id)}
                                        disabled={isAdding}
                                        className="text-sm bg-[var(--color-primary)] text-white px-2 py-1 rounded hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
                                    >
                                        Add
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Список участников */}
                <div>
                    <h3 className="font-medium mb-2 text-[var(--color-text-primary)]">Current Members</h3>
                    {members?.length === 0 && <p className="text-sm text-[var(--color-text-secondary)]">No members yet.</p>}
                    <ul className="space-y-1">
                        {members?.map((member) => {
                            const profile = member.profiles?.[0];
                            if (!profile) return null;
                            return (
                                <li key={member.id} className="flex justify-between items-center p-2 border-b border-[var(--color-border)]">
                                    <div>
                                        <span className="font-medium">{profile.name || profile.email}</span>
                                        <span className="text-xs text-[var(--color-text-secondary)] ml-2">{member.role}</span>
                                    </div>
                                    {profile.id !== user?.id && (
                                        <button
                                            onClick={() => handleRemove(member.id, profile.id)}
                                            disabled={isRemoving}
                                            className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}