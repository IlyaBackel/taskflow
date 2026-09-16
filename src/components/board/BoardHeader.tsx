import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../../services/profileService';
import type { Board } from '../../types/board';
import type { Profile } from '../../types/profile';

interface BoardHeaderProps {
    board: Board;
    onMembersClick: () => void;
}

export default function BoardHeader({ board, onMembersClick }: BoardHeaderProps) {
    const { data: owner } = useQuery<Profile>({
        queryKey: ['profile', board.owner_id],
        queryFn: () => fetchProfile(board.owner_id),
        enabled: !!board.owner_id,
        staleTime: 5 * 60 * 1000,
    });

    const ownerName = owner?.name || owner?.email || 'Unknown';

    return (
        <div className="w-full flex flex-col sm:flex-row gap-4">
            <div className="relative h-48 sm:w-110 sm:h-56 md:w-120 md:h-74 lg:w-200 lg:h-90 rounded-xl overflow-hidden shadow-lg shrink-0">
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${board.cover_image || '/not-found-image.svg'})`,
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <h1 className="absolute bottom-4 left-4 right-4 text-white text-2xl font-bold drop-shadow-lg">
                    {board.title}
                </h1>
            </div>

            <div className="flex flex-col justify-center gap-6 sm:pl-4">

                <p className="text-md text-secondary-text mt-2">
                    Created: {new Date(board.created_at).toLocaleDateString()} by{' '}
                    <span className="font-medium text-lg text-primary-text">{ownerName}</span>
                </p>

                <button
                    onClick={onMembersClick}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors w-fit"
                >
                    Members
                </button>
            </div>
        </div>
    );
}