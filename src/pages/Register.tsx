import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import AuthForm from '../components/auth/AuthForm';
import type { RegisterFormData } from '../schemas/auth.schema';

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegister = async (data: RegisterFormData) => {
        try {
            setIsLoading(true);
            setError(null);

            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/login`,
                    data: {
                        name: data.name,
                    },
                },
            });

            if (signUpError) throw signUpError;
            if (!authData.user) throw new Error('Registration failed');

            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({ id: authData.user.id, name: data.name }, { onConflict: 'id' });

            if (profileError) throw profileError;

            console.log(authData.user.confirmed_at);

            authData.user.confirmed_at
                ? navigate('/boards')
                : navigate('/confirm-email', { state: { email: data.email } });

        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8 bg-primary-bg text-primary-text transition-colors duration-300">
            <div className="w-full max-w-md space-y-6 sm:space-y-8">
                <h2 className="text-center font-semibold text-lg sm:text-2xl text-primary-text">
                    Sign Up
                </h2>
                <h1 className="text-start text-primary-text text-xl sm:text-3xl">
                    Create Account
                </h1>
                <p className="font-light text-sm sm:text-lg text-secondary-text">
                    Please enter your information to create your account.
                </p>

                <AuthForm
                    mode="register"
                    onSubmit={handleRegister}
                    isLoading={isLoading}
                    error={error}
                />

                <p className="text-center text-sm sm:text-lg text-gray-600">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-primary hover:text-primary-hover font-medium transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}