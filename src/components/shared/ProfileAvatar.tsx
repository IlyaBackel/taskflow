import { useUserData } from "../../hooks/useUserData";



export default function ProfileAvatar({ size }: { size: number }) {
    const { profile, user } = useUserData()

    if (profile?.avatar_url) {
        return (
            <img
                src={profile.avatar_url}
                alt="Profile Avatar"
                className="rounded-[50%] bg-primary-hover text-2xl"
                style={{ width: `${size}rem`, height: `${size}rem` }}
            />
        );
    }

    const initials = user.email.charAt(0) || profile?.name?.charAt(0) || '?';

    return (
        <div className={`flex items-center justify-center border-2 rounded-[50%] bg-primary-hover text-2xl`}
            style={{ width: `${size}rem`, height: `${size}rem`, fontSize: `${size * 0.4}em` }}
        >
            {initials.toUpperCase()}
        </div>
    )
}
