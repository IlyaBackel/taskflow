import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--color-primary-bg)] text-[var(--color-text-primary)]">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-[var(--color-primary)] mb-2">404</h1>
                <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
                <p className="text-[var(--color-text-secondary)] mb-6">
                    The page you're looking for doesn't exist or was moved.
                </p>
                <Link
                    to="/boards"
                    className="inline-block px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                    Go to boards
                </Link>
            </div>
        </div>
    );
}