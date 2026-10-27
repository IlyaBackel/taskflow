import { useCallback, useState } from 'react';
import { useBoardMembers } from '../../../hooks/useBoardMembers';
import { useUserData } from '../../../hooks/useUserData';
import Modal from '../../shared/Modal';
import MemberSearch from './MemberSearch';
import MemberList from './MemberList';
import type { Profile } from '../../../types/profile';
import { notifyError, notifySuccess } from '../../../utils/toast';

interface BoardMembersModalProps {
    isOpen: boolean;
    onClose: () => void;
    boardId: string;
}

export default function BoardMembersModal({ isOpen, onClose, boardId }: BoardMembersModalProps) {
    const { members, searchUsers, addMember, removeMember, isAdding, isRemoving } =
        useBoardMembers(boardId);
    const { user } = useUserData();
    const [searchResults, setSearchResults] = useState<Profile[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const isCurrentUserOwner = members?.some(
        (m) => m.profiles[0]?.id === user?.id && m.role === 'owner'
    );

    const handleSearch = useCallback(
        async (query: string) => {
            if (!query.trim()) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const results = await searchUsers(query);
                const memberIds = members?.map((m) => m.profiles[0]?.id) || [];
                const filtered = results.filter((u) => !memberIds.includes(u.id));
                setSearchResults(filtered);
            } catch (e) {
                console.error(e);
            } finally {
                setIsSearching(false);
            }
        },
        [members, searchUsers]
    );

    const handleAdd = async (userId: string) => {
        try {
            await addMember({ userId });
            notifySuccess('Member added');
            setSearchResults([]);
        } catch (err) {
            notifyError(err, "Couldn't add member");
        }
    };

    const handleRemove = async (memberId: string, memberUserId: string, memberRole: string) => {
        if (memberRole === 'owner') {
            notifyError(new Error('Cannot remove the board owner'));
            return;
        }
        if (memberUserId === user?.id) {
            notifyError(new Error('You cannot remove yourself'));
            return;
        }
        if (!window.confirm('Remove this member?')) return;
        try {
            await removeMember(memberId);
            notifySuccess('Member removed');
        } catch (err) {
            notifyError(err, "Couldn't remove member");
        }
    };

    if (!isOpen) return null;

    return (
        <Modal onClose={onClose} labelledBy="members-modal-title">
            <div className="bg-card-bg p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2
                    id="members-modal-title"
                    className="text-xl font-bold mb-4 text-primary-text"
                >
                    Board Members
                </h2>

                {isCurrentUserOwner && (
                    <MemberSearch
                        searchResults={searchResults}
                        isSearching={isSearching}
                        isAdding={isAdding}
                        onSearch={handleSearch}
                        onAdd={handleAdd}
                    />
                )}

                <MemberList
                    members={members || []}
                    currentUserId={user?.id}
                    isCurrentUserOwner={!!isCurrentUserOwner}
                    isRemoving={isRemoving}
                    onRemove={handleRemove}
                />

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}