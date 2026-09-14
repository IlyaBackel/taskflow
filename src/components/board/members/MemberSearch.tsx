import type { Profile } from "../../../types/profile";

interface MemberSearchProps {
    searchQuery: string;
    searchResults: Profile[];
    isSearching: boolean;
    isAdding: boolean;
    onSearch: (query: string) => void;
    onAdd: (userId: string) => void;
}

export default function MemberSearch({
    searchQuery,
    searchResults,
    isSearching,
    isAdding,
    onSearch,
    onAdd,
}: MemberSearchProps) {
    return (
        <div className="mb-4">
            <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 bg-[var(--color-card-bg)] text-[var(--color-text-primary)]"
            />
            {isSearching && (
                <span className="text-sm text-[var(--color-text-secondary)]">Searching...</span>
            )}
            {searchResults.length > 0 && (
                <ul className="mt-2 border border-[var(--color-border)] rounded-lg divide-y divide-[var(--color-border)]">
                    {searchResults.map((u) => (
                        <li
                            key={u.id}
                            className="flex justify-between items-center p-2 hover:bg-[var(--color-border)]"
                        >
                            <span>{u.name || u.email}</span>
                            <button
                                onClick={() => onAdd(u.id)}
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
    );
}