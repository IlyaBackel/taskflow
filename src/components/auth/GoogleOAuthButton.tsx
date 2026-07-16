import { supabase } from '../../services/supabaseClient';

export default function GoogleOAuthButton() {
    const handleGoogleSignIn = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) throw error;
        } catch (error) {
            console.error('Ошибка входа через Google:', error);
        }
    };

    return (
        <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full gap-3 py-3 px-4 text-sm sm:text-base font-medium rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-(--google-btn-bg) text-(--google-btn-text) border-(--google-btn-border) hover:bg-(--google-btn-hover-bg)"
        >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                    fill="#EA4335"
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.853 2.067-6.053 2.067-4.573 0-8.293-3.573-8.293-8.027S7.907 3.4 12.48 3.4c2.387 0 4.107.907 5.44 2.173l2.373-2.293C18.453 1.76 15.747.48 12.48.48 5.813.48.8 5.48.8 12s5.013 11.52 11.68 11.52c3.307 0 6.067-1.08 8.08-2.947 2.027-1.867 2.827-4.547 2.827-7.013 0-.68-.067-1.347-.2-1.96H12.48v1.32z"
                />
            </svg>
            <span>Sign in with Google</span>
        </button>
    );
}