import { useState } from "react";
import ProfileAvatar from "../components/shared/ProfileAvatar";
import { useUserData } from "../hooks/useUserData";
import EditModal from "../components/profile/EditModal";

export default function Profile() {
    const [isOpen, setIsOpen] = useState(false)
    const { profile, user } = useUserData()

    return (
        <div className="flex flex-col w-fit gap-5">
            <div className="flex h-fit flex-col sm:flex-row items-center gap-5">
                <ProfileAvatar size={100} />
                <div className="flex flex-col  gap-1">
                    <p className="text-primary-text text-2xl">{profile?.name}</p>
                    <p className="text-secondary-text text-lg">{user?.email}</p>
                </div>

            </div>

            <button className="text-center w-fit px-20 border-amber-50 text-primary-text py-4 rounded-lg bg-primary hover:bg-primary-hover shadow-lg text-xl"
                onClick={() => setIsOpen(!isOpen)}
            >
                Edit Profile
            </button>

            {isOpen && <EditModal isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                userId={user?.id || ''}
                currentName={profile?.name || ''}
                currentAvatarUrl={profile?.avatar_url} />}
        </div>
    )
}
