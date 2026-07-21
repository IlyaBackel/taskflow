import { useSession } from "../hooks/useSession";

export default function Profile() {

    const { user } = useSession();



    return (
        <div>Profile</div>
    )
}
