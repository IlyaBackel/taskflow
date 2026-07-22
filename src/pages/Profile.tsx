import { useUserData } from "../hooks/useUserData";

export default function Profile() {
    const { profile, user } = useUserData()

    return (
        <div>
            <p>{profile?.name}</p>
            <p>{user?.email}</p>
        </div>
    )
}
