import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function ConfirmEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || 'your email';

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user?.confirmed_at) {
                navigate('/boards');
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session?.user?.confirmed_at) {
                    navigate('/boards');
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-primary-bg text-primary-text">
            <div className="w-full max-w-md p-6 bg-card-bg rounded-lg shadow-md border border-border-primary text-center">
                <h1 className="text-2xl font-bold mb-4">Check your email</h1>
                <p className="mb-2">
                    We've sent a confirmation link to <strong>{email}</strong>.
                </p>
                <p className="text-sm text-secondary-text mb-6">
                    Click the link in the email to confirm your account. You'll be redirected
                    to your boards automatically.
                </p>
            </div>
        </div>
    );
}