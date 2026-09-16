import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import type { Profile } from '../../../types/profile';

interface MemberSearchProps {
    searchResults: Profile[];
    isSearching: boolean;
    isAdding: boolean;
    onSearch: (query: string) => void;
    onAdd: (userId: string) => void;
}

export default function MemberSearch({
    searchResults,
    isSearching,
    isAdding,
    onSearch,
    onAdd,
}: MemberSearchProps) {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);

    const onSearchRef = useRef(onSearch);
    useEffect(() => {
        onSearchRef.current = onSearch;
    });

    useEffect(() => {
        onSearchRef.current(debouncedQuery);
    }, [debouncedQuery]);

    return (
        <div className="mb-4">
            <input
                type="text"
                placeholder="Search users by name or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border border-border-primary rounded-lg px-3 py-2 bg-card-bg text-primary-text"
            />
            {isSearching && (
                <span className="text-sm text-secondary-text">Searching...</span>
            )}
            {searchResults.length > 0 && (
                <ul className="mt-2 border border-border-primary rounded-lg divide-y divide-border-primary">
                    {searchResults.map((u) => (
                        <li
                            key={u.id}
                            className="flex justify-between items-center p-2 hover:bg-border-primary"
                        >
                            <span>{u.name || u.email}</span>
                            <button
                                onClick={() => onAdd(u.id)}
                                disabled={isAdding}
                                className="text-sm bg-primary text-white px-2 py-1 rounded hover:bg-primary-hover disabled:opacity-50"
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