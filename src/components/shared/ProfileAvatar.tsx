import { useUserData } from '../../hooks/useUserData';
import type { Profile } from '../../types/profile';

interface ProfileAvatarProps {
    profile?: Profile | null;
    size?: number;
    className?: string;
    onClick?: () => void;
}

export default function ProfileAvatar({
    profile: profileProp,
    size = 40,
    className = '',
    onClick,
}: ProfileAvatarProps) {
    const { profile: currentProfile, user } = useUserData();
    const profile = profileProp ?? currentProfile;
    const fallbackEmail = profile?.email || user?.email;

    const avatarUrl = profile?.avatar_url;
    const initials = (profile?.name || fallbackEmail || '?').charAt(0).toUpperCase();

    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt="Avatar"
                className={`rounded-full object-cover shrink-0 ${className}`}
                style={{ width: size, height: size }}
                onClick={onClick}
            />
        );
    }

    return (
        <div
            className={`rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 ${className}`}
            style={{ width: size, height: size, fontSize: size * 0.4 }}
            onClick={onClick}
        >
            {initials}
        </div>
    );
}