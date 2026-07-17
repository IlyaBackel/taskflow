import { Outlet } from "react-router-dom";
import ThemeToggle from "../../components/shared/ThemeToggle";
import { useAuth } from "../../providers/AuthProvider";

export default function MainLayout() {
    const { signOut } = useAuth();

    return (
        <div>
            <header className="flex flex-row justify-end gap-5">

                <ThemeToggle />

                <div>
                    profile
                </div>
                <button
                    onClick={signOut}
                    className="text-sm text-red-500 hover:text-red-700"
                >
                    Sign Out
                </button>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    )
}
