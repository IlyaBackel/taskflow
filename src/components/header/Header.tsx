import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import ThemeToggle from "../shared/ThemeToggle";
import { Link } from "react-router-dom";
import ProfileAvatar from "../shared/ProfileAvatar";

export default function Header() {
    const { signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="flex flex-row justify-between items-center gap-5 px-6 sm:px-10 sm:py-7 py-4 shadow-xl rounded-b-2xl border-olive-900">

            <Link to="/" className="text-2xl sm:text-4xl font-semibold text-primary-text">Task Flow</Link>

            <div className="flex flex-row items-center gap-7">
                <ThemeToggle />

                <div className="relative">
                    <div onClick={() => setIsOpen(!isOpen)}>
                        <ProfileAvatar size={4} />
                    </div>
                    {isOpen && (
                        <div className="flex flex-col items-start w-40 gap-4 py-2 justify-around absolute text-start right-0 mt-2 px-5 border border-gray-300 rounded-md shadow-xl bg-primary-bg z-10">
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
