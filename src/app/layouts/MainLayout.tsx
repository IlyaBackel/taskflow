import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header";
import { useUserData } from "../../hooks/useUserData";

export default function MainLayout() {
    const { isLoading } = useUserData();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <main className="px-10">
                <Outlet />
            </main>
        </div>
    )
}
