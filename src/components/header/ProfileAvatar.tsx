import { useUserData } from "../../hooks/useUserData";

export default function ProfileAvatar({ onClick }) {
    const { profile, user } = useUserData()

    if (profile?.avatar_url) {
        return (
            <img
                src={profile.avatar_url}
                alt="Profile Avatar"
                className="w-10 h-10 rounded-full"
            />
        );
    }

    const initials = user.email.charAt(0) || profile?.name?.charAt(0) || '?';

    return (
        <div className="flex items-center justify-center border-2 w-15 h-15 rounded-[50%] bg-primary-hover text-2xl" onClick={onClick}>
            {initials.toUpperCase()}
        </div>
    )
}
