import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import ThemeToggle from "../shared/ThemeToggle";
import { Link } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";

export default function Header() {
    const { signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="flex flex-row justify-between items-center gap-5 px-10 py-5 border-b-2 border-olive-900">

            <Link to="/" className="text-3xl font-semibold text-primary-text">Task Flow</Link>

            <div className="flex flex-row items-center gap-7">
                <ThemeToggle />

                <div className="relative">

                    <ProfileAvatar onClick={() => setIsOpen(!isOpen)} />
                    {isOpen && (
                        <div className="flex flex-col items-start w-40 gap-4 py-2 justify-around absolute text-start right-0 mt-2 px-5 rounded-md shadow-lg border bg-primary-bg z-10">
                            <Link to="/profile" className="text-xl text-start  text-primary-text">Profile</Link>
                            <Link to="/boards" className="text-xl  text-primary-text hover:text-red-700">Boards</Link>
                            <button
                                onClick={signOut}
                                className="text-xl text-primary-text hover:text-red-700"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>



        </header>
    )
}
