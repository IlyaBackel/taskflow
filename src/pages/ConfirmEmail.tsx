import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function ConfirmEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || 'your email';
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.confirmed_at) {
                navigate('/boards');
            }
        };
        checkSession();
    }, [navigate]);

    const handleCheckConfirmation = async () => {
        setChecking(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.confirmed_at) {
            navigate('/boards');
        } else {
            alert('Email not confirmed yet. Please check your inbox and confirm your email.');
        }
        setChecking(false);
    };

    const handleResendEmail = async () => {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        });
        if (error) {
            alert(error.message);
        } else {
            alert('Confirmation email resent successfully!');
        }
    };

    return (
        <div>
            <p>Checking your email...</p>
        </div>
    );
}